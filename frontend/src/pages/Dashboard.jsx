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

  const fitnessGoal = userProfile?.fitnessGoal || 'Build Muscle';
  const fitnessLevel = userProfile?.fitnessLevel || 'Beginner';
  const bmi = userProfile?.bmi ?? '--';
  const bmiCategory = userProfile?.bmiCategory || 'Unknown';

  const displayName = userProfile?.name?.trim() || 'Athlete';

  const weight =
    userProfile?.weight ??
    userProfile?.weightKg ??
    userProfile?.weight_kg ??
    null;

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
  }, [
    workoutPlan,
    userProfile?.goal,
    userProfile?.workoutLocation,
  ]);

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

  const waterPercentage = Math.min(100, (waterCups / 14) * 100);
  const waterLiters = (waterCups * 0.25).toFixed(2);

  const workoutTitle =
    workout?.title ||
    workout?.name ||
    workout?.focus ||
    'Today’s Workout';

  const workoutFocus = workout?.focus || 'Full Body';

  const workoutDuration =
    workout?.duration ||
    workout?.estimatedDuration ||
    '20–30 min';

  return (
    <div className="min-h-full bg-slate-50 pb-24 lg:pb-10">
      <div className="mx-auto max-w-[1500px] space-y-6 p-4 sm:p-6 lg:p-8">

        {/* =========================================================
            HEADER
        ========================================================= */}
        <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Home className="h-4 w-4" />
                {todayName}
              </span>

              <span className="text-slate-300">•</span>

              <span>
                {userProfile?.exercisePreference ||
                  'Home Bodyweight'}
              </span>
            </div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Good morning,{' '}
              <span className="text-emerald-600">
                {displayName}
              </span>
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Ready to make today count? Your personalized workout
              is waiting.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={regenerating}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    regenerating ? 'animate-spin' : ''
                  }`}
                />

                {regenerating
                  ? 'Generating...'
                  : 'Regenerate'}
              </button>
            )}

            <button
              onClick={() => setActiveTab('aicoach')}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4" />
              AI Coach
            </button>
          </div>
        </section>

        {/* =========================================================
            TODAY'S WORKOUT HERO
        ========================================================= */}
        <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
          <div className="grid lg:grid-cols-[1fr_auto]">

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
                  <Dumbbell className="h-3.5 w-3.5" />
                  TODAY'S WORKOUT
                </span>

                <span className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                  Equipment-free
                </span>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  {todayName}
                </span>
              </div>

              {loading ? (
                <>
                  <div className="h-10 w-72 animate-pulse rounded-lg bg-white/10" />
                  <div className="mt-3 h-5 w-52 animate-pulse rounded bg-white/10" />
                </>
              ) : workout?.isRest ? (
                <>
                  <h2 className="font-heading text-3xl font-extrabold sm:text-4xl">
                    Rest & Recovery
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                    Take today to recover, hydrate and prepare for
                    your next workout.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {workoutTitle}
                  </h2>

                  <p className="mt-3 text-sm text-slate-400 sm:text-base">
                    {todayName} · {workoutFocus}
                  </p>
                </>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-slate-200">
                  <Dumbbell className="h-4 w-4" />
                  {exercises.length} exercises
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-slate-200">
                  <Clock className="h-4 w-4" />
                  {workoutDuration}
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-slate-200">
                  <Target className="h-4 w-4" />
                  {fitnessGoal}
                </div>
              </div>
            </div>

            <div className="flex min-w-[230px] flex-col justify-center gap-3 bg-white/5 p-6 lg:w-[270px]">
              <button
                onClick={() => setActiveTab('workout')}
                className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
              >
                Start Workout
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleCompleteWorkout}
                className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                  completedToday
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />

                {completedToday
                  ? 'Workout Completed'
                  : 'Mark as Completed'}
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================
            STATS
        ========================================================= */}
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Goal
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Target className="h-4 w-4" />
              </div>
            </div>

            <p className="font-heading text-lg font-bold text-slate-900">
              {fitnessGoal}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your current target
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Level
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>

            <p className="font-heading text-lg font-bold text-slate-900">
              {fitnessLevel}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Current fitness level
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Streak
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <Flame className="h-4 w-4" />
              </div>
            </div>

            <p className="font-heading text-lg font-bold text-slate-900">
              {streak} {streak === 1 ? 'day' : 'days'}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Keep it going
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                BMI
              </span>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>

            <p className="font-heading text-lg font-bold text-slate-900">
              {bmi}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {bmiCategory}
            </p>
          </div>
        </section>

        {/* =========================================================
            MAIN CONTENT
        ========================================================= */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_350px]">

          {/* LEFT */}
          <div className="space-y-6">

            {/* Exercises */}
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Workout Plan
                  </p>

                  <h3 className="mt-1 font-heading text-xl font-bold text-slate-900">
                    Today's Exercises
                  </h3>
                </div>

                <button
                  onClick={() => setActiveTab('workout')}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-slate-600 transition hover:text-emerald-600"
                >
                  View all
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((item) => (
                      <div
                        key={item}
                        className="h-20 animate-pulse rounded-2xl bg-slate-100"
                      />
                    ))}
                  </div>
                ) : workout?.isRest ? (
                  <div className="rounded-2xl bg-emerald-50 p-8 text-center">
                    <Award className="mx-auto h-10 w-10 text-emerald-500" />

                    <h4 className="mt-3 font-bold text-slate-900">
                      Rest & Recovery Day
                    </h4>

                    <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                      Recover today, stay hydrated and get ready
                      for your next workout.
                    </p>
                  </div>
                ) : exercises.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 p-8 text-center">
                    <Dumbbell className="mx-auto h-8 w-8 text-slate-400" />

                    <p className="mt-3 text-sm text-slate-500">
                      No exercises available for today.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {exercises.map((exercise, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          setExerciseModal &&
                          setExerciseModal(exercise)
                        }
                        className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-500 transition group-hover:bg-emerald-100 group-hover:text-emerald-700">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="truncate font-semibold text-slate-900">
                            {exercise.name ||
                              `Exercise ${index + 1}`}
                          </h4>

                          <p className="mt-1 text-xs text-slate-400">
                            {exercise.muscle || 'Full Body'}
                            {' · '}
                            {exercise.sets || 3} sets
                            {' × '}
                            {exercise.reps || '8–12'} reps
                          </p>
                        </div>

                        <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Access */}
            <div>
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quick Access
                </p>

                <h3 className="mt-1 font-heading text-xl font-bold text-slate-900">
                  What do you want to do?
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">

                <button
                  onClick={() => setActiveTab('workout')}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      <Dumbbell className="h-5 w-5" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700" />
                  </div>

                  <h4 className="font-bold text-slate-900">
                    Today's Workout
                  </h4>

                  <p className="mt-1 text-xs text-slate-400">
                    View your complete routine
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('diet')}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Apple className="h-5 w-5" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
                  </div>

                  <h4 className="font-bold text-slate-900">
                    Natural Diet
                  </h4>

                  <p className="mt-1 text-xs text-slate-400">
                    Whole-food meal ideas
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('aicoach')}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-600" />
                  </div>

                  <h4 className="font-bold text-slate-900">
                    AI Coach
                  </h4>

                  <p className="mt-1 text-xs text-slate-400">
                    Ask your fitness coach
                  </p>
                </button>

              </div>
            </div>
          </div>

          {/* RIGHT */}
          <aside className="space-y-6">

            {/* Water */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                    <Droplets className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Water
                    </h3>

                    <p className="text-xs text-slate-400">
                      Daily target
                    </p>
                  </div>
                </div>

                <span className="text-sm font-bold text-slate-900">
                  {waterLiters}L
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-end justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">
                    {waterCups}
                    <span className="ml-1 text-sm font-medium text-slate-400">
                      / 14 cups
                    </span>
                  </span>

                  <span className="text-xs font-semibold text-cyan-600">
                    {Math.round(waterPercentage)}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                    style={{
                      width: `${waterPercentage}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={decreaseWater}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-600 transition hover:bg-slate-100"
                >
                  −
                </button>

                <button
                  onClick={increaseWater}
                  className="flex-1 rounded-xl bg-cyan-50 text-sm font-bold text-cyan-700 transition hover:bg-cyan-100"
                >
                  + 250 ml
                </button>
              </div>
            </div>

            {/* Streak */}
            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Current Streak
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-heading text-4xl font-extrabold">
                      {streak}
                    </span>

                    <span className="text-sm text-slate-400">
                      {streak === 1 ? 'day' : 'days'}
                    </span>
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/15 text-orange-400">
                  <Flame className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-400">
                {completedToday
                  ? 'Great work. Today’s workout is complete.'
                  : "Complete today's workout to keep your streak going."}
              </p>
            </div>

            {/* BMI */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <TrendingUp className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Current BMI
                  </p>

                  <p className="font-heading text-2xl font-extrabold text-slate-900">
                    {bmi}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">
                    Category
                  </span>

                  <span className="text-sm font-semibold text-slate-700">
                    {bmiCategory}
                  </span>
                </div>

                {weight && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-slate-400">
                      Weight
                    </span>

                    <span className="text-sm font-semibold text-slate-700">
                      {weight} kg
                    </span>
                  </div>
                )}
              </div>
            </div>

          </aside>
        </section>

        {/* =========================================================
            NATURAL NUTRITION
        ========================================================= */}
        <section className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <Leaf className="h-5 w-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Natural Whole-Food Nutrition
                  </h3>

                  <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 sm:inline-block">
                    NATURAL
                  </span>
                </div>

                <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
                  Build your meals around whole foods such as
                  paneer, tofu, soya, sprouts, lentils, curd,
                  fruits and vegetables.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('diet')}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
              View Diet Plan
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}