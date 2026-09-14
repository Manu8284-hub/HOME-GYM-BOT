import { generateOrganizedPlan } from '../services/aiService.js';

export async function getOrganizedPlan(req, res) {
  try {
    const userProfile = req.body?.userProfile || req.body || {};
    const plan = await generateOrganizedPlan(userProfile);

    return res.json({
      ...plan,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error generating organized plan:', err);
    return res.status(500).json({ error: 'Failed to generate AI plan.' });
  }
}