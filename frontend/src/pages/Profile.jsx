import React, { useState } from 'react';
import { User, Save, CheckCircle2, Scale, Ruler, Activity } from 'lucide-react';
import { updateUserProfile } from '../services/api';
import { saveProfile, getSessionEmail } from '../services/localStore';

const GOALS = ['Build Muscle', 'Gain Mass', 'Lose Weight', 'Fat Loss', 'Strength Build', 'Body Recomposition', 'Improve Endurance'];
const EXERCISE_TYPES = ['Home Bodyweight', 'Cardio & Mobility'];
const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const WELCOME_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoSOqmwaZadtZohybIIJFL0PNQ2kp_Dp_ucCoRLEIqqlHwx327X7ct7IA&s=10';

function extractMetricValue(value) {
  const parsed = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function calculateBmiSnapshot(height, weight) {
  const heightCm = extractMetricValue(height);
  const weightKg = extractMetricValue(weight);

  if (!heightCm || !weightKg) {
    return { bmi: null, bmiCategory: 'Unknown' };
  }

  const bmi = Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));
  let bmiCategory = 'Normal weight';

  if (bmi < 18.5) bmiCategory = 'Underweight';
  else if (bmi < 25) bmiCategory = 'Normal weight';
  else if (bmi < 30) bmiCategory = 'Overweight';
  else bmiCategory = 'Obese';

  return { bmi, bmiCategory };
}

