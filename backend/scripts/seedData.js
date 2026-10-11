import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { seedReferenceData } from '../services/recommendationService.js';

dotenv.config();

const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/fitbot';

try {
  await mongoose.connect(mongoUri);
  const result = await seedReferenceData();
  console.log(`Seeded ${result.exercises} exercises and ${result.nutrition} nutrition records.`);
} catch (error) {
  console.error('Reference data seed failed:', error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
