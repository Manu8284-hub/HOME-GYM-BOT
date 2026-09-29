import { exerciseLibrary } from '../data/fitnessData.js';
import { getExerciseDataset, toExerciseApiRecord } from '../services/exerciseDataset.js';

export function getExercises(req, res) {
  const { category, search, bodyweightOnly } = req.query;
  const dataset = getExerciseDataset();
  let results = dataset.length ? dataset.map(toExerciseApiRecord) : [...exerciseLibrary];

  if (category && category !== 'All') {
    results = results.filter(e => (e.category || e.bodyPart || '').toLowerCase() === category.toLowerCase());
  }

  if (bodyweightOnly === 'true') {
    results = results.filter(e => e.equipment.toLowerCase().includes('bodyweight') || e.equipment.toLowerCase().includes('body weight'));
  }

  if (search && search.trim() !== '') {
    const query = search.toLowerCase().trim();
    results = results.filter(e => 
      e.name.toLowerCase().includes(query) ||
      (e.muscle || e.target || '').toLowerCase().includes(query) ||
      (e.category || e.bodyPart || '').toLowerCase().includes(query)
    );
  }

  return res.json(results);
}

export function getExerciseById(req, res) {
  const { id } = req.params;
  const dataset = getExerciseDataset();
  const datasetExercise = dataset.find(e => e.id === id);
  const exercise = dataset.length
    ? datasetExercise && toExerciseApiRecord(datasetExercise)
    : exerciseLibrary.find(e => e.id === id);
  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found.' });
  }
  return res.json(exercise);
}
