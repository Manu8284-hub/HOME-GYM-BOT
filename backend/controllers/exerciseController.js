import { exerciseLibrary } from '../data/fitnessData.js';

export function getExercises(req, res) {
  const { category, search, bodyweightOnly } = req.query;
  let results = [...exerciseLibrary];

  if (category && category !== 'All') {
    results = results.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  if (bodyweightOnly === 'true') {
    results = results.filter(e => e.equipment.toLowerCase().includes('bodyweight'));
  }

  if (search && search.trim() !== '') {
    const query = search.toLowerCase().trim();
    results = results.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.muscle.toLowerCase().includes(query) ||
      e.category.toLowerCase().includes(query)
    );
  }

  return res.json(results);
}

export function getExerciseById(req, res) {
  const { id } = req.params;
  const exercise = exerciseLibrary.find(e => e.id === id);
  if (!exercise) {
    return res.status(404).json({ error: 'Exercise not found.' });
  }
  return res.json(exercise);
}
