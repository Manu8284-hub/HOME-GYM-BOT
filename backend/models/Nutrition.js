import mongoose from 'mongoose';

const nutritionSchema = new mongoose.Schema({
  externalId: { type: String, required: true, unique: true, index: true },
  meal: { type: String, required: true, index: true },
  title: { type: String, required: true },
  dietaryPreferences: [{ type: String, index: true }],
  goals: [String],
  bmiCategories: [String],
  fitnessLevels: [String],
  calories: String,
  protein: String,
  foods: String,
  tags: [String]
}, { timestamps: true });

export default mongoose.model('Nutrition', nutritionSchema);
