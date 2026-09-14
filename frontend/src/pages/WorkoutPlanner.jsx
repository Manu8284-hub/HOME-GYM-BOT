import React, { useState, useEffect } from 'react';
import { Home, Calendar, AlertCircle, RefreshCw, Sparkles, Bot, Award } from 'lucide-react';
import { getWorkouts } from '../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function WorkoutPlanner({ userProfile, setUserProfile, plan, onAskAI, setExerciseModal }) {
  const todayName = DAYS[(new Date().getDay() + 6) % 7];
  const [activeDay, setActiveDay] = useState(todayName);
  const [fallbackData, setFallbackData] = useState(null);
  const [loading, setLoading] = useState(true);

  // The user's own AI-generated plan is the source of truth. The generic
  // getWorkouts() fetch is only a fallback for when no plan exists yet.
  const workoutPlan = plan?.workoutPlan || null;
  const planData = workoutPlan || fallbackData;
  const isPersonalized = Boolean(workoutPlan);

  const isHome = true;
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

  const toggleLocation = (newLoc) => {
    if (setUserProfile && newLoc === 'Home') {
      setUserProfile(prev => ({
        ...prev,
        workoutLocation: 'Home',
        goal: 'Home Workout',
        exercisePreference: 'Home Bodyweight'
      }));
    }
  };

  const currentSchedule = planData?.schedule?.[activeDay] || {};

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1">
            {isPersonalized ? <><Sparkles className="w-3.5 h-3.5" /> AI-personalized for you</> : <><Calendar className="w-3.5 h-3.5" /> Mon - Sun Split</>}
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-800">
            {fitnessGoal} · 🏠 Home Workout (No Equipment)
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            {planData?.description || 'Customized weekly workout split.'}
            <span className="block mt-1 text-emerald-700 font-medium">
              Style: {exercisePreference} · BMI: {userProfile?.bmi ?? '--'} ({userProfile?.bmiCategory || 'Unknown'})
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 p-1.5 rounded-2xl">
          <button onClick={() => toggleLocation('Home')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isHome ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map((day) => {
          const isActive = activeDay === day;
          const isRest = Boolean(planData?.schedule?.[day]?.isRest);
          return (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`px-5 py-3 rounded-2xl text-sm font-bold shrink-0 transition-all flex flex-col items-center gap-1 border-2 ${
                isActive
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-200 scale-105'
                  : isRest
                  ? 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-200 hover:text-slate-800'
              }`}
            >
              <span>{day}</span>
              <span className={`text-[10px] font-normal px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {isRest ? 'Rest' : 'Focus'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Focus Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{activeDay} · Bodyweight</span>
          <h3 className="font-heading font-extrabold text-xl text-slate-800 mt-0.5">Focus: {currentSchedule.focus || 'Upper Body'}</h3>
        </div>
        <button
          onClick={() => onAskAI(`Design a ${fitnessGoal.toLowerCase()} home workout plan for ${userProfile?.name || 'me'} using ${exercisePreference.toLowerCase()} training. Add warm up tips and form cues for ${activeDay} ${currentSchedule.focus} in Home mode. BMI: ${userProfile?.bmi ?? 'unknown'}.`)}
          className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
        >
          <Bot className="w-4 h-4" /> Ask AI Coach
        </button>
      </div>

      {/* Exercise Cards */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">Loading workout...</div>
      ) : currentSchedule.isRest ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-200">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-2xl text-slate-800">Rest & Recovery Day</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">Allow your body to repair. Stay hydrated and prioritise whole-food protein nutrition today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentSchedule.exercises?.map((ex, idx) => (
            <div key={idx} className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center border border-emerald-200">#{idx + 1}</div>
                    <div>
                      <h4 className="font-heading font-bold text-lg text-slate-800">{ex.name}</h4>
                      <span className="text-xs text-emerald-600 font-medium">{ex.muscle}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    ex.difficulty === 'Advanced' ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : ex.difficulty === 'Intermediate' ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-emerald-50 text-emerald-600 border-emerald-200'
                  }`}>{ex.difficulty}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-3 rounded-2xl text-center mb-4">
                  <div><span className="text-[10px] text-slate-400 block">Sets</span><span className="font-bold text-slate-700 text-xs">{ex.sets}</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Reps</span><span className="font-bold text-emerald-600 text-xs">{ex.reps}</span></div>
                  <div><span className="text-[10px] text-slate-400 block">Rest</span><span className="font-bold text-cyan-600 text-xs">{ex.rest}</span></div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3">
                  <strong className="text-slate-700">Form:</strong> {ex.instructions}
                </p>

                {ex.commonMistakes && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-start gap-2">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span><strong>Avoid:</strong> {ex.commonMistakes}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                <span className="text-slate-400 truncate max-w-[180px]">Alt: <span className="text-cyan-600 font-medium">{ex.alternative}</span></span>
                <button onClick={() => onAskAI(`How to correctly perform ${ex.name}?`)} className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Ask AI
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
