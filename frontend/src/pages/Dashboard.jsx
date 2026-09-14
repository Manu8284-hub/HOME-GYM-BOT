import React, { useState, useEffect } from 'react';
import { Home, Sparkles, Flame, Droplets, CheckCircle2, ArrowRight, Leaf, ShieldCheck, Apple, Award, RefreshCw } from 'lucide-react';
import { getTodayWorkout } from '../services/api';
import { getSessionEmail, getWater, setWater, isTodayComplete, toggleTodayComplete, getStreak } from '../services/localStore';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Dashboard({ userProfile, setUserProfile, plan, onRegenerate, regenerating, setActiveTab, onAskAI, setExerciseModal }) {
  const [fetchedWorkout, setFetchedWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = getSessionEmail();
  const [waterCups, setWaterCups] = useState(() => getWater(email));
  const [completedToday, setCompletedToday] = useState(() => isTodayComplete(email));
  const [streak, setStreak] = useState(() => getStreak(email));

  // Today's workout comes from the user's AI plan when present; the generic
  // getTodayWorkout() fetch is only a fallback for accounts without a plan.
  const todayName = DAYS[(new Date().getDay() + 6) % 7];
  const workoutPlan = plan?.workoutPlan || null;
  const todayWorkout = workoutPlan
    ? { day: todayName, workout: workoutPlan.schedule?.[todayName] || {} }
    : fetchedWorkout;

  useEffect(() => {
    setWater(email, waterCups);
  }, [email, waterCups]);

  const isHome = true;

  useEffect(() => {
    if (workoutPlan) {
      setLoading(false);
      return;
    }
    async function loadData() {
      try {
        setLoading(true);
        const data = await getTodayWorkout(userProfile?.goal, userProfile?.workoutLocation);
        setFetchedWorkout(data);
      } catch (err) {
        console.error('Failed to load today workout', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [workoutPlan, userProfile?.goal, userProfile?.workoutLocation]);

  const quickPrompts = [
    { label: "Today's Routine", icon: Home, tab: 'workout' },
    { label: "Natural Protein Diet", icon: Apple, query: "Give me a high protein whole food vegetarian diet without supplements." }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Welcome & Environment Selector */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
              {userProfile?.fitnessGoal || 'Build Muscle'} · {userProfile?.exercisePreference || 'Home Bodyweight'} · BMI {userProfile?.bmi ?? '--'} ({userProfile?.bmiCategory || 'Unknown'})
            </div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-800 tracking-tight">
              Welcome back, <span className="text-emerald-600">{userProfile?.name || 'Athlete'}</span>! 💪
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Home workouts are strictly 100% equipment-free bodyweight.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                disabled={regenerating}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-700 font-bold text-sm flex items-center gap-2 transition-all active:scale-95 disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
                <span>{regenerating ? 'Generating…' : 'Regenerate Plan'}</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('aicoach')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chat with AI Coach</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 flex items-start gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 bg-emerald-500 text-white">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-base text-slate-800">Home Workout Only</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              100% bodyweight only. No dumbbells, barbells, cable machines, or equipment-based splits are used anywhere in the platform.
            </p>
          </div>
        </div>
      </div>

      {/* Natural Nutrition Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-slate-800 flex items-center gap-2">
              100% Natural Whole-Food Nutrition <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Paneer, Tofu, Soya, Sprouts, Lentils, Curd — <strong className="text-slate-700">Zero artificial powder supplements!</strong>
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('diet')}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 shadow-sm"
        >
          <span>Natural Diet Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick AI Chips */}
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => (item.tab ? setActiveTab(item.tab) : onAskAI(item.query))}
                className="bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 p-3.5 rounded-2xl text-left transition-all group flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform border border-emerald-100">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 group-hover:text-emerald-700 transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Today's Workout + Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Workout */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                {todayWorkout?.day || 'Today'} · Home Bodyweight
              </span>
              <h3 className="font-heading font-bold text-xl text-slate-800 mt-0.5">
                Focus: {todayWorkout?.workout?.focus || 'Upper Body'}
              </h3>
            </div>
            <button
              onClick={() => {
                const nowComplete = toggleTodayComplete(email);
                setCompletedToday(nowComplete);
                setStreak(getStreak(email));
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs transition-all ${
                completedToday
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completedToday ? 'Completed! ✓' : 'Mark Completed'}</span>
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading today's routine...</div>
          ) : todayWorkout?.workout?.isRest ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-100">
              <Award className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800 text-lg">Rest & Recovery Day</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Drink plenty of water and fuel recovery with whole-food vegetarian proteins!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayWorkout?.workout?.exercises?.map((ex, idx) => (
                <div
                  key={idx}
                  onClick={() => setExerciseModal && setExerciseModal(ex)}
                  className="bg-slate-50 hover:bg-emerald-50 p-4 rounded-2xl border border-slate-200 hover:border-emerald-200 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center border border-emerald-200">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{ex.name}</h4>
                      <p className="text-xs text-slate-400">
                        Target: <span className="text-slate-600">{ex.muscle}</span> · {ex.sets} sets × {ex.reps} reps
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    Details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 text-right">
            <button onClick={() => setActiveTab('workout')} className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1">
              Full weekly routine <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Water + Tips */}
        <div className="space-y-5">
          {/* Water Intake */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-cyan-500" />
                <h4 className="font-heading font-bold text-slate-800 text-base">Water Tracker</h4>
              </div>
              <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                {(waterCups * 0.25).toFixed(2)}L / 3.5L
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-gradient-to-r from-cyan-400 to-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (waterCups / 14) * 100)}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">{waterCups} cups logged</span>
              <div className="flex gap-1.5">
                <button onClick={() => setWaterCups(prev => Math.max(0, prev - 1))} className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600 border border-slate-200">-</button>
                <button onClick={() => setWaterCups(prev => prev + 1)} className="px-3 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-bold border border-cyan-200">+ 250ml</button>
              </div>
            </div>
          </div>

          {/* Nutrition Tip */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5 rounded-3xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs">
              <Leaf className="w-4 h-4" /> Natural Nutrition Tip
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed italic">
              "Combining lentils, paneer, and Greek yogurt gives you a complete amino acid profile — no protein powder needed!"
            </p>
          </div>

          {/* Streak card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center border border-amber-200">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Current Streak</span>
              <span className="font-heading font-extrabold text-xl text-slate-800">{streak} {streak === 1 ? 'Day' : 'Days'} Active 🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
