import { generateFitnessResponse } from '../services/aiService.js';

// In-memory chat history store for Phase 1
const chatHistoryMemory = new Map();

function historyFor(email) {
  const key = String(email || 'anonymous').trim().toLowerCase();
  if (!chatHistoryMemory.has(key)) chatHistoryMemory.set(key, []);
  return chatHistoryMemory.get(key);
}

export async function handleChatMessage(req, res) {
  try {
    const { message, userProfile } = req.body;
    const history = historyFor(userProfile?.email);

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
    history.push(userMessageObj);
    history.push(aiMessageObj);

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
  return res.json({ history: historyFor(req.query.email) });
}

export function clearChatHistory(req, res) {
  chatHistoryMemory.delete(String(req.query.email || 'anonymous').trim().toLowerCase());
  return res.json({ message: 'Chat history cleared successfully.' });
}
