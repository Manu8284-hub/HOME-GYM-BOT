import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  profile: {
    type: Object,
    default: {}
  },
  plan: { type: Object, default: null },
  onboardingComplete: { type: Boolean, default: false },
  progress: {
    type: Object,
    default: {
      water: { date: '', cups: 0 },
      completions: {},
      notes: []
    }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
