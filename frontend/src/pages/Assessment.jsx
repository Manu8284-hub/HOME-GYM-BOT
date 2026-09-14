import React, { useState } from 'react';
import {
  User, ArrowRight, ArrowLeft, Ruler, Scale, Activity, Dumbbell,
  Target, Salad, CalendarDays, Sparkles, Zap, Check, Gauge, Loader2
} from 'lucide-react';
import { updateUserProfile, getOrganizedPlan } from '../services/api';
import { saveProfile, savePlan, getSessionEmail } from '../services/localStore';

const STEPS = ['Basics', 'Experience', 'Capacity', 'Goal & Diet', 'Review'];

const LEVELS = [
  { key: 'Beginner', desc: 'New to training, or returning after a long break.' },
  { key: 'Intermediate', desc: 'You train semi-regularly and know the basics.' },
  { key: 'Advanced', desc: 'Consistent training with a strong bodyweight base.' }
];
const EXERCISE_TYPES = ['Home Bodyweight', 'Cardio & Mobility'];
const GOALS = ['Build Muscle', 'Gain Mass', 'Lose Weight', 'Fat Loss', 'Strength Build', 'Body Recomposition', 'Improve Endurance'];
const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const CAPACITY_FIELDS = [
  { key: 'pushups', label: 'Push-ups', unit: 'reps', help: 'Max in one set' },
  { key: 'squats', label: 'Bodyweight squats', unit: 'reps', help: 'Max air squats in one set' },
  { key: 'plankSec', label: 'Plank hold', unit: 'sec', help: 'Longest forearm plank' },
  { key: 'dips', label: 'Chair dips', unit: 'reps', help: 'Max in one set' },
  { key: 'lunges', label: 'Lunges', unit: 'reps', help: 'Max per leg' },
  { key: 'crunches', label: 'Crunches', unit: 'reps', help: 'Max in one set' },
  { key: 'jumpingJacks', label: 'Jumping jacks', unit: 'reps', help: 'Max in one go' },
  { key: 'skippingSec', label: 'Skipping (rope)', unit: 'sec', help: 'Continuous time' },
  { key: 'runMinutes', label: 'Continuous running', unit: 'min', help: 'Non-stop jog time' }
];

const CAP_DEFAULTS = {
  pushups: 10, squats: 15, plankSec: 30, dips: 8, lunges: 10,
  crunches: 15, jumpingJacks: 20, skippingSec: 30, runMinutes: 10
};

