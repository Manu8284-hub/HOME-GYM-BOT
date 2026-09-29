import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const csvPath = process.env.DIET_DATASET_PATH || path.resolve(projectRoot, 'dataset', 'diet.csv');
let cachedPrograms = null;

function parseCsv(text) {
  const records = [];
  let record = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      record.push(value.trim());
      value = '';
    } else if (char === '\n' && !quoted) {
      record.push(value.trim());
      records.push(record);
      record = [];
      value = '';
    } else if (char !== '\r') {
      value += char;
    }
  }

  if (value || record.length) {
    record.push(value.trim());
    records.push(record);
  }

  return records;
}

function loadPrograms() {
  if (!fs.existsSync(csvPath)) return [];
  const rows = parseCsv(fs.readFileSync(csvPath, 'utf8').replace(/^\uFEFF/, ''));
  if (rows.length < 2) return [];

  const headers = rows[0];
  return rows.slice(1).map((values) => {
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
    return {
      title: record.title,
      description: record.description,
      level: record.level,
      goal: record.goal,
      equipment: record.equipment,
      programLength: record.program_length,
      timePerWorkout: record.time_per_workout,
      totalExercises: record.total_exercises
    };
  }).filter((program) => program.title && program.title.trim().length > 2);
}

export function getProgramDataset() {
  if (!cachedPrograms) cachedPrograms = loadPrograms();
  return cachedPrograms;
}

export function formatProgramContext(profile = {}) {
  const programs = getProgramDataset();
  if (!programs.length) return '';

  const query = `${profile.fitnessGoal || ''} ${profile.fitnessLevel || ''} ${profile.exercisePreference || ''}`.toLowerCase();
  const terms = query.split(/[^a-z0-9]+/).filter((term) => term.length > 2);
  const homeOnly = String(profile.exercisePreference || '').toLowerCase().includes('home');
  const matches = programs.map((program) => {
    const searchable = `${program.title} ${program.description} ${program.level} ${program.goal} ${program.equipment}`.toLowerCase();
    const score = terms.reduce((total, term) => total + (searchable.includes(term) ? 1 : 0), 0);
    return { program, score };
  }).filter(({ program, score }) => score > 0 && (!homeOnly || program.equipment.toLowerCase().includes('home')))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ program }) => program);

  if (!matches.length) return '';
  return matches.map((program) => [
    `Program: ${program.title}`,
    `Goal: ${program.goal}`,
    `Level: ${program.level}`,
    `Equipment: ${program.equipment}`,
    `Length: ${program.programLength} weeks`,
    `Workout time: ${program.timePerWorkout} minutes`,
    `Description: ${program.description}`
  ].join('\n')).join('\n\n');
}
