import express from 'express';
import { getOrganizedPlan } from '../controllers/planController.js';

const router = express.Router();

router.post('/', getOrganizedPlan);

export default router;