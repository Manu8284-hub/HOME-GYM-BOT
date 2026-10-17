import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Droplets,
  Flame,
  Leaf,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  Dumbbell,
  Clock,
  Home,
  Apple,
  Zap,
  Activity,
  Calendar,
} from 'lucide-react';

import { getTodayWorkout } from '../services/api';
import {
  getSessionEmail,
  getWater,
  setWater,
  isTodayComplete,
  toggleTodayComplete,
  getStreak,
} from '../services/localStore';
import { MOCK_WEEKLY_HEATMAP, MOCK_PROGRESS_RINGS } from '../data/mockData';
import { useCountUp } from '../hooks/useCountUp';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function Dashboard({
  userProfile,
  plan,
  onRegenerate,
  regenerating,
  setActiveTab,
  onAskAI,
  setExerciseModal,
}) {
  const email = getSessionEmail();

  const [fetchedWorkout, setFetchedWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  const [waterCups, setWaterCups] = useState(() => getWater(email));
  const [completedToday, setCompletedToday] = useState(() =>
    isTodayComplete(email)
  );
  const [streak, setStreak] = useState(() => getStreak(email));

  const todayName = DAYS[(new Date().getDay() + 6) % 7];
  const workoutPlan = plan?.workoutPlan || null;

  const todayWorkout = workoutPlan
    ? {
        day: todayName,
        workout: workoutPlan.schedule?.[todayName] || {},
      }
    : fetchedWorkout;

  const workout = todayWorkout?.workout || {};
  const exercises = Array.isArray(workout.exercises)
    ? workout.exercises
    : [];

  const fitnessGoal = userProfile?.fitnessGoal || userProfile?.goal || 'Build Muscle';
  const fitnessLevel = userProfile?.fitnessLevel || userProfile?.level || 'Intermediate';
  const bmi = userProfile?.bmi ?? '23.4';
  const bmiCategory = userProfile?.bmiCategory || 'Normal';
  const displayName = userProfile?.name?.trim() || 'Athlete';
  const weight =
    userProfile?.weight ??
    userProfile?.weightKg ??
    userProfile?.weight_kg ??
    74;

  const animatedStreak = useCountUp(streak, 1000);
  const animatedWaterCups = useCountUp(waterCups, 800);
  const animatedExercises = useCountUp(exercises.length || 6, 1200);

  useEffect(() => {
    setWater(email, waterCups);
  }, [email, waterCups]);

  useEffect(() => {
    if (workoutPlan) {
      setLoading(false);
      return;
    }

    async function loadWorkout() {
      try {
        setLoading(true);
        // TODO: connect backend — GET /workout/today?goal=${userProfile?.goal}&location=${userProfile?.workoutLocation}
        const data = await getTodayWorkout(
          userProfile?.goal,
          userProfile?.workoutLocation
        );
        setFetchedWorkout(data);
      } catch (error) {
        console.error("Failed to load today's workout:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWorkout();
  }, [workoutPlan, userProfile?.goal, userProfile?.workoutLocation]);

  const handleCompleteWorkout = () => {
    const nowComplete = toggleTodayComplete(email);
    setCompletedToday(nowComplete);
    setStreak(getStreak(email));
  };

  const decreaseWater = () => {
    setWaterCups((prev) => Math.max(0, prev - 1));
  };

  const increaseWater = () => {
    setWaterCups((prev) => Math.min(14, prev + 1));
  };

  const waterPercentage = Math.min(100, Math.round((waterCups / 14) * 100));
  const waterLiters = (waterCups * 0.25).toFixed(2);

  const workoutTitle =
    workout?.title ||
    workout?.name ||
    workout?.focus ||
    'Upper Body Destruction & Core';

  const workoutFocus = workout?.focus || 'Hypertrophy & Strength';
  const workoutDuration =
    workout?.duration ||
    workout?.estimatedDuration ||
    '45 min';

  // Workout progress calculation
  const workoutPct = completedToday ? 100 : 35;
  const ringRadius = 38;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (workoutPct / 100) * ringCircumference;

  return (
    <div className="min-h-full pb-24 lg:pb-12 text-[#F5F5F5]">
      <div className="mx-auto max-w-[1500px] space-y-8 p-4 sm:p-6 lg:p-8">

        {/* =========================================================
            HEADER BAR
        ========================================================= */}
        <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between border-b border-[#1f1f1f] pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-mono tracking-widest text-[#888] uppercase">
              <span className="flex items-center gap-1.5 text-volt-lime">
                <span className="h-2 w-2 rounded-full bg-volt-lime animate-pulse" />
                SYSTEM ONLINE
              </span>
              <span>/</span>
              <span>{todayName}</span>
              <span>/</span>
              <span className="text-[#00E5FF]">{userProfile?.exercisePreference || 'Hybrid Gym'}</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl tracking-wide uppercase text-white">
              PUSH HARDER, <span className="text-volt-lime">{displayName}</span>
            </h1>

            <p className="mt-1 text-sm text-[#888] font-sans max-w-xl">
              Consistency builds legends. Your daily session is prepped. Zero excuses today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={regenerating}
                className="inline-flex items-center gap-2 rounded-xl border border-[#222] bg-[#141414] px-4 py-2.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#bbb] transition hover:border-volt-lime/50 hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? 'animate-spin text-volt-lime' : ''}`} />
                {regenerating ? 'Compiling...' : 'Regen Plan'}
              </button>
            )}

            <button
              onClick={() => setActiveTab('aicoach')}
              className="inline-flex items-center gap-2 rounded-xl bg-volt-lime px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(198,241,53,0.35)] transition hover:bg-[#d8ff4f] hover:shadow-[0_0_25px_rgba(198,241,53,0.5)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Coach
            </button>
          </div>
        </section>

        {/* =========================================================
            HERO WORKOUT BANNER
        ========================================================= */}
        <section className="relative overflow-hidden rounded-3xl border border-volt-lime/30 bg-gradient-to-br from-[#12160d] via-[#0d0f0c] to-[#080808] p-6 sm:p-8 lg:p-10 shadow-[0_0_35px_rgba(198,241,53,0.12)]">
          {/* Subtle neon glow backdrops */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-volt-lime/15 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-cyan-neon/10 blur-3xl" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-volt-lime/40 bg-volt-lime/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-volt-lime uppercase">
                  <Zap className="h-3.5 w-3.5 fill-volt-lime" />
                  TODAY'S MISSION
                </span>
                <span className="rounded-full border border-cyan-neon/30 bg-cyan-neon/10 px-3 py-1 font-mono text-[11px] font-medium text-cyan-neon uppercase">
                  HIGH INTENSITY
                </span>
                <span className="rounded-full border border-[#333] bg-[#161616] px-3 py-1 font-mono text-[11px] text-[#888] uppercase">
                  {todayName}
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  <div className="h-12 w-80 animate-pulse rounded-lg bg-[#222]" />
                  <div className="h-5 w-48 animate-pulse rounded bg-[#1a1a1a]" />
                </div>
              ) : workout?.isRest ? (
                <div>
                  <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white">
                    REST & ACTIVE RECOVERY
                  </h2>
                  <p className="mt-2 text-sm text-[#888]">
                    Muscles grow during recovery. Hydrate, stretch, replenish glycogen, and sleep 8+ hours.
                  </p>
                </div>
              ) : (
                <div>
                  <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-white">
                    {workoutTitle}
                  </h2>
                  <p className="mt-2 font-mono text-xs sm:text-sm text-[#00E5FF] tracking-wider uppercase">
                    FOCUS: {workoutFocus}
                  </p>
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#252525] bg-[#141414]/90 px-3.5 py-2 font-mono text-xs text-[#ddd]">
                  <Dumbbell className="h-4 w-4 text-volt-lime" />
                  <span className="font-bold text-white">{animatedExercises}</span> EXERCISES
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#252525] bg-[#141414]/90 px-3.5 py-2 font-mono text-xs text-[#ddd]">
                  <Clock className="h-4 w-4 text-cyan-neon" />
                  <span>{workoutDuration}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-xl border border-[#252525] bg-[#141414]/90 px-3.5 py-2 font-mono text-xs text-[#ddd]">
                  <Target className="h-4 w-4 text-volt-lime" />
                  <span className="uppercase">{fitnessGoal}</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons & SVG Ring */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4 shrink-0 min-w-[240px]">
              <button
                onClick={() => setActiveTab('workout')}
                className="group relative flex items-center justify-center gap-3 rounded-2xl bg-volt-lime px-6 py-4 font-mono text-sm font-black tracking-wider text-black uppercase transition-all duration-300 hover:bg-[#d8ff4f] hover:shadow-[0_0_30px_rgba(198,241,53,0.6)] active:scale-95"
              >
                <span>ENTER ARENA</span>
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleCompleteWorkout}
                className={`flex items-center justify-center gap-2.5 rounded-2xl border px-6 py-3.5 font-mono text-xs font-bold tracking-wider uppercase transition-all ${
                  completedToday
                    ? 'border-volt-lime bg-volt-lime/15 text-volt-lime shadow-[0_0_15px_rgba(198,241,53,0.3)]'
                    : 'border-[#333] bg-[#161616] text-[#aaa] hover:border-[#555] hover:text-white'
                }`}
              >
                <CheckCircle2 className={`h-4 w-4 ${completedToday ? 'text-volt-lime' : 'text-[#666]'}`} />
                {completedToday ? 'SESSION LOGGED' : 'MARK COMPLETE'}
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================
            NEON METRICS BAR (4 TILES)
        ========================================================= */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Tile 1: Streak */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#101010] p-5 transition hover:border-volt-lime/50 hover:shadow-[0_0_20px_rgba(198,241,53,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-widest text-[#888] uppercase">
                STREAK
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-red-500/20 text-amber-400">
                <Flame className="h-5 w-5 animate-pulse" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-black text-white">{animatedStreak}</span>
              <span className="font-mono text-xs text-volt-lime uppercase">DAYS ON FIRE</span>
            </div>
            <div className="mt-2 text-xs text-[#666]">
              {completedToday ? 'Locked in for today' : '1 session away from +1'}
            </div>
          </div>

          {/* Tile 2: Goal */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#101010] p-5 transition hover:border-cyan-neon/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-widest text-[#888] uppercase">
                FOCUS GOAL
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-neon/10 text-cyan-neon">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 truncate font-display text-3xl font-black uppercase text-white">
              {fitnessGoal}
            </div>
            <div className="mt-2 font-mono text-xs text-[#00E5FF]">
              LEVEL: {fitnessLevel.toUpperCase()}
            </div>
          </div>

          {/* Tile 3: Hydration */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#101010] p-5 transition hover:border-cyan-neon/50 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-widest text-[#888] uppercase">
                HYDRATION
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-neon/10 text-cyan-neon">
                <Droplets className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-black text-white">{waterLiters}L</span>
              <span className="font-mono text-xs text-[#00E5FF]">/ 3.5L</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#777]">
              <span>{animatedWaterCups} / 14 cups</span>
              <span className="font-mono font-bold text-cyan-neon">{waterPercentage}%</span>
            </div>
          </div>

          {/* Tile 4: Body Index */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#101010] p-5 transition hover:border-volt-lime/50 hover:shadow-[0_0_20px_rgba(198,241,53,0.15)]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold tracking-widest text-[#888] uppercase">
                BMI & WEIGHT
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-volt-lime/10 text-volt-lime">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-display text-4xl font-black text-white">{bmi}</span>
              <span className="font-mono text-xs text-volt-lime uppercase">{bmiCategory}</span>
            </div>
            <div className="mt-2 text-xs text-[#777]">
              Current scale: <span className="font-mono text-white font-bold">{weight} KG</span>
            </div>
          </div>
        </section>

        {/* =========================================================
            HEATMAP + EXERCISES + SIDEBAR
        ========================================================= */}
        <section className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_380px]">

          {/* LEFT COLUMN: Heatmap + Exercises */}
          <div className="space-y-8">

            {/* Weekly Activity Heatmap Preview */}
            <div className="rounded-3xl border border-[#222] bg-[#101010] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#1f1f1f] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-volt-lime" />
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#888]">
                      CONSISTENCY RADAR
                    </span>
                  </div>
                  <h3 className="mt-1 font-display text-2xl uppercase tracking-wider text-white">
                    WEEKLY LOG & HEATMAP
                  </h3>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#777]">
                  <span>LESS</span>
                  <div className="h-3 w-3 rounded bg-[#1f1f1f]" />
                  <div className="h-3 w-3 rounded bg-volt-lime/30" />
                  <div className="h-3 w-3 rounded bg-volt-lime/70" />
                  <div className="h-3 w-3 rounded bg-volt-lime shadow-[0_0_8px_#C6F135]" />
                  <span>MORE</span>
                </div>
              </div>

              {/* Heatmap grid */}
              <div className="mt-5 grid grid-cols-7 gap-2.5 sm:gap-3">
                {MOCK_WEEKLY_HEATMAP.map((item, idx) => {
                  const isToday = item.day === todayName.slice(0, 3);
                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center rounded-2xl border p-3 transition ${
                        isToday
                          ? 'border-volt-lime/60 bg-volt-lime/10 shadow-[0_0_15px_rgba(198,241,53,0.15)]'
                          : 'border-[#1e1e1e] bg-[#141414] hover:border-[#333]'
                      }`}
                    >
                      <span className={`font-mono text-[11px] font-bold ${isToday ? 'text-volt-lime' : 'text-[#777]'}`}>
                        {item.day}
                      </span>
                      <div
                        className={`my-2 h-7 w-7 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition ${
                          item.status === 'completed'
                            ? 'bg-volt-lime text-black shadow-[0_0_10px_rgba(198,241,53,0.4)]'
                            : item.status === 'rest'
                            ? 'bg-cyan-neon/20 text-cyan-neon'
                            : isToday
                            ? 'border-2 border-dashed border-volt-lime text-volt-lime animate-pulse'
                            : 'bg-[#1c1c1c] text-[#444]'
                        }`}
                      >
                        {item.status === 'completed' ? '✓' : item.status === 'rest' ? 'Z' : '·'}
                      </div>
                      <span className="font-mono text-[10px] text-[#666]">
                        {item.calories > 0 ? `${item.calories}c` : 'Rest'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Exercises List */}
            <div className="rounded-3xl border border-[#222] bg-[#101010] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] p-6">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#888]">
                    EXERCISE SCHEDULE
                  </span>
                  <h3 className="mt-1 font-display text-2xl uppercase tracking-wider text-white">
                    TODAY'S DRILLS
                  </h3>
                </div>

                <button
                  onClick={() => setActiveTab('workout')}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-volt-lime hover:underline uppercase"
                >
                  FULL WORKOUT
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-20 animate-pulse rounded-2xl bg-[#161616]" />
                    ))}
                  </div>
                ) : workout?.isRest ? (
                  <div className="rounded-2xl border border-cyan-neon/30 bg-cyan-neon/5 p-8 text-center">
                    <Award className="mx-auto h-12 w-12 text-cyan-neon animate-pulse" />
                    <h4 className="mt-3 font-display text-2xl uppercase text-white tracking-wider">
                      RECOVERY PHASE ACTIVE
                    </h4>
                    <p className="mx-auto mt-1 max-w-md text-sm text-[#888]">
                      No heavy loads scheduled. Perform foam rolling, dynamic hip openers, and drink 3+ liters of water.
                    </p>
                  </div>
                ) : exercises.length === 0 ? (
                  <div className="rounded-2xl border border-[#222] bg-[#141414] p-8 text-center">
                    <Dumbbell className="mx-auto h-10 w-10 text-[#444]" />
                    <p className="mt-3 font-mono text-sm text-[#777]">
                      No exercises in roster today.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {exercises.map((exercise, index) => (
                      <button
                        key={index}
                        onClick={() => setExerciseModal && setExerciseModal(exercise)}
                        className="group flex w-full items-center gap-4 rounded-2xl border border-[#1e1e1e] bg-[#141414] p-4 text-left transition hover:border-volt-lime/50 hover:bg-[#181818] hover:shadow-[0_0_20px_rgba(198,241,53,0.08)]"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#101010] font-mono text-sm font-bold text-[#888] transition group-hover:border-volt-lime group-hover:bg-volt-lime group-hover:text-black">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-sans text-base font-bold text-white transition group-hover:text-volt-lime">
                            {exercise.name || `Exercise ${index + 1}`}
                          </h4>
                          <p className="mt-1 font-mono text-xs text-[#888]">
                            <span className="text-cyan-neon">{exercise.muscle || 'Full Body'}</span>
                            {' // '}
                            <span className="text-[#ccc]">{exercise.sets || 3} SETS</span>
                            {' × '}
                            <span className="text-[#ccc]">{exercise.reps || '8–12'} REPS</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="hidden sm:inline-block font-mono text-[11px] text-[#666] group-hover:text-[#aaa]">
                            DETAILS
                          </span>
                          <ChevronRight className="h-5 w-5 shrink-0 text-[#444] transition group-hover:translate-x-1 group-hover:text-volt-lime" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Access Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              <button
                onClick={() => setActiveTab('workout')}
                className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#121212] p-5 text-left transition hover:border-volt-lime/50 hover:bg-[#161616]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-volt-lime/10 text-volt-lime">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#444] transition group-hover:translate-x-1 group-hover:text-volt-lime" />
                </div>
                <h4 className="font-display text-xl uppercase tracking-wider text-white">
                  WORKOUT PLAN
                </h4>
                <p className="mt-1 text-xs text-[#888]">
                  Full 7-day training schedule
                </p>
              </button>

              <button
                onClick={() => setActiveTab('diet')}
                className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#121212] p-5 text-left transition hover:border-cyan-neon/50 hover:bg-[#161616]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-neon/10 text-cyan-neon">
                    <Apple className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#444] transition group-hover:translate-x-1 group-hover:text-cyan-neon" />
                </div>
                <h4 className="font-display text-xl uppercase tracking-wider text-white">
                  NATURAL DIET
                </h4>
                <p className="mt-1 text-xs text-[#888]">
                  High protein whole food plan
                </p>
              </button>

              <button
                onClick={() => setActiveTab('aicoach')}
                className="group relative overflow-hidden rounded-2xl border border-[#222] bg-[#121212] p-5 text-left transition hover:border-volt-lime/50 hover:bg-[#161616]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-volt-lime/10 text-volt-lime">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#444] transition group-hover:translate-x-1 group-hover:text-volt-lime" />
                </div>
                <h4 className="font-display text-xl uppercase tracking-wider text-white">
                  AI COACH
                </h4>
                <p className="mt-1 text-xs text-[#888]">
                  Instant form & nutrition advice
                </p>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: Hydration Tracker + Nutrition Banner */}
          <aside className="space-y-6">

            {/* Hydration Station */}
            <div className="rounded-3xl border border-[#222] bg-[#101010] p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-neon/15 text-cyan-neon shadow-[0_0_12px_rgba(0,229,255,0.2)]">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl uppercase tracking-wider text-white">
                      HYDRATION
                    </h3>
                    <p className="font-mono text-[11px] text-[#777]">
                      TARGET: 3.50L
                    </p>
                  </div>
                </div>

                <span className="font-mono text-sm font-bold text-cyan-neon">
                  {waterLiters}L
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-baseline justify-between font-mono">
                  <span className="text-3xl font-black text-white">
                    {waterCups}
                    <span className="ml-1 text-xs font-normal text-[#666]">/ 14 CUPS</span>
                  </span>
                  <span className="text-xs font-bold text-cyan-neon">{waterPercentage}%</span>
                </div>

                {/* Cyber progress bar */}
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#1c1c1c] p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-neon to-volt-lime transition-all duration-500 shadow-[0_0_10px_#00E5FF]"
                    style={{ width: `${waterPercentage}%` }}
                  />
                </div>
              </div>

              {/* Water Cups Interactive Grid */}
              <div className="mt-6 grid grid-cols-7 gap-1.5">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setWaterCups(i + 1)}
                    className={`h-7 rounded-lg cursor-pointer transition flex items-center justify-center font-mono text-[10px] font-bold ${
                      i < waterCups
                        ? 'bg-cyan-neon text-black shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                        : 'border border-[#252525] bg-[#141414] text-[#444] hover:border-cyan-neon/40'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={decreaseWater}
                  className="flex h-11 w-12 items-center justify-center rounded-xl border border-[#2a2a2a] bg-[#161616] font-mono text-base font-bold text-[#888] transition hover:border-[#444] hover:text-white"
                >
                  −
                </button>
                <button
                  onClick={increaseWater}
                  className="flex-1 rounded-xl bg-cyan-neon px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#5cf0ff] hover:shadow-[0_0_20px_rgba(0,229,255,0.4)]"
                >
                  + 250 ML CUP
                </button>
              </div>
            </div>

            {/* Streak Motivator Card */}
            <div className="relative overflow-hidden rounded-3xl border border-volt-lime/30 bg-gradient-to-br from-[#12160d] to-[#0a0a0a] p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold tracking-widest text-volt-lime uppercase">
                    MOMENTUM MULTIPLIER
                  </span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-display text-5xl font-black text-white">
                      {streak}
                    </span>
                    <span className="font-mono text-xs text-[#888] uppercase">
                      {streak === 1 ? 'DAY STREAK' : 'DAYS STREAK'}
                    </span>
                  </div>
                </div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-volt-lime/15 text-volt-lime shadow-[0_0_20px_rgba(198,241,53,0.3)]">
                  <Flame className="h-7 w-7 animate-pulse fill-volt-lime" />
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-[#999]">
                {completedToday
                  ? '⚡ Streak locked for today! Momentum maintained. Rest well tonight.'
                  : '🔥 Crush today’s workout to lock in day ' + (streak + 1) + '. Don’t let the flame die!'}
              </p>
            </div>

            {/* Whole Food Nutrition Callout */}
            <div className="rounded-3xl border border-[#222] bg-[#101010] p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-volt-lime/10 text-volt-lime">
                  <Leaf className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg uppercase tracking-wider text-white">
                      NATURAL FUEL
                    </h3>
                    <span className="rounded-full bg-volt-lime/15 px-2 py-0.5 font-mono text-[10px] font-bold text-volt-lime">
                      CLEAN
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#888] leading-5">
                    Target: 140g+ whole protein from paneer, tofu, sprouts, lentils, eggs & greek curd.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('diet')}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#161616] py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:border-volt-lime/50 hover:bg-volt-lime/10"
              >
                <span>EXPLORE DIET PLAN</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </aside>
        </section>

      </div>
    </div>
  );
}