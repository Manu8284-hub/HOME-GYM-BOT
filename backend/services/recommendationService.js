import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Exercise from '../models/Exercise.js';
import Nutrition from '../models/Nutrition.js';
import { getExerciseDataset } from './exerciseDataset.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const nutritionPath = process.env.NUTRITION_DATASET_PATH || path.resolve(projectRoot, 'dataset', 'nutrition.csv');

function connected() {
  return Exercise.db?.readyState === 1;
}

function split(value) {
  return String(value || '').split('|').map((item) => item.trim()).filter(Boolean);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = '';
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') quoted = !quoted;
    else if (char === ',' && !quoted) { row.push(value.trim()); value = ''; }
    else if (char === '\n' && !quoted) { row.push(value.trim()); rows.push(row); row = []; value = ''; }
    else if (char !== '\r') value += char;
  }
  if (value || row.length) { row.push(value.trim()); rows.push(row); }
  return rows;
}

function loadNutritionFile() {
  if (!fs.existsSync(nutritionPath)) return [];
  const rows = parseCsv(fs.readFileSync(nutritionPath, 'utf8').replace(/^\uFEFF/, ''));
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((values) => {
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
    return {
      externalId: record.id,
      meal: record.meal,
      title: record.title,
      dietaryPreferences: split(record.dietary_preferences),
      goals: split(record.goals),
      bmiCategories: split(record.bmi_categories),
      fitnessLevels: split(record.fitness_levels),
      calories: record.calories,
      protein: record.protein,
      foods: record.foods,
      tags: split(record.tags)
    };
  }).filter((record) => record.externalId && record.title);
}

function profileTerms(profile = {}) {
  const goal = String(profile.fitnessGoal || 'Maintain Weight').toLowerCase();
  const level = String(profile.fitnessLevel || 'Intermediate');
  const bmiCategory = String(profile.bmiCategory || 'Normal weight');
  const preference = String(profile.dietaryPreference || 'Vegetarian');
  const equipment = Array.isArray(profile.availableEquipment)
    ? profile.availableEquipment.map(String)
    : [];
  return { goal, level, bmiCategory, preference, equipment };
}

function scoreExercise(exercise, query, profile) {
  const { goal, level, equipment } = profileTerms(profile);
  const queryTerms = String(query || '').toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 1);
  const haystack = [exercise.name, exercise.bodyPart, exercise.equipment, exercise.target, ...(exercise.secondaryMuscles || [])].join(' ').toLowerCase();
  let score = queryTerms.reduce((total, term) => total + (haystack.includes(term) ? (exercise.name.toLowerCase().includes(term) ? 4 : 1) : 0), 0);
  if (exercise.goals?.some((item) => item.toLowerCase().includes(goal))) score += 3;
  if (exercise.fitnessLevels?.some((item) => item.toLowerCase() === level.toLowerCase())) score += 2;
  if (!equipment.length && String(profile.exercisePreference || '').toLowerCase().includes('home')) {
    score += exercise.equipment.toLowerCase().includes('body weight') ? 4 : -8;
  } else if (equipment.length && !equipment.some((item) => exercise.equipment.toLowerCase().includes(item.toLowerCase()))) {
    score -= 8;
  }
  return score;
}

function scoreNutrition(record, profile) {
  const { goal, level, bmiCategory, preference } = profileTerms(profile);
  let score = 0;
  if (record.dietaryPreferences.some((item) => item.toLowerCase() === preference.toLowerCase())) score += 6;
  if (record.goals.some((item) => item.toLowerCase().includes(goal))) score += 4;
  if (record.bmiCategories.some((item) => item.toLowerCase() === bmiCategory.toLowerCase())) score += 3;
  if (record.fitnessLevels.some((item) => item.toLowerCase() === level.toLowerCase())) score += 2;
  return score;
}

function normalizeExercise(record) {
  return {
    ...record,
    id: record.id || record.externalId,
    secondaryMuscles: record.secondaryMuscles || [],
    instructions: record.instructions || []
  };
}

export async function recommendExercises(profile = {}, query = '', limit = 8) {
  let records = [];
  if (connected()) {
    records = await Exercise.find({}).lean();
  } else {
    records = getExerciseDataset().map(normalizeExercise);
  }
  return records.map((record) => ({ record, score: scoreExercise(record, query, profile) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ record }) => normalizeExercise(record));
}

export async function recommendNutrition(profile = {}, meal = '', limit = 8) {
  let records = [];
  if (connected()) records = await Nutrition.find({}).lean();
  else records = loadNutritionFile();
  const mealTerm = String(meal || '').toLowerCase();
  return records.map((record) => ({ record, score: scoreNutrition(record, profile) + (mealTerm && record.meal.toLowerCase().includes(mealTerm) ? 3 : 0) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ record }) => record);
}

export function formatExerciseRecommendations(records) {
  return records.map((exercise) => [
    `Exercise: ${exercise.name}`,
    `Equipment: ${exercise.equipment}`,
    `Target: ${exercise.target}`,
    `Instructions: ${(exercise.instructions || []).join(' ')}`
  ].join('\n')).join('\n\n');
}

export function formatNutritionRecommendations(records) {
  return records.map((meal) => [
    `Meal: ${meal.meal} - ${meal.title}`,
    `Diet: ${(meal.dietaryPreferences || []).join(', ')}`,
    `Calories: ${meal.calories}`,
    `Protein: ${meal.protein}`,
    `Foods: ${meal.foods}`
  ].join('\n')).join('\n\n');
}

export async function seedReferenceData() {
  if (!connected()) return { exercises: 0, nutrition: 0 };
  const exerciseTags = (exercise) => {
    const text = `${exercise.name} ${exercise.bodyPart} ${exercise.target}`.toLowerCase();
    const goals = [];
    if (/cardio|heart|conditioning|aerobic|jump|run|burpee/.test(text)) goals.push('Lose Weight');
    if (/strength|muscle|chest|back|shoulder|biceps|triceps|quad|glute|hamstring/.test(text)) goals.push('Build Muscle');
    if (!goals.length) goals.push('Maintain Weight');
    return {
      goals,
      fitnessLevels: exercise.difficulty
        ? [exercise.difficulty]
        : (exercise.equipment.toLowerCase().includes('body weight') ? ['Beginner', 'Intermediate'] : ['Intermediate', 'Advanced'])
    };
  };
  const exercises = getExerciseDataset().map((exercise) => ({
    updateOne: {
      filter: { externalId: exercise.id },
      update: { $set: { ...exerciseTags(exercise), externalId: exercise.id, name: exercise.name, bodyPart: exercise.bodyPart, equipment: exercise.equipment, gifUrl: exercise.gifUrl, target: exercise.target, secondaryMuscles: exercise.secondaryMuscles, instructions: exercise.instructions } },
      upsert: true
    }
  }));
  const nutrition = loadNutritionFile().map((record) => ({
    updateOne: { filter: { externalId: record.externalId }, update: { $set: record }, upsert: true }
  }));
  if (exercises.length) await Exercise.bulkWrite(exercises, { ordered: false });
  if (nutrition.length) await Nutrition.bulkWrite(nutrition, { ordered: false });
  return { exercises: exercises.length, nutrition: nutrition.length };
}
