import { workoutPlans } from '../data/fitnessData.js';

export function getWorkouts(req, res) {
  const { goal, location } = req.query;

  const planKey = 'Home Workout';
  return res.json(workoutPlans[planKey]);
}

export function getTodayWorkout(req, res) {
  const { goal, location } = req.query;
  const planKey = 'Home Workout';
  const selectedPlan = workoutPlans[planKey];
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todayData = selectedPlan.schedule[todayName] || selectedPlan.schedule['Monday'];

  return res.json({
    day: todayName,
    goal: planKey,
    location: 'Home',
    workout: todayData
  });
}
