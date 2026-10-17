import React, { useState, useRef } from 'react';
import {
  User, ArrowRight, ArrowLeft, Ruler, Scale, Activity, Dumbbell,
  Target, Salad, CalendarDays, Sparkles, Zap, Check, Gauge, Loader2
} from 'lucide-react';
import { updateUserProfile, getOrganizedPlan } from '../services/api';
import { saveProfile, savePlan, getSessionEmail } from '../services/localStore';
// TODO: connect backend — POST /api/user/profile
// TODO: connect backend — POST /api/plan/generate

const STEPS = ['Basics', 'Experience', 'Capacity', 'Goal & Diet', 'Review'];

const LEVELS = [
  { key: 'Beginner',     desc: 'New or returning after a break.', emoji: '🌱' },
  { key: 'Intermediate', desc: 'Train semi-regularly, know the basics.', emoji: '📈' },
  { key: 'Advanced',     desc: 'Consistent, strong bodyweight base.', emoji: '🔥' },
];
const EXERCISE_TYPES = ['Home Bodyweight', 'Cardio & Mobility'];
const GOALS = ['Build Muscle', 'Gain Mass', 'Lose Weight', 'Fat Loss', 'Strength Build', 'Body Recomposition', 'Improve Endurance'];
const DIETS = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CAPACITY_FIELDS = [
  { key: 'pushups',     label: 'Push-ups',           unit: 'reps', help: 'Max in one set' },
  { key: 'squats',      label: 'Bodyweight squats',   unit: 'reps', help: 'Max air squats' },
  { key: 'plankSec',    label: 'Plank hold',          unit: 'sec',  help: 'Longest forearm plank' },
  { key: 'dips',        label: 'Chair dips',          unit: 'reps', help: 'Max in one set' },
  { key: 'lunges',      label: 'Lunges',              unit: 'reps', help: 'Max per leg' },
  { key: 'crunches',    label: 'Crunches',            unit: 'reps', help: 'Max in one set' },
  { key: 'jumpingJacks',label: 'Jumping jacks',       unit: 'reps', help: 'Max in one go' },
  { key: 'skippingSec', label: 'Skipping (rope)',     unit: 'sec',  help: 'Continuous time' },
  { key: 'runMinutes',  label: 'Continuous running',  unit: 'min',  help: 'Non-stop jog time' },
];
const CAP_DEFAULTS = { pushups:10, squats:15, plankSec:30, dips:8, lunges:10, crunches:15, jumpingJacks:20, skippingSec:30, runMinutes:10 };

