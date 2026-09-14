import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function extractMetricValue(value) {
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function calculateBMI(height, weight) {
  const heightCm = extractMetricValue(height);
  const weightKg = extractMetricValue(weight);

  if (!heightCm || !weightKg) {
    return { bmi: null, bmiCategory: 'Unknown' };
  }

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let bmiCategory = 'Normal weight';
  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Normal weight';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  return { bmi, bmiCategory };
}

export async function signupUser(req, res) {
  try {
    const { name, email, password } = req.body || {};
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !password || !String(password).trim()) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' });
    }

    if (await User.findOne({ email: cleanEmail })) {
      return res.status(409).json({ ok: false, error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name || '').trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: hashedPassword,
      profile: {
        email: cleanEmail,
        name: String(name || '').trim() || cleanEmail.split('@')[0]
      }
    });

    return res.status(201).json({
      ok: true,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('signupUser error:', error);
    return res.status(500).json({ ok: false, error: 'Signup failed.' });
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body || {};
    const cleanEmail = normalizeEmail(email);

    if (!cleanEmail || !password) {
      return res.status(400).json({ ok: false, error: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({ ok: false, error: 'No account found for this email.' });
    }

    const isValid = await bcrypt.compare(String(password), user.password);
    if (!isValid) {
      return res.status(401).json({ ok: false, error: 'Incorrect password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fitbot-dev-secret',
      { expiresIn: '30d' }
    );

    return res.json({
      ok: true,
      token,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('loginUser error:', error);
    return res.status(500).json({ ok: false, error: 'Login failed.' });
  }
}

export async function getUserProfile(req, res) {
  try {
    const email = normalizeEmail(req.query.email || req.body?.email);
    if (!email) {
      return res.json({ profile: null });
    }

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res.json({ profile: null });
    }

    return res.json({
      profile: user.profile || { email: user.email, name: user.name },
      onboardingComplete: Boolean(user.onboardingComplete),
      plan: user.plan || null,
      progress: user.progress || { water: { date: '', cups: 0 }, completions: {}, notes: [] }
    });
  } catch (error) {
    console.error('getUserProfile error:', error);
    return res.status(500).json({ error: 'Could not load profile.' });
  }
}

export async function updateUserProfile(req, res) {
  try {
    const email = normalizeEmail(req.body?.email || req.query?.email);
    const payload = req.body || {};

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const nextProfile = { ...(user.profile || {}), ...payload };
    const bmiData = calculateBMI(nextProfile.height, nextProfile.weight);

    user.profile = {
      ...nextProfile,
      bmi: bmiData.bmi,
      bmiCategory: bmiData.bmiCategory
    };
    user.name = user.name || nextProfile.name || email.split('@')[0];
    if (payload.plan) user.plan = payload.plan;
    if (payload.onboardingComplete !== undefined) user.onboardingComplete = Boolean(payload.onboardingComplete);
    if (payload.progress) user.progress = payload.progress;

    await user.save();

    return res.json({
      message: 'Profile updated successfully!',
      profile: user.profile,
      onboardingComplete: user.onboardingComplete,
      plan: user.plan,
      progress: user.progress
    });
  } catch (error) {
    console.error('updateUserProfile error:', error);
    return res.status(500).json({ error: 'Profile update failed.' });
  }
}