function toNum(val, fallback = '') {
  const n = parseFloat(String(val ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

function categoryForBmi(bmi) {
  if (!bmi) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

const inputClass =
  'w-full bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all';

export default function Assessment({ userProfile, setUserProfile, setUserPlan, onComplete, onboarding = false }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  const [form, setForm] = useState(() => ({
    name: userProfile?.name || '',
    age: userProfile?.age || 26,
    gender: userProfile?.gender || 'Male',
    heightCm: userProfile?.heightCm || toNum(userProfile?.height, ''),
    weightKg: userProfile?.weightKg || toNum(userProfile?.weight, ''),
    targetWeightKg: userProfile?.targetWeightKg || toNum(userProfile?.targetWeight, ''),
    fitnessLevel: userProfile?.fitnessLevel || 'Beginner',
    exercisePreference: userProfile?.exercisePreference || 'Home Bodyweight',
    fitnessGoal: userProfile?.fitnessGoal || 'Build Muscle',
    dietaryPreference: userProfile?.dietaryPreference || 'Vegetarian',
    availableDays: userProfile?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    capacities: { ...CAP_DEFAULTS, ...(userProfile?.capacities || {}) }
  }));

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  const setCap = (key, value) =>
    setForm((prev) => ({ ...prev, capacities: { ...prev.capacities, [key]: value } }));

  const toggleDay = (day) =>
    setForm((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day]
    }));

  const heightCm = Number(form.heightCm) || 0;
  const weightKg = Number(form.weightKg) || 0;
  const bmi = heightCm > 0 && weightKg > 0
    ? Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1))
    : null;
  const bmiCategory = categoryForBmi(bmi);

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) return 'Please enter your name.';
      if (!(Number(form.heightCm) > 0)) return 'Please enter a valid height in cm.';
      if (!(Number(form.weightKg) > 0)) return 'Please enter a valid weight in kg.';
    }
    if (step === 3 && form.availableDays.length === 0) {
      return 'Pick at least one training day.';
    }
    return '';
  };

  const next = () => {
    const msg = validateStep();
    if (msg) { setError(msg); return; }
    setError('');
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  };
  const back = () => { setError(''); setStep((s) => Math.max(0, s - 1)); };

  const handleGenerate = async () => {
    const msg = validateStep();
    if (msg) { setError(msg); return; }
    setError('');
    setGenerating(true);

    const email = getSessionEmail();
    const caps = Object.fromEntries(
      CAPACITY_FIELDS.map((f) => [f.key, Math.max(0, Number(form.capacities[f.key]) || 0)])
    );

    const profile = {
      ...userProfile,
      name: form.name.trim(),
      age: Number(form.age) || 0,
      gender: form.gender,
      heightCm,
      weightKg,
      height: heightCm ? `${heightCm} cm` : '',
      weight: weightKg ? `${weightKg} kg` : '',
      targetWeightKg: Number(form.targetWeightKg) || 0,
      targetWeight: form.targetWeightKg ? `${Number(form.targetWeightKg)} kg` : '',
      bmi,
      bmiCategory,
      fitnessLevel: form.fitnessLevel,
      exercisePreference: form.exercisePreference,
      fitnessGoal: form.fitnessGoal,
      goal: 'Home Workout',
      workoutLocation: 'Home',
      dietaryPreference: form.dietaryPreference,
      availableDays: form.availableDays,
      capacities: caps,
      email: email || userProfile?.email || ''
    };

    // Persist profile immediately so nothing is lost even if generation fails.
    if (email) saveProfile(email, profile);
    setUserProfile(profile);
    try { await updateUserProfile(profile); } catch { /* backend is best-effort */ }

    let plan = null;
    try {
      plan = await getOrganizedPlan(profile);
    } catch (err) {
      console.error('Plan generation failed:', err);
    }
    if (email) savePlan(email, plan);
    if (setUserPlan) setUserPlan(plan);

    setGenerating(false);
    if (onComplete) onComplete(profile, plan);
  };

  /* ------------------------------ loader ------------------------------ */
  if (generating) {
    return (
      <div className="fixed inset-0 z-50 boot-splash text-white flex items-center justify-center p-6 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
          <div className="relative mb-7">
            <span className="absolute inset-0 rounded-3xl bg-white/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-2xl">
              <Zap className="w-10 h-10 text-slate-900 fill-slate-900" />
            </div>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight">
            Building your AI plan…
          </h1>
          <p className="text-sm text-white/60 mt-2.5 leading-relaxed max-w-xs">
            Designing a personalized week of home workouts and whole-food meals around your body and goal.
          </p>
          <div className="w-full max-w-[240px] mt-8 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div className="loader-bar h-full w-1/3 rounded-full bg-white" />
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------- step content --------------------------- */
  const cardBtn = (active) =>
    `p-3.5 rounded-2xl text-sm font-semibold border transition-all text-left ${
      active
        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
    }`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top brand + progress */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto w-full px-6 py-4">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-slate-900">
              {onboarding ? 'Build your AI plan' : 'Update your plan'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col gap-1.5">
                <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-slate-900' : 'bg-slate-200'}`} />
                <span className={`text-[10px] font-semibold tracking-wide ${i === step ? 'text-slate-900' : 'text-slate-400'}`}>
                  {i + 1}. {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full px-6 py-8 space-y-6">
          {/* STEP 0 — Basics */}
          {step === 0 && (
            <section className="space-y-6">
              <StepHeader icon={User} title="The basics" text="A few details so the AI can size your plan and BMI." />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Full name">
                  <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} placeholder="Your name" />
                </Field>
                <Field label="Age">
                  <input type="number" value={form.age} onChange={(e) => set('age', e.target.value)} className={inputClass} />
                </Field>
                <Field label="Gender">
                  <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputClass}>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Height (cm)">
                  <input type="number" value={form.heightCm} onChange={(e) => set('heightCm', e.target.value)} className={inputClass} placeholder="178" />
                </Field>
                <Field label="Current weight (kg)">
                  <input type="number" value={form.weightKg} onChange={(e) => set('weightKg', e.target.value)} className={inputClass} placeholder="75" />
                </Field>
                <Field label="Target weight (kg)">
                  <input type="number" value={form.targetWeightKg} onChange={(e) => set('targetWeightKg', e.target.value)} className={inputClass} placeholder="Optional" />
                </Field>
              </div>

              {/* Live BMI */}
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Live BMI</span>
                    <span className="font-heading font-extrabold text-2xl text-slate-900">{bmi ?? '--'}</span>
                    <span className="text-sm text-slate-500 ml-2">{bmi ? bmiCategory : 'enter height & weight'}</span>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-400 hidden sm:block">
                  <p className="flex items-center gap-1.5 justify-end"><Ruler className="w-3.5 h-3.5" /> {heightCm || '--'} cm</p>
                  <p className="flex items-center gap-1.5 justify-end mt-1"><Activity className="w-3.5 h-3.5" /> {weightKg || '--'} kg</p>
                </div>
              </div>
            </section>
          )}

          {/* STEP 1 — Experience */}
          {step === 1 && (
            <section className="space-y-6">
              <StepHeader icon={Dumbbell} title="Your experience" text="How much training background do you have?" />
              <Field label="Experience level">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {LEVELS.map((l) => (
                    <button key={l.key} type="button" onClick={() => set('fitnessLevel', l.key)} className={cardBtn(form.fitnessLevel === l.key)}>
                      <span className="block font-bold">{l.key}</span>
                      <span className={`block text-[11px] mt-1 leading-snug font-normal ${form.fitnessLevel === l.key ? 'text-white/70' : 'text-slate-400'}`}>{l.desc}</span>
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Training style">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {EXERCISE_TYPES.map((t) => (
                    <button key={t} type="button" onClick={() => set('exercisePreference', t)} className={cardBtn(form.exercisePreference === t)}>{t}</button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">All plans are 100% equipment-free bodyweight — no gym or machines required.</p>
              </Field>
            </section>
          )}

          {/* STEP 2 — Capacity */}
          {step === 2 && (
            <section className="space-y-6">
              <StepHeader icon={Gauge} title="Capacity check" text="Roughly how much can you do right now? Enter 0 for anything you can't do yet — the AI scales to you." />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CAPACITY_FIELDS.map((f) => (
                  <div key={f.key} className="rounded-2xl border border-slate-200 p-4">
                    <label className="text-sm font-bold text-slate-800 block">{f.label}</label>
                    <p className="text-[11px] text-slate-400 mb-2">{f.help}</p>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={form.capacities[f.key]}
                        onChange={(e) => setCap(f.key, e.target.value)}
                        className={`${inputClass} pr-14`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">{f.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* STEP 3 — Goal & diet */}
          {step === 3 && (
            <section className="space-y-6">
              <StepHeader icon={Target} title="Goal & nutrition" text="What are you working toward, and how do you eat?" />
              <Field label="Primary goal">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {GOALS.map((g) => (
                    <button key={g} type="button" onClick={() => set('fitnessGoal', g)} className={cardBtn(form.fitnessGoal === g)}>{g}</button>
                  ))}
                </div>
              </Field>
              <Field label="Dietary preference">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {DIETS.map((d) => (
                    <button key={d} type="button" onClick={() => set('dietaryPreference', d)} className={cardBtn(form.dietaryPreference === d)}>{d}</button>
                  ))}
                </div>
              </Field>
              <Field label="Available training days">
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => {
                    const on = form.availableDays.includes(day);
                    return (
                      <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
                        {day}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-400 mt-2">Days you don't pick become rest & recovery days.</p>
              </Field>
            </section>
          )}

          {/* STEP 4 — Review */}
          {step === 4 && (
            <section className="space-y-6">
              <StepHeader icon={Sparkles} title="Review & generate" text="Confirm your details, then let the AI build your personalized plan." />
              <div className="rounded-3xl border border-slate-200 divide-y divide-slate-100">
                <ReviewRow label="Name" value={form.name || '--'} />
                <ReviewRow label="Age · Gender" value={`${form.age || '--'} · ${form.gender}`} />
                <ReviewRow label="Height · Weight" value={`${heightCm || '--'} cm · ${weightKg || '--'} kg`} />
                <ReviewRow label="BMI" value={bmi ? `${bmi} (${bmiCategory})` : '--'} />
                <ReviewRow label="Level" value={form.fitnessLevel} />
                <ReviewRow label="Goal" value={form.fitnessGoal} />
                <ReviewRow label="Diet" value={form.dietaryPreference} />
                <ReviewRow label="Training days" value={form.availableDays.length ? form.availableDays.join(', ') : '--'} />
                <ReviewRow
                  label="Capacity"
                  value={`${form.capacities.pushups} push-ups · ${form.capacities.squats} squats · ${form.capacities.plankSec}s plank · +6 more`}
                />
              </div>
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex items-start gap-3">
                <Salad className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Your plan will be 100% equipment-free bodyweight training and whole-food natural nutrition — zero artificial supplements.
                </p>
              </div>
            </section>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-3">{error}</div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className={`px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button type="button" onClick={next} className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-[0.99]">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="button" onClick={handleGenerate} className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-slate-900/20 transition-all active:scale-[0.99]">
                <Sparkles className="w-4 h-4" /> {onboarding ? 'Generate My AI Plan' : 'Save & Regenerate Plan'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ icon: Icon, title, text }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold mb-3">
        <Icon className="w-3.5 h-3.5" /> {title}
      </div>
      <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500 mt-1.5 max-w-xl">{text}</p>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-slate-500 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-xs font-semibold text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 text-right max-w-[65%] truncate">{value}</span>
    </div>
  );
}
