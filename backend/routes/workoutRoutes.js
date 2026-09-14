import express from 'express';
import { getWorkouts, getTodayWorkout } from '../controllers/workoutController.js';

const router = express.Router();

router.get('/', getWorkouts);
router.get('/today', getTodayWorkout);

export default router;
