import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import chatRoutes from './routes/chatRoutes.js';
import workoutRoutes from './routes/workoutRoutes.js';
import dietRoutes from './routes/dietRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import planRoutes from './routes/planRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/fitbot';

// Middleware
app.use(cors());
app.use(express.json());

// API Safety & Info Header
app.use((req, res, next) => {
  res.setHeader('X-FitBot-Version', '1.0.0');
  res.setHeader('X-FitBot-Disclaimer', 'Informational purpose only. Consult a physician before starting exercise programs.');
  next();
});

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/plan', planRoutes);

// Root & Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'FitBot AI Backend',
    timestamp: new Date().toISOString(),
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    aiEngine: process.env.GEMINI_API_KEY || process.env.AI_API_KEY ? 'Gemini AI API Connected' : 'Smart Built-in AI Engine'
  });
});

mongoose.set('strictQuery', true);

async function startServer() {
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`================================================`);
      console.log(`🚀 FitBot AI Express Server running on port ${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`================================================`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Update your MONGO_URI in backend/.env with the real Atlas connection string.');
    process.exit(1);
  }
}

startServer();