export default function Profile({ userProfile, setUserProfile, onSaveSuccess, onboarding = false }) {
  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    age: userProfile?.age || 26,
    gender: userProfile?.gender || 'Male',
    height: userProfile?.height || '178 cm',
    weight: userProfile?.weight || '75 kg',
    targetWeight: userProfile?.targetWeight || '80 kg',
    fitnessLevel: userProfile?.fitnessLevel || 'Intermediate',
    fitnessGoal: userProfile?.fitnessGoal || 'Build Muscle',
    exercisePreference: userProfile?.exercisePreference || 'Home Bodyweight',
    goal: userProfile?.goal || 'Home Workout',
    workoutLocation: userProfile?.workoutLocation || 'Home',
    dietaryPreference: userProfile?.dietaryPreference || 'Vegetarian',
    availableDays: userProfile?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const bmiSnapshot = calculateBmiSnapshot(formData.height, formData.weight);

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const toggleDay = (day) => {
    const current = formData.availableDays || [];
    setFormData(prev => ({
      ...prev,
      availableDays: current.includes(day) ? current.filter(d => d !== day) : [...current, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const email = getSessionEmail();
      const nextProfile = { ...formData, ...bmiSnapshot, email: email || userProfile?.email || '' };
      await updateUserProfile(formData);
      if (email) saveProfile(email, nextProfile);
      setUserProfile(nextProfile);
      setSuccessMsg('Profile updated! AI recommendations synced.');
      setTimeout(() => setSuccessMsg(''), 4000);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      console.error('Error saving profile', err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all";

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-4xl mx-auto">
      {/* Header */}
      {onboarding ? (
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[260px] lg:min-h-full">
              <img
                src={WELCOME_IMAGE}
                alt="Welcome to FitBot"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-slate-950/10"></div>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3 backdrop-blur-sm">
                  <User className="w-3.5 h-3.5" /> Welcome to FitBot
                </div>
                <h2 className="font-heading font-extrabold text-3xl sm:text-4xl leading-tight">
                  Build a plan that matches your body and your goal
                </h2>
                <p className="text-sm text-white/80 mt-2 max-w-md">
                  Enter your basic info, get your BMI, and let the AI organize your workout and diet plan.
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 bg-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-3">
                <User className="w-3.5 h-3.5" /> User Fitness Profile
              </div>
              <h2 className="font-heading font-extrabold text-2xl text-slate-800">Tell FitBot what you want to achieve</h2>
              <p className="text-xs text-slate-400 mt-1">The first step is to capture your basic info, calculate BMI, and shape the AI plan around your goal.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
            <User className="w-3.5 h-3.5" /> User Fitness Profile
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-800">Tell FitBot what you want to achieve</h2>
          <p className="text-xs text-slate-400 mt-1">The first step is to capture your basic info, calculate BMI, and shape the AI plan around your goal.</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Metrics */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h3 className="font-heading font-bold text-lg text-slate-800 border-b border-slate-100 pb-3">Basic Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">Full Name</label><input type="text" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} className={inputClass} required /></div>
            <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">Age</label><input type="number" value={formData.age} onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)} className={inputClass} /></div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Gender</label>
              <select value={formData.gender} onChange={(e) => handleChange('gender', e.target.value)} className={inputClass}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">Height</label><input type="text" value={formData.height} onChange={(e) => handleChange('height', e.target.value)} placeholder="e.g. 178 cm" className={inputClass} required /></div>
            <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">Current Weight</label><input type="text" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} placeholder="e.g. 75 kg" className={inputClass} required /></div>
            <div><label className="text-xs font-semibold text-slate-500 block mb-1.5">Target Weight</label><input type="text" value={formData.targetWeight} onChange={(e) => handleChange('targetWeight', e.target.value)} placeholder="e.g. 80 kg" className={inputClass} /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <h3 className="font-heading font-bold text-lg text-slate-800 border-b border-slate-100 pb-3">Goal & Training Style</h3>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">What do you want to achieve?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {GOALS.map((g) => (
                  <button key={g} type="button" onClick={() => handleChange('fitnessGoal', g)} className={`p-3 rounded-2xl text-xs font-semibold border transition-all text-left ${formData.fitnessGoal === g ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-2">Exercise type you can do</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {EXERCISE_TYPES.map((type) => (
                  <button key={type} type="button" onClick={() => handleChange('exercisePreference', type)} className={`p-3 rounded-2xl text-xs font-semibold border transition-all text-left ${formData.exercisePreference === type ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}>{type}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl p-6 shadow-lg shadow-emerald-200 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white/90 text-xs font-semibold border border-white/20">
                <Scale className="w-3.5 h-3.5" /> BMI Snapshot
              </div>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-heading font-extrabold text-4xl">{bmiSnapshot.bmi ?? '--'}</span>
                <span className="text-white/80 text-xs pb-1">{bmiSnapshot.bmi ? 'BMI' : ''}</span>
              </div>
              <p className="text-sm text-white/90 mt-2">{bmiSnapshot.bmiCategory}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/20 space-y-2 text-sm text-white/90">
              <p className="flex items-center gap-2"><Ruler className="w-4 h-4" /> Height: {formData.height || '--'}</p>
              <p className="flex items-center gap-2"><Activity className="w-4 h-4" /> Weight: {formData.weight || '--'}</p>
            </div>
          </div>
        </div>

        {/* Goals & Preferences */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <h3 className="font-heading font-bold text-lg text-slate-800 border-b border-slate-100 pb-3">Training Preferences</h3>
          <div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Workout Location</label>
              <div className="grid grid-cols-1 gap-2.5">
                <button type="button" onClick={() => handleChange('workoutLocation', 'Home')} className={`p-3 rounded-2xl text-xs font-semibold border transition-all text-left ${formData.workoutLocation === 'Home' ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}>Home Workout Only</button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Fitness Level</label>
              <select value={formData.fitnessLevel} onChange={(e) => handleChange('fitnessLevel', e.target.value)} className={inputClass}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Dietary Preference</label>
              <select value={formData.dietaryPreference} onChange={(e) => handleChange('dietaryPreference', e.target.value)} className={inputClass}>
                {DIETS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Available Days */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-lg text-slate-800">Available Workout Days</h3>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => {
              const isSelected = (formData.availableDays || []).includes(day);
              return (
                <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${isSelected ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 text-right">
          <button type="submit" disabled={saving} className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all ml-auto active:scale-95">
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : onboarding ? 'Build My AI Plan' : 'Save & Sync Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
