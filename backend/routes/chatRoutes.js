import express from 'express';
import { handleChatMessage, getChatHistory, clearChatHistory } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', handleChatMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

export default router;
