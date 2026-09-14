import { generateFitnessResponse } from '../services/aiService.js';

// In-memory chat history store for Phase 1
const chatHistoryMemory = [];

export async function handleChatMessage(req, res) {
  try {
    const { message, userProfile } = req.body;

    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    // Generate AI response
    const aiResponse = await generateFitnessResponse(message, userProfile || {});

    const userMessageObj = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: message,
      timestamp: new Date().toISOString()
    };

    const aiMessageObj = {
      id: `msg-${Date.now()}-ai`,
      sender: 'ai',
      text: aiResponse,
      timestamp: new Date().toISOString()
    };

    // Store in memory
    chatHistoryMemory.push(userMessageObj);
    chatHistoryMemory.push(aiMessageObj);

    return res.json({
      reply: aiMessageObj,
      userMessage: userMessageObj
    });
  } catch (err) {
    console.error('Error in chat controller:', err);
    return res.status(500).json({ error: 'Failed to process AI chat request.' });
  }
}

export function getChatHistory(req, res) {
  return res.json({ history: chatHistoryMemory });
}

export function clearChatHistory(req, res) {
  chatHistoryMemory.length = 0;
  return res.json({ message: 'Chat history cleared successfully.' });
}
