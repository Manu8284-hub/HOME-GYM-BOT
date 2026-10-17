import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Calendar,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Bot,
  CheckCircle2,
  Play,
  Info,
  X,
  Volume2,
  VolumeX,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  RotateCcw,
  Zap,
  Dumbbell
} from 'lucide-react';
import { getWorkouts } from '../services/api';
import {
  getSessionEmail,
  getWorkoutExerciseProgress,
  isTodayComplete,
  toggleTodayComplete,
  toggleWorkoutExercise,
  getStreak,
} from '../services/localStore';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkoutPlanner({ userProfile, plan, onAskAI, setExerciseModal }) {
  const todayName = DAYS[(new Date().getDay() + 6) % 7];
  const [activeDay, setActiveDay] = useState(todayName);
  const [fallbackData, setFallbackData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Live Workout Mode States
  const [liveMode, setLiveMode] = useState(false);
  const [liveIndex, setLiveIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(0);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibeEnabled, setVibeEnabled] = useState(true);

  const [completedExercises, setCompletedExercises] = useState(() =>
    getWorkoutExerciseProgress(getSessionEmail(), todayName)
  );
  const [workoutComplete, setWorkoutComplete] = useState(() =>
    isTodayComplete(getSessionEmail())
  );
  const [streak, setStreak] = useState(() => getStreak(getSessionEmail()));

  const workoutPlan = plan?.workoutPlan || null;
  const planData = workoutPlan || fallbackData;
  const isPersonalized = Boolean(workoutPlan);

  const fitnessGoal = workoutPlan?.goal || userProfile?.fitnessGoal || 'Build Muscle';
  const exercisePreference = userProfile?.exercisePreference || 'Home Bodyweight';

  useEffect(() => {
    if (workoutPlan) {
      setLoading(false);
      return;
    }
    async function loadPlan() {
      try {
        setLoading(true);
        // TODO: connect backend — GET /workout/plan?preference=Home&location=Home
        const data = await getWorkouts('Home Workout', 'Home');
        setFallbackData(data);
      } catch (err) {
        console.error('Error fetching workouts', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlan();
  }, [workoutPlan, userProfile?.workoutLocation, userProfile?.goal]);

  const currentSchedule = planData?.schedule?.[activeDay] || {};
  const currentExercises = Array.isArray(currentSchedule.exercises) ? currentSchedule.exercises : [];

  useEffect(() => {
    const progress = getWorkoutExerciseProgress(getSessionEmail(), activeDay);
    setCompletedExercises(progress);
  }, [activeDay, todayName]);

  // Rest Timer in Live Mode
  useEffect(() => {
    if (!isResting || restSecondsLeft <= 0) {
      if (restSecondsLeft <= 0 && isResting) {
        setIsResting(false);
      }
      return;
    }
    const timer = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsResting(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isResting, restSecondsLeft]);

  const handleExerciseToggle = (index) => {
    const nextValue = toggleWorkoutExercise(getSessionEmail(), activeDay, index);
    setCompletedExercises((prev) => ({ ...prev, [index]: nextValue }));
  };

  const handleCompleteWorkout = () => {
    const nextValue = toggleTodayComplete(getSessionEmail());
    setWorkoutComplete(nextValue);
    setStreak(getStreak(getSessionEmail()));
  };

  const exerciseCount = currentExercises.length;
  const completedCount = Object.values(completedExercises).filter(Boolean).length;

  // Live Workout Handlers
  const startLiveMode = () => {
    setLiveMode(true);
    setLiveIndex(0);
    setCurrentSet(1);
    setCurrentReps(0);
    setIsResting(false);
  };

  const currentLiveEx = currentExercises[liveIndex] || {
    name: 'Push-ups',
    sets: 3,
    reps: '12-15',
    rest: '60s',
    muscle: 'Chest',
  };

  const totalSets = parseInt(currentLiveEx.sets) || 3;
  const targetReps = parseInt(currentLiveEx.reps) || 12;

  const handleLogSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet((prev) => prev + 1);
      // Trigger rest period (e.g. 45s)
      setRestSecondsLeft(45);
      setIsResting(true);
      setCurrentReps(0);
    } else {
      // Completed this exercise
      handleExerciseToggle(liveIndex);
      if (liveIndex < currentExercises.length - 1) {
        setLiveIndex((prev) => prev + 1);
        setCurrentSet(1);
        setRestSecondsLeft(60);
        setIsResting(true);
        setCurrentReps(0);
      } else {
        // Finished all
        handleCompleteWorkout();
        setLiveMode(false);
      }
    }
  };

  // Touch Swipe for Live Mode
  const touchStartX = useRef(0);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && liveIndex < currentExercises.length - 1) {
      setLiveIndex((prev) => prev + 1);
      setCurrentSet(1);
    } else if (diff < -50 && liveIndex > 0) {
      setLiveIndex((prev) => prev - 1);
      setCurrentSet(1);
    }
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-12 text-[#F5F5F5]">

      {/* =========================================================
          PLAN HEADER
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[#222] bg-[#101010] p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-volt-lime/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-volt-lime/40 bg-volt-lime/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-volt-lime uppercase">
                {isPersonalized ? <Sparkles className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                {isPersonalized ? 'AI CUSTOMIZED FOR YOU' : '7-DAY PROTOCOL'}
              </span>
              <span className="rounded-full border border-[#333] bg-[#161616] px-3 py-1 font-mono text-[11px] text-[#888] uppercase">
                {exercisePreference}
              </span>
            </div>

            <h2 className="font-display text-3xl sm:text-5xl uppercase tracking-wider text-white">
              {fitnessGoal} // ROUTINE
            </h2>

            <p className="mt-2 text-xs sm:text-sm text-[#888] max-w-2xl leading-relaxed">
              {planData?.description || 'Engineered weekly split for optimal hypertrophy and neuromuscular strength.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={startLiveMode}
              disabled={currentSchedule.isRest || currentExercises.length === 0}
              className="flex items-center gap-2.5 rounded-2xl bg-volt-lime px-6 py-4 font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#d8ff4f] hover:shadow-[0_0_25px_rgba(198,241,53,0.5)] active:scale-95 disabled:opacity-40"
            >
              <Play className="h-4 w-4 fill-black" />
              START LIVE ARENA
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================
          7-DAY NAVIGATION TABS
      ========================================================= */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {DAYS.map((day) => {
          const isActive = activeDay === day;
          const isRest = Boolean(planData?.schedule?.[day]?.isRest);
          const isToday = day === todayName;

          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`group flex min-w-[100px] flex-1 flex-col items-center rounded-2xl border p-3.5 transition-all shrink-0 ${
                isActive
                  ? 'border-volt-lime bg-volt-lime/15 text-white shadow-[0_0_20px_rgba(198,241,53,0.2)]'
                  : isRest
                  ? 'border-[#1c1c1c] bg-[#121212] text-[#666] hover:border-[#333]'
                  : 'border-[#222] bg-[#141414] text-[#aaa] hover:border-volt-lime/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold uppercase">{day.slice(0, 3)}</span>
                {isToday && <span className="h-1.5 w-1.5 rounded-full bg-volt-lime animate-ping" />}
              </div>
              <span
                className={`mt-1 font-mono text-[10px] uppercase tracking-wider ${
                  isActive ? 'text-volt-lime font-bold' : isRest ? 'text-[#555]' : 'text-cyan-neon'
                }`}
              >
                {isRest ? 'REST' : 'FOCUS'}
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          DAY FOCUS BANNER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-[#222] bg-[#101010] p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-volt-lime">
            <Zap className="h-4 w-4 fill-volt-lime" />
            {activeDay} FOCUS: {currentSchedule.focus || 'Full Body Strength'}
          </div>
          <p className="mt-1 font-mono text-xs text-[#777]">
            {completedCount} of {exerciseCount} DRILLS COMPLETED // STREAK: {streak} DAYS
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleCompleteWorkout}
            disabled={activeDay !== todayName}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition ${
              workoutComplete
                ? 'border border-volt-lime bg-volt-lime/20 text-volt-lime'
                : 'border border-[#333] bg-[#181818] text-[#ccc] hover:border-[#555] hover:text-white'
            } disabled:opacity-40`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {workoutComplete ? 'LOGGED TODAY' : 'MARK DAY COMPLETE'}
          </button>

          <button
            onClick={() =>
              onAskAI?.(
                `Give me form corrections, activation drills, and progression tips for today's ${activeDay} focus: ${currentSchedule.focus}.`
              )
            }
            className="flex items-center gap-2 rounded-xl border border-volt-lime/30 bg-[#161616] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-volt-lime hover:bg-volt-lime/10 transition"
          >
            <Bot className="h-4 w-4" /> ASK AI
          </button>
        </div>
      </div>

      {/* =========================================================
          EXERCISE CARDS GRID
      ========================================================= */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-3xl bg-[#141414]" />
          ))}
        </div>
      ) : currentSchedule.isRest ? (
        <div className="rounded-3xl border border-cyan-neon/30 bg-[#101010] p-12 text-center shadow-[0_0_25px_rgba(0,229,255,0.08)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-neon/15 text-cyan-neon">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
          <h3 className="mt-4 font-display text-3xl uppercase tracking-wider text-white">
            RECHARGE PROTOCOL
          </h3>
          <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[#888]">
            Today is reserved for physiological recovery. Prioritize protein synthesis, 3.5L water, and 8 hours of sleep.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentExercises.map((ex, idx) => {
            const isDone = Boolean(completedExercises[idx]);
            const diffColor =
              ex.difficulty === 'Advanced'
                ? 'border-red-500/40 bg-red-500/10 text-red-400'
                : ex.difficulty === 'Intermediate'
                ? 'border-cyan-neon/40 bg-cyan-neon/10 text-cyan-neon'
                : 'border-volt-lime/40 bg-volt-lime/10 text-volt-lime';

            return (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-3xl border p-5 transition-all duration-300 ${
                  isDone
                    ? 'border-volt-lime/50 bg-[#11140e] shadow-[0_0_20px_rgba(198,241,53,0.12)]'
                    : 'border-[#222] bg-[#121212] hover:border-[#383838] hover:bg-[#151515]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleExerciseToggle(idx)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition ${
                          isDone
                            ? 'bg-volt-lime text-black shadow-[0_0_12px_rgba(198,241,53,0.5)]'
                            : 'border border-[#2a2a2a] bg-[#181818] text-[#777] hover:border-volt-lime hover:text-white'
                        }`}
                        title={isDone ? 'Mark incomplete' : 'Mark drill complete'}
                      >
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : `#${idx + 1}`}
                      </button>

                      <div>
                        <h4 className="font-sans text-base font-bold text-white">
                          {ex.name}
                        </h4>
                        <span className="font-mono text-xs text-cyan-neon">
                          {ex.muscle || 'Full Body'}
                        </span>
                      </div>
                    </div>

                    <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${diffColor}`}>
                      {ex.difficulty || 'Intermediate'}
                    </span>
                  </div>

                  {/* Sets / Reps / Rest matrix */}
                  <div className="grid grid-cols-3 gap-2 rounded-2xl border border-[#222] bg-[#0c0c0c] p-3 text-center mb-4 font-mono">
                    <div>
                      <span className="text-[10px] text-[#666] block uppercase">SETS</span>
                      <span className="text-sm font-bold text-white">{ex.sets}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666] block uppercase">REPS</span>
                      <span className="text-sm font-bold text-volt-lime">{ex.reps}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#666] block uppercase">REST</span>
                      <span className="text-sm font-bold text-cyan-neon">{ex.rest}</span>
                    </div>
                  </div>

                  {/* Instructions */}
                  <p className="text-xs text-[#bbb] leading-relaxed rounded-xl border border-[#1e1e1e] bg-[#0e0e0e] p-3 mb-3">
                    <strong className="text-white font-mono text-[11px] block mb-0.5 uppercase text-volt-lime">
                      EXECUTION CUE:
                    </strong>
                    {ex.instructions}
                  </p>

                  {ex.commonMistakes && (
                    <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5 font-sans text-xs text-amber-300">
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-amber-200">Avoid:</strong> {ex.commonMistakes}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#666] truncate max-w-[180px]">
                    ALT: <span className="text-cyan-neon font-semibold">{ex.alternative}</span>
                  </span>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExerciseModal?.(ex)}
                      className="flex items-center gap-1 text-[#aaa] hover:text-white transition"
                    >
                      <Info className="h-3.5 w-3.5" /> DETAILS
                    </button>
                    <button
                      onClick={() => onAskAI?.(`How do I execute ${ex.name} safely with perfect biomechanics?`)}
                      className="flex items-center gap-1 text-volt-lime hover:underline transition font-bold"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> COACH AI
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================
          LIVE WORKOUT FULLSCREEN OVERLAY
      ========================================================= */}
      {liveMode && (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="fixed inset-0 z-50 flex flex-col bg-[#050505] p-4 sm:p-8 animate-fadeIn text-white overflow-y-auto"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-[#222] pb-4">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-volt-lime/20 border border-volt-lime px-3 py-1 font-mono text-xs font-bold text-volt-lime uppercase">
                LIVE ARENA
              </span>
              <span className="font-mono text-xs text-[#888]">
                DRILL {liveIndex + 1} OF {currentExercises.length}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-xl border ${soundEnabled ? 'border-volt-lime text-volt-lime' : 'border-[#333] text-[#555]'}`}
                title="Audio Cues"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setVibeEnabled(!vibeEnabled)}
                className={`p-2 rounded-xl border ${vibeEnabled ? 'border-cyan-neon text-cyan-neon' : 'border-[#333] text-[#555]'}`}
                title="Haptic Feedback"
              >
                <Smartphone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLiveMode(false)}
                className="p-2 rounded-xl bg-[#1c1c1c] text-[#888] hover:text-white border border-[#333]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Central Stage */}
          <div className="flex-1 flex flex-col items-center justify-center my-6 max-w-xl mx-auto w-full text-center">
            <span className="font-mono text-xs text-cyan-neon tracking-widest uppercase">
              {currentLiveEx.muscle || 'Target Area'}
            </span>
            <h2 className="font-display text-4xl sm:text-6xl uppercase tracking-wider text-white mt-1">
              {currentLiveEx.name}
            </h2>

            {/* Set Progression */}
            <div className="mt-4 flex items-center gap-2">
              {Array.from({ length: totalSets }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-12 rounded-full transition-all ${
                    i + 1 < currentSet
                      ? 'bg-volt-lime shadow-[0_0_8px_#C6F135]'
                      : i + 1 === currentSet
                      ? 'bg-white animate-pulse'
                      : 'bg-[#222]'
                  }`}
                />
              ))}
            </div>
            <p className="font-mono text-xs text-[#888] mt-2">
              SET {currentSet} OF {totalSets}
            </p>

            {/* Circular Countdown Rest Timer or Giant Rep Counter */}
            <div className="my-8">
              {isResting ? (
                <div className="relative flex items-center justify-center">
                  <svg className="h-56 w-56 -rotate-90">
                    <circle
                      cx="112"
                      cy="112"
                      r="90"
                      stroke="#222"
                      strokeWidth="12"
                      fill="none"
                    />
                    <circle
                      cx="112"
                      cy="112"
                      r="90"
                      stroke="#00E5FF"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={565.48}
                      strokeDashoffset={565.48 - (restSecondsLeft / 45) * 565.48}
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-display text-7xl text-cyan-neon">
                      {restSecondsLeft}
                    </span>
                    <span className="font-mono text-xs uppercase text-[#888]">
                      SECONDS REST
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setCurrentReps((prev) => prev + 1)}
                  className="group relative cursor-pointer select-none rounded-full border-4 border-volt-lime/40 bg-volt-lime/5 p-12 transition hover:border-volt-lime hover:shadow-[0_0_50px_rgba(198,241,53,0.3)] active:scale-95"
                >
                  <div className="flex flex-col items-center">
                    <span className="font-display text-8xl sm:text-9xl text-volt-lime">
                      {currentReps}
                    </span>
                    <span className="font-mono text-xs tracking-widest text-[#888] uppercase">
                      TARGET: {targetReps} REPS (TAP TO COUNT)
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Live Instruction cue */}
            <p className="text-xs sm:text-sm text-[#aaa] max-w-md font-sans leading-relaxed">
              {currentLiveEx.instructions}
            </p>
          </div>

          {/* Bottom Action Controls */}
          <div className="border-t border-[#222] pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-2xl mx-auto w-full">
            <button
              onClick={() => liveIndex > 0 && setLiveIndex((prev) => prev - 1)}
              disabled={liveIndex === 0}
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#777] hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" /> PREV DRILL
            </button>

            <button
              onClick={handleLogSet}
              className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-volt-lime font-mono text-sm font-black uppercase tracking-wider text-black transition hover:bg-[#d8ff4f] hover:shadow-[0_0_30px_rgba(198,241,53,0.5)] active:scale-95"
            >
              {isResting
                ? 'SKIP REST & RESUME'
                : currentSet < totalSets
                ? `COMPLETE SET ${currentSet} (${targetReps} REPS)`
                : liveIndex < currentExercises.length - 1
                ? 'NEXT DRILL'
                : 'FINISH WORKOUT'}
            </button>

            <button
              onClick={() =>
                liveIndex < currentExercises.length - 1 && setLiveIndex((prev) => prev + 1)
              }
              disabled={liveIndex >= currentExercises.length - 1}
              className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-[#777] hover:text-white disabled:opacity-30"
            >
              SKIP DRILL <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
