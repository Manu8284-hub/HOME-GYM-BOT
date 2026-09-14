import express from 'express';
import { getDietPlan, getAllDietPreferences } from '../controllers/dietController.js';

const router = express.Router();

router.get('/preferences', getAllDietPreferences);
router.get('/:preference?', getDietPlan);

export default router;
