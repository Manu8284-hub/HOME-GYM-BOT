import { dietPlans } from '../data/fitnessData.js';

export function getDietPlan(req, res) {
  const preference = req.params.preference || req.query.preference || 'Vegetarian';
  const plan = dietPlans[preference] || dietPlans.Vegetarian;
  return res.json(plan);
}

export function getAllDietPreferences(req, res) {
  return res.json(Object.keys(dietPlans));
}