function toNum(val, fallback = '') {
  const n = parseFloat(String(val ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}
function categoryForBmi(bmi) {
  if (!bmi) return 'Unknown';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25)   return 'Normal weight';
  if (bmi < 30)   return 'Overweight';
  return 'Obese';
}

// Progress ring (SVG)
function ProgressRing({ step, total }) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const offset = circ - (step / (total - 1)) * circ;
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90 absolute inset-0">
        <circle cx="48" cy="48" r={r} className="ring-track" />
        <circle
          cx="48" cy="48" r={r}
          className="ring-volt"
          style={{ strokeDasharray: circ, strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="relative z-10 text-center">
        <p className="font-mono text-xl font-bold" style={{ color: '#C6F135' }}>{step + 1}</p>
        <p className="text-[9px]" style={{ color: '#555' }}>of {total}</p>
      </div>
    </div>
  );
}

export default function Assessment({ userProfile, setUserProfile, setUserPlan, onComplete, onboarding = false }) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null); // 'left' | 'right'

  const [form, setForm] = useState(() => ({
    name:              userProfile?.name || '',
    age:               userProfile?.age || 26,
    gender:            userProfile?.gender || 'Male',
    heightCm:          userProfile?.heightCm || toNum(userProfile?.height, ''),
    weightKg:          userProfile?.weightKg || toNum(userProfile?.weight, ''),
    targetWeightKg:    userProfile?.targetWeightKg || toNum(userProfile?.targetWeight, ''),
    fitnessLevel:      userProfile?.fitnessLevel || 'Beginner',
    exercisePreference:userProfile?.exercisePreference || 'Home Bodyweight',
    fitnessGoal:       userProfile?.fitnessGoal || 'Build Muscle',
    dietaryPreference: userProfile?.dietaryPreference || 'Vegetarian',
    availableDays:     userProfile?.availableDays || ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    capacities:        { ...CAP_DEFAULTS, ...(userProfile?.capacities || {}) },
  }));

  const set    = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
  const setCap = (key, value) => setForm(prev => ({ ...prev, capacities: { ...prev.capacities, [key]: value } }));
  const toggleDay = (day) => setForm(prev => ({
    ...prev,
    availableDays: prev.availableDays.includes(day)
      ? prev.availableDays.filter(d => d !== day)
      : [...prev.availableDays, day],
  }));

  const heightCm  = Number(form.heightCm)  || 0;
  const weightKg  = Number(form.weightKg)  || 0;
  const bmi       = heightCm > 0 && weightKg > 0
    ? Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1))
    : null;
  const bmiCategory = categoryForBmi(bmi);

  const validateStep = () => {
    if (step === 0) {
      if (!form.name.trim()) return 'Please enter your name.';
      if (!(Number(form.heightCm) > 0)) return 'Please enter a valid height in cm.';
      if (!(Number(form.weightKg) > 0)) return 'Please enter a valid weight in kg.';
    }
    if (step === 3 && form.availableDays.length === 0) return 'Pick at least one training day.';
    return '';
  };

  const animateTransition = (direction, callback) => {
    setSwipeDir(direction);
    setTimeout(() => { setSwipeDir(null); callback(); }, 260);
  };

  const next = () => {
    const msg = validateStep(); if (msg) { setError(msg); return; }
    setError('');
    animateTransition('left', () => setStep(s => Math.min(STEPS.length - 1, s + 1)));
  };
  const back = () => {
    setError('');
    animateTransition('right', () => setStep(s => Math.max(0, s - 1)));
  };

  const handleGenerate = async () => {
    const msg = validateStep(); if (msg) { setError(msg); return; }
    setError(''); setGenerating(true);

    const email = getSessionEmail();
    const caps = Object.fromEntries(CAPACITY_FIELDS.map(f => [f.key, Math.max(0, Number(form.capacities[f.key]) || 0)]));
    const profile = {
      ...userProfile,
      name: form.name.trim(), age: Number(form.age) || 0, gender: form.gender,
      heightCm, weightKg,
      height: heightCm ? `${heightCm} cm` : '', weight: weightKg ? `${weightKg} kg` : '',
      targetWeightKg: Number(form.targetWeightKg) || 0,
      bmi, bmiCategory,
      fitnessLevel: form.fitnessLevel, exercisePreference: form.exercisePreference,
      fitnessGoal: form.fitnessGoal, goal: 'Home Workout', workoutLocation: 'Home',
      dietaryPreference: form.dietaryPreference, availableDays: form.availableDays,
      capacities: caps, email: email || userProfile?.email || '',
    };

    if (email) saveProfile(email, profile);
    setUserProfile(profile);
    try { await updateUserProfile(profile); } catch { /* best-effort */ }
    // TODO: connect backend — POST /api/plan/generate

    let plan = null;
    try { plan = await getOrganizedPlan(profile); } catch (err) { console.error('Plan generation failed:', err); }
    if (email) savePlan(email, plan);
    if (setUserPlan) setUserPlan(plan);
    try { await updateUserProfile({ ...profile, plan, onboardingComplete: true }); } catch { /* noop */ }

    setGenerating(false);
    if (onComplete) onComplete(profile, plan);
  };

  /* ---- Generating loader ---- */
  if (generating) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden" style={{ background: '#080808' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(198,241,53,0.08) 0%, transparent 70%)'
        }} />
        <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
          <div className="relative mb-8">
            <span className="absolute inset-0 rounded-2xl animate-ping" style={{ background: 'rgba(198,241,53,0.18)' }} />
            <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: '#C6F135', boxShadow: '0 0 40px rgba(198,241,53,0.4)' }}>
              <Zap className="w-10 h-10 fill-current" style={{ color: '#080808' }} />
            </div>
          </div>
          <h1 className="font-display text-5xl mb-3" style={{ color: '#F5F5F5' }}>BUILDING YOUR PLAN…</h1>
          <p className="text-sm leading-relaxed max-w-xs mb-10" style={{ color: '#555' }}>
            Designing a personalized week of home workouts and whole-food meals around your body and goal.
          </p>
          <div className="w-full max-w-[240px] h-[2px] rounded-full overflow-hidden mb-3" style={{ background: '#1a1a1a' }}>
            <div className="loader-bar h-full w-1/3 rounded-full" style={{ background: '#C6F135' }} />
          </div>
          <p className="text-[10px] uppercase tracking-widest" style={{ color: '#444' }}>AI generating</p>
        </div>
      </div>
    );
  }

  /* ---- Card button style ---- */
  const cardBtn = (active) => ({
    background: active ? '#C6F135' : '#111',
    color: active ? '#080808' : '#888',
    border: `1px solid ${active ? '#C6F135' : '#222'}`,
    boxShadow: active ? '0 0 16px rgba(198,241,53,0.3)' : 'none',
  });

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#080808' }}>
      {/* ---- Sticky header ---- */}
      <div className="sticky top-0 z-10 border-b border-[#1a1a1a]" style={{ background: 'rgba(8,8,8,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-2xl mx-auto w-full px-6 py-4">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#C6F135' }}>
              <Zap className="w-4 h-4 fill-current" style={{ color: '#080808' }} />
            </div>
            <span className="font-bold text-sm" style={{ color: '#F5F5F5' }}>
              {onboarding ? 'Build your AI plan' : 'Update your plan'}
            </span>
            <div className="ml-auto">
              <ProgressRing step={step} total={STEPS.length} />
            </div>
          </div>
          {/* Step pills */}
          <div className="flex gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1 flex flex-col gap-1">
                <div className="h-[3px] rounded-full transition-all duration-500"
                  style={{ background: i <= step ? '#C6F135' : '#1a1a1a', boxShadow: i <= step ? '0 0 8px rgba(198,241,53,0.5)' : 'none' }} />
                <span className="text-[9px] font-bold hidden sm:block" style={{ color: i === step ? '#C6F135' : '#444' }}>
                  {i + 1}. {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---- Body ---- */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full px-6 py-10 space-y-8">
          {/* Animated card */}
          <div
            className="transition-all duration-260"
            style={{
              opacity: swipeDir ? 0 : 1,
              transform: swipeDir === 'left' ? 'translateX(-30px)' : swipeDir === 'right' ? 'translateX(30px)' : 'translateX(0)',
            }}
          >
            {/* ---- STEP 0: Basics ---- */}
            {step === 0 && (
              <section className="space-y-6">
                <StepHeader icon={User} title="The basics" text="A few details so the AI can size your plan and calculate BMI." />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NeonField label="Full name">
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} className="neon-input" placeholder="Your name" />
                  </NeonField>
                  <NeonField label="Age">
                    <input type="number" value={form.age} onChange={e => set('age', e.target.value)} className="neon-input" />
                  </NeonField>
                  <NeonField label="Gender">
                    <select value={form.gender} onChange={e => set('gender', e.target.value)} className="neon-input" style={{ background: '#111' }}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </NeonField>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <NeonField label="Height (cm)">
                    <input type="number" value={form.heightCm} onChange={e => set('heightCm', e.target.value)} className="neon-input" placeholder="178" />
                  </NeonField>
                  <NeonField label="Current weight (kg)">
                    <input type="number" value={form.weightKg} onChange={e => set('weightKg', e.target.value)} className="neon-input" placeholder="75" />
                  </NeonField>
                  <NeonField label="Target weight (kg)">
                    <input type="number" value={form.targetWeightKg} onChange={e => set('targetWeightKg', e.target.value)} className="neon-input" placeholder="Optional" />
                  </NeonField>
                </div>
                {/* Live BMI */}
                <div className="rounded-2xl p-5 flex items-center justify-between" style={{ background: '#111', border: '1px solid #222' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: '#C6F135' }}>
                      <Scale className="w-5 h-5" style={{ color: '#080808' }} />
                    </div>
                    <div>
                      <span className="text-xs block" style={{ color: '#555' }}>Live BMI</span>
                      <span className="font-mono text-3xl font-bold" style={{ color: '#C6F135' }}>{bmi ?? '--'}</span>
                      <span className="text-sm ml-2" style={{ color: '#888' }}>{bmi ? bmiCategory : 'enter height & weight'}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs hidden sm:block" style={{ color: '#444' }}>
                    <p>{heightCm || '--'} cm</p>
                    <p className="mt-1">{weightKg || '--'} kg</p>
                  </div>
                </div>
              </section>
            )}

            {/* ---- STEP 1: Experience ---- */}
            {step === 1 && (
              <section className="space-y-6">
                <StepHeader icon={Dumbbell} title="Your experience" text="How much training background do you have?" />
                <NeonField label="Experience level">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {LEVELS.map(l => (
                      <button key={l.key} onClick={() => set('fitnessLevel', l.key)}
                        className="p-4 rounded-2xl text-left transition-all"
                        style={cardBtn(form.fitnessLevel === l.key)}>
                        <span className="text-2xl block mb-2">{l.emoji}</span>
                        <span className="block font-bold text-sm">{l.key}</span>
                        <span className="block text-[11px] mt-1 leading-snug opacity-70">{l.desc}</span>
                      </button>
                    ))}
                  </div>
                </NeonField>
                <NeonField label="Training style">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EXERCISE_TYPES.map(t => (
                      <button key={t} onClick={() => set('exercisePreference', t)}
                        className="p-4 rounded-2xl font-bold text-sm transition-all"
                        style={cardBtn(form.exercisePreference === t)}>{t}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: '#555' }}>All plans are 100% equipment-free — no gym required.</p>
                </NeonField>
              </section>
            )}

            {/* ---- STEP 2: Capacity ---- */}
            {step === 2 && (
              <section className="space-y-6">
                <StepHeader icon={Gauge} title="Capacity check" text="Roughly how much can you do right now? Enter 0 for anything you can't do yet." />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CAPACITY_FIELDS.map(f => (
                    <div key={f.key} className="rounded-2xl p-4" style={{ background: '#111', border: '1px solid #1a1a1a' }}>
                      <label className="text-sm font-bold block mb-1" style={{ color: '#F5F5F5' }}>{f.label}</label>
                      <p className="text-[11px] mb-3" style={{ color: '#555' }}>{f.help}</p>
                      <div className="relative">
                        <input type="number" min="0" value={form.capacities[f.key]}
                          onChange={e => setCap(f.key, e.target.value)}
                          className="neon-input pr-14" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono" style={{ color: '#555' }}>{f.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ---- STEP 3: Goal & Diet ---- */}
            {step === 3 && (
              <section className="space-y-6">
                <StepHeader icon={Target} title="Goal & nutrition" text="What are you working toward, and how do you eat?" />
                <NeonField label="Primary goal">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {GOALS.map(g => (
                      <button key={g} onClick={() => set('fitnessGoal', g)}
                        className="p-3 rounded-xl font-semibold text-sm transition-all"
                        style={cardBtn(form.fitnessGoal === g)}>{g}
                      </button>
                    ))}
                  </div>
                </NeonField>
                <NeonField label="Dietary preference">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DIETS.map(d => (
                      <button key={d} onClick={() => set('dietaryPreference', d)}
                        className="p-3 rounded-xl font-semibold text-sm transition-all"
                        style={cardBtn(form.dietaryPreference === d)}>{d}
                      </button>
                    ))}
                  </div>
                </NeonField>
                <NeonField label="Available training days">
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map(day => {
                      const on = form.availableDays.includes(day);
                      return (
                        <button key={day} onClick={() => toggleDay(day)}
                          className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                          style={cardBtn(on)}>{day.slice(0, 3)}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: '#555' }}>Days not selected become rest & recovery days.</p>
                </NeonField>
              </section>
            )}

            {/* ---- STEP 4: Review ---- */}
            {step === 4 && (
              <section className="space-y-6">
                <StepHeader icon={Sparkles} title="Review & generate" text="Confirm your details, then let the AI build your plan." />
                <div className="rounded-2xl overflow-hidden divide-y" style={{ background: '#111', border: '1px solid #222', divideColor: '#1a1a1a' }}>
                  {[
                    ['Name', form.name || '--'],
                    ['Age · Gender', `${form.age || '--'} · ${form.gender}`],
                    ['Height · Weight', `${heightCm || '--'} cm · ${weightKg || '--'} kg`],
                    ['BMI', bmi ? `${bmi} (${bmiCategory})` : '--'],
                    ['Level', form.fitnessLevel],
                    ['Goal', form.fitnessGoal],
                    ['Diet', form.dietaryPreference],
                    ['Training days', form.availableDays.join(', ') || '--'],
                    ['Capacity', `${form.capacities.pushups} push-ups · ${form.capacities.squats} squats · ${form.capacities.plankSec}s plank`],
                  ].map(([label, val]) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3">
                      <span className="text-xs font-semibold" style={{ color: '#555' }}>{label}</span>
                      <span className="text-sm font-semibold text-right max-w-[60%] truncate" style={{ color: '#F5F5F5' }}>{val}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(198,241,53,0.05)', border: '1px solid rgba(198,241,53,0.15)' }}>
                  <Salad className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#C6F135' }} />
                  <p className="text-xs leading-relaxed" style={{ color: '#888' }}>
                    Your plan will be 100% equipment-free bodyweight training and whole-food natural nutrition — zero artificial supplements.
                  </p>
                </div>
              </section>
            )}
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.25)', color: '#FF1744' }}>
              {error}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between pt-2">
            <button onClick={back} disabled={step === 0}
              className={`px-5 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}
              style={{ color: '#888', background: '#111', border: '1px solid #222' }}>
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < STEPS.length - 1 ? (
              <button onClick={next}
                className="btn-volt flex items-center gap-2"
                style={{ borderRadius: '0.875rem', animationName: 'none', padding: '0.75rem 1.5rem' }}>
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleGenerate}
                className="btn-volt flex items-center gap-2"
                style={{ borderRadius: '0.875rem', animationName: 'none', padding: '0.75rem 1.5rem' }}>
                <Sparkles className="w-4 h-4" />
                {onboarding ? 'Generate My AI Plan' : 'Save & Regenerate'}
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
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
        style={{ background: 'rgba(198,241,53,0.1)', border: '1px solid rgba(198,241,53,0.2)' }}>
        <Icon className="w-3.5 h-3.5" style={{ color: '#C6F135' }} />
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#C6F135' }}>{title}</span>
      </div>
      <h2 className="font-display text-4xl mb-2" style={{ color: '#F5F5F5' }}>{title.toUpperCase()}</h2>
      <p className="text-sm" style={{ color: '#666' }}>{text}</p>
    </div>
  );
}

function NeonField({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: '#555' }}>{label}</label>
      {children}
    </div>
  );
}
