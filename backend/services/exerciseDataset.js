import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const DEFAULT_PATHS = [
  process.env.EXERCISES_CSV_PATH,
  path.resolve(projectRoot, 'dataset', 'exercises.csv'),
  path.resolve(process.cwd(), 'data', 'exercises.csv'),
  path.resolve(process.cwd(), 'backend', 'data', 'exercises.csv'),
  'e:\\D\\Downloads\\exercises.csv'
].filter(Boolean);

let cachedExercises = null;

function parseCsvLine(line) {
  const values = [];
  let value = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      values.push(value.trim());
      value = '';
    } else {
      value += char;
    }
  }

  values.push(value.trim());
  return values;
}

function readDataset() {
  const filePath = DEFAULT_PATHS.find((candidate) => fs.existsSync(candidate));
  if (!filePath) return [];

  const rows = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (rows.length < 2) return [];

  const headers = parseCsvLine(rows[0]);
  return rows.slice(1).map((row) => {
    const values = parseCsvLine(row);
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] || '']));
    const instructions = Object.entries(record)
      .filter(([key, value]) => key.startsWith('instructions/') && value)
      .sort(([a], [b]) => Number(a.split('/')[1]) - Number(b.split('/')[1]))
      .map(([, value]) => value);
    const secondaryMuscles = Object.entries(record)
      .filter(([key, value]) => key.startsWith('secondaryMuscles/') && value)
      .map(([, value]) => value)
      .filter(Boolean);

    return {
      id: record.id,
      name: record.name,
      bodyPart: record.bodyPart,
      equipment: record.equipment,
      target: record.target,
      secondaryMuscles,
      instructions,
      gifUrl: record.gifUrl
    };
  }).filter((exercise) => exercise.name);
}

export function getExerciseDataset() {
  if (!cachedExercises) cachedExercises = readDataset();
  return cachedExercises;
}

export function searchExerciseDataset(query, { bodyweightOnly = false, limit = 8 } = {}) {
  const exercises = getExerciseDataset();
  const terms = String(query || '').toLowerCase().split(/[^a-z0-9]+/).filter((term) => term.length > 1);

  return exercises
    .map((exercise) => {
      const haystack = [exercise.name, exercise.bodyPart, exercise.equipment, exercise.target, ...exercise.secondaryMuscles].join(' ').toLowerCase();
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? (exercise.name.toLowerCase().includes(term) ? 3 : 1) : 0), 0);
      return { exercise, score };
    })
    .filter(({ exercise, score }) => score > 0 && (!bodyweightOnly || exercise.equipment.toLowerCase().includes('body weight')))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ exercise }) => exercise);
}

function formatMatches(matches) {
  return matches.map((exercise) => [
    `Exercise: ${exercise.name}`,
    `Body part: ${exercise.bodyPart}`,
    `Equipment: ${exercise.equipment}`,
    `Target: ${exercise.target}`,
    `Secondary muscles: ${exercise.secondaryMuscles.join(', ') || 'None listed'}`,
    `Instructions: ${exercise.instructions.join(' ')}`,
    `Reference GIF: ${exercise.gifUrl}`
  ].join('\n')).join('\n\n');
}

function runPythonExerciseModel(query, profile) {
  return new Promise((resolve) => {
    const scriptPath = path.resolve(projectRoot, 'backend', 'python_model', 'exercise_model.py');
    const configuredPython = process.env.PYTHON_BIN;
    const command = configuredPython || (process.platform === 'win32' ? 'py' : 'python3');
    const args = configuredPython ? [scriptPath] : (process.platform === 'win32' ? ['-3', scriptPath] : [scriptPath]);
    const child = spawn(command, args, { stdio: ['pipe', 'pipe', 'ignore'] });
    let output = '';

    child.stdout.on('data', (chunk) => { output += chunk.toString(); });
    child.on('error', () => resolve([]));
    child.on('close', (code) => {
      if (code !== 0) return resolve([]);
      try {
        resolve(JSON.parse(output).matches || []);
      } catch {
        resolve([]);
      }
    });

    child.stdin.end(JSON.stringify({ query, profile }));
  });
}

export async function formatExerciseContext(query, profile = {}) {
  const pythonMatches = await runPythonExerciseModel(query, profile);
  if (pythonMatches.length) return formatMatches(pythonMatches);

  const bodyweightOnly = String(profile.exercisePreference || '').toLowerCase().includes('home');
  const matches = searchExerciseDataset(query, { bodyweightOnly, limit: 6 });
  if (!matches.length) return '';

  return formatMatches(matches);
}

export function toExerciseApiRecord(exercise) {
  return {
    ...exercise,
    category: exercise.bodyPart,
    muscle: exercise.target,
    instructions: exercise.instructions.join(' '),
    bodyweightAlt: exercise.equipment.toLowerCase().includes('body weight') ? exercise.name : ''
  };
}