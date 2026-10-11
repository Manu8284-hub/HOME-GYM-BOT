import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  bodyPart: String,
  equipment: String,
  gifUrl: String,
  target: String,
  secondaryMuscles: [String],
  instructions: [String],
  difficulty: { type: String, default: 'Intermediate' },
  goals: [String],
  fitnessLevels: [String]
}, { timestamps: true });

export default mongoose.model('Exercise', exerciseSchema);
