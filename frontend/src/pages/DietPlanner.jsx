import React, { useState, useEffect } from 'react';
import { Utensils, Flame, Apple, Coffee, Sun, Zap, Award, Moon, Droplets, Leaf, Bot, CheckCircle2 } from 'lucide-react';
import { getDietPlan } from '../services/api';

const DIET_TYPES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'];

export default function DietPlanner({ userProfile, plan, onAskAI }) {
  const userPlanDiet = plan?.dietPlan || null;
  const ownPreference = userPlanDiet?.preference || userProfile?.dietaryPreference || 'Vegetarian';

  const [activePreference, setActivePreference] = useState(ownPreference);
  const [fetchedDiet, setFetchedDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const fitnessGoal = userProfile?.fitnessGoal || 'Build Muscle';

  // Show the user's own AI plan for their preference; fetch a generic plan
  // only when they browse a different diet type.
  const usingPersonalized = Boolean(userPlanDiet) && activePreference === ownPreference;
  const dietData = usingPersonalized ? userPlanDiet : fetchedDiet;

  useEffect(() => {
    if (usingPersonalized) {
      setLoading(false);
      return;
    }
    async function loadDiet() {
      try {
        setLoading(true);
        const data = await getDietPlan(activePreference);
        setFetchedDiet(data);
      } catch (err) {
        console.error('Error fetching diet plan', err);
      } finally {
        setLoading(false);
      }
    }
    loadDiet();
  }, [activePreference, usingPersonalized]);

  const mealWindows = [
    { key: 'breakfast', label: 'Breakfast', time: '8:00 AM', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { key: 'midMorning', label: 'Mid-Morning', time: '11:00 AM', icon: Sun, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-200' },
    { key: 'lunch', label: 'Balanced Lunch', time: '1:30 PM', icon: Utensils, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { key: 'preWorkout', label: 'Pre-Workout', time: '4:30 PM', icon: Zap, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { key: 'postWorkout', label: 'Post-Workout', time: '7:00 PM', icon: Award, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
    { key: 'dinner', label: 'Dinner', time: '9:00 PM', icon: Moon, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1">
            <Leaf className="w-3.5 h-3.5" /> {usingPersonalized ? 'Your AI meal plan' : `Browsing ${activePreference} plan`}
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-800">Natural Meal Planner · {fitnessGoal}</h2>
          <p className="text-xs text-slate-400 mt-1">
            Target: <strong className="text-slate-600">{dietData?.calories || '2,200 kcal'}</strong> · <strong className="text-emerald-600">{dietData?.proteinTarget || '130g'} natural protein</strong>
            <span className="block mt-1 text-emerald-700 font-medium">BMI: {userProfile?.bmi ?? '--'} ({userProfile?.bmiCategory || 'Unknown'})</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 bg-slate-100 border border-slate-200 p-1.5 rounded-2xl">
          {DIET_TYPES.map((pref) => (
            <button
              key={pref}
              onClick={() => setActivePreference(pref)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activePreference === pref ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      {/* Zero-Supplement Banner */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <p className="text-sm text-slate-700 leading-snug">
            <strong className="text-emerald-700">100% Whole Food Pledge:</strong> {dietData?.philosophy || "Zero artificial supplements. Real food only."}
          </p>
        </div>
        <button
          onClick={() => onAskAI(`Customized ${activePreference} natural meal plan for ${fitnessGoal.toLowerCase()} based on BMI ${userProfile?.bmi ?? 'unknown'} and exercise style ${userProfile?.exercisePreference || 'mixed training'}.`)}
          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shrink-0 text-xs transition-all flex items-center gap-1 shadow-sm"
        >
          <Bot className="w-3.5 h-3.5" /> AI Nutritionist
        </button>
      </div>

      {/* 6 Meal Windows */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">Loading meal plan...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mealWindows.map((mw) => {
            const Icon = mw.icon;
            const mealInfo = dietData?.meals?.[mw.key] || {};
            return (
              <div key={mw.key} className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl ${mw.bg} ${mw.color} flex items-center justify-center border`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-heading font-bold text-base text-slate-800">{mw.label}</h4>
                        <span className="text-[11px] text-slate-400">{mw.time}</span>
                      </div>
                    </div>
                  </div>
                  <h5 className="font-semibold text-emerald-700 text-sm mb-2">{mealInfo.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">{mealInfo.options}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                  <span className="font-semibold text-slate-700">{mealInfo.calories}</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">{mealInfo.protein}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Key Food Sources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {[
          { title: 'Natural Protein Sources', icon: Apple, color: 'text-emerald-600', items: dietData?.keySources?.protein, dot: 'bg-emerald-500' },
          { title: 'Healthy Carbohydrates', icon: Flame, color: 'text-amber-600', items: dietData?.keySources?.carbs, dot: 'bg-amber-500' },
          { title: 'Fats & Hydration', icon: Droplets, color: 'text-cyan-600', items: dietData?.keySources?.fats, dot: 'bg-cyan-500' }
        ].map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className={`flex items-center gap-2 ${section.color} font-bold text-sm`}>
                <Icon className="w-4 h-4" /> {section.title}
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {section.items?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className={`w-1.5 h-1.5 rounded-full ${section.dot} shrink-0`}></span>
                    <span>{item}</span>
                  </li>
                ))}
                {i === 2 && (
                  <li className="flex items-center gap-2 bg-cyan-50 p-2 rounded-xl border border-cyan-200 text-cyan-700 font-medium">
                    <Droplets className="w-3.5 h-3.5 text-cyan-500 shrink-0" /> Drink 3.5L – 4.0L water daily
                  </li>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
