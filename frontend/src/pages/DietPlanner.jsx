import React, { useState, useEffect } from 'react';
import {
  Utensils,
  Flame,
  Apple,
  Coffee,
  Sun,
  Zap,
  Award,
  Moon,
  Droplets,
  Leaf,
  Bot,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { getDietPlan } from '../services/api';
import {
  getSessionEmail,
  getMealProgress,
  toggleMeal,
} from '../services/localStore';

const DIET_TYPES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Eggetarian'];

export default function DietPlanner({ userProfile, plan, onAskAI }) {
  const userPlanDiet = plan?.dietPlan || null;
  const ownPreference =
    userPlanDiet?.preference || userProfile?.dietaryPreference || 'Vegetarian';

  const [activePreference, setActivePreference] = useState(ownPreference);
  const [fetchedDiet, setFetchedDiet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState(() =>
    getMealProgress(getSessionEmail())
  );
  const fitnessGoal = userProfile?.fitnessGoal || 'Build Muscle';

  const usingPersonalized =
    Boolean(userPlanDiet) && activePreference === ownPreference;
  const dietData = usingPersonalized ? userPlanDiet : fetchedDiet;

  useEffect(() => {
    setCompletedMeals(getMealProgress(getSessionEmail()));
  }, [activePreference]);

  const handleMealToggle = (mealKey) => {
    const nextValue = toggleMeal(getSessionEmail(), undefined, mealKey);
    setCompletedMeals((prev) => ({ ...prev, [mealKey]: nextValue }));
  };

  const completedMealCount = Object.values(completedMeals).filter(Boolean).length;

  useEffect(() => {
    if (usingPersonalized) {
      setLoading(false);
      return;
    }
    async function loadDiet() {
      try {
        setLoading(true);
        // TODO: connect backend — GET /diet/plan?preference=${activePreference}
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
    {
      key: 'breakfast',
      label: 'Breakfast',
      time: '08:00 AM',
      icon: Coffee,
      color: 'text-amber-400',
      bg: 'border-amber-400/30 bg-amber-400/10',
    },
    {
      key: 'midMorning',
      label: 'Mid-Morning Fuel',
      time: '11:00 AM',
      icon: Sun,
      color: 'text-volt-lime',
      bg: 'border-volt-lime/30 bg-volt-lime/10',
    },
    {
      key: 'lunch',
      label: 'Power Lunch',
      time: '01:30 PM',
      icon: Utensils,
      color: 'text-cyan-neon',
      bg: 'border-cyan-neon/30 bg-cyan-neon/10',
    },
    {
      key: 'preWorkout',
      label: 'Pre-Workout Ignition',
      time: '04:30 PM',
      icon: Zap,
      color: 'text-volt-lime',
      bg: 'border-volt-lime/30 bg-volt-lime/10',
    },
    {
      key: 'postWorkout',
      label: 'Post-Workout Synthesis',
      time: '07:00 PM',
      icon: Award,
      color: 'text-cyan-neon',
      bg: 'border-cyan-neon/30 bg-cyan-neon/10',
    },
    {
      key: 'dinner',
      label: 'Anabolic Night Fuel',
      time: '09:00 PM',
      icon: Moon,
      color: 'text-indigo-400',
      bg: 'border-indigo-400/30 bg-indigo-400/10',
    },
  ];

  return (
    <div className="space-y-8 pb-24 lg:pb-12 text-[#F5F5F5]">

      {/* =========================================================
          HEADER & MACRO TARGET
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[#222] bg-[#101010] p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-volt-lime/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-volt-lime/40 bg-volt-lime/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-volt-lime uppercase">
                <Leaf className="w-3.5 h-3.5" />
                {usingPersonalized ? 'AI CUSTOMIZED MACROS' : `${activePreference.toUpperCase()} REGIMEN`}
              </span>
              <span className="rounded-full border border-[#333] bg-[#161616] px-3 py-1 font-mono text-[11px] text-[#888] uppercase">
                {fitnessGoal}
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white">
              WHOLE FOOD NUTRITION
            </h2>

            <p className="mt-1 font-sans text-xs sm:text-sm text-[#888] max-w-xl">
              Target: <strong className="text-volt-lime font-mono">{dietData?.calories || '2,400 KCAL'}</strong> · <strong className="text-cyan-neon font-mono">{dietData?.proteinTarget || '145G'} NATURAL PROTEIN</strong>
            </p>
          </div>

          {/* Preference Switcher */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#262626] bg-[#141414] p-1.5">
            {DIET_TYPES.map((pref) => (
              <button
                key={pref}
                onClick={() => setActivePreference(pref)}
                className={`rounded-xl px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition ${
                  activePreference === pref
                    ? 'bg-volt-lime text-black shadow-[0_0_12px_rgba(198,241,53,0.35)]'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          WHOLE FOOD PLEDGE BANNER
      ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-volt-lime/30 bg-gradient-to-r from-volt-lime/10 via-[#12160d] to-[#0c0c0c] p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-volt-lime shrink-0" />
          <p className="font-sans text-xs sm:text-sm text-[#ddd]">
            <strong className="text-volt-lime font-mono uppercase">100% WHOLE FOOD DISCIPLINE:</strong>{' '}
            {dietData?.philosophy || 'Zero artificial powders or processed fillers. Pure density from eggs, tofu, paneer, sprouts, lentils and greens.'}
          </p>
        </div>

        <button
          onClick={() =>
            onAskAI?.(
              `Generate a customized ${activePreference} meal plan for ${fitnessGoal.toLowerCase()} with high-density natural protein meals.`
            )
          }
          className="shrink-0 flex items-center gap-2 rounded-xl bg-volt-lime px-4 py-2.5 font-mono text-xs font-black uppercase tracking-wider text-black transition hover:bg-[#d8ff4f] shadow-[0_0_15px_rgba(198,241,53,0.3)]"
        >
          <Bot className="h-4 w-4 stroke-[2.5]" />
          <span>AI MACRO COACH</span>
        </button>
      </div>

      {/* =========================================================
          6 MEAL WINDOWS GRID
      ========================================================= */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-3xl bg-[#141414]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {mealWindows.map((mw) => {
            const Icon = mw.icon;
            const mealInfo = dietData?.meals?.[mw.key] || {};
            const isDone = Boolean(completedMeals[mw.key]);

            return (
              <div
                key={mw.key}
                className={`flex flex-col justify-between rounded-3xl border p-6 transition-all duration-300 ${
                  isDone
                    ? 'border-volt-lime/50 bg-[#12160e] shadow-[0_0_20px_rgba(198,241,53,0.1)]'
                    : 'border-[#222] bg-[#121212] hover:border-[#383838] hover:bg-[#151515]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-[#202020] pb-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${mw.bg} ${mw.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-lg uppercase tracking-wider text-white">
                          {mw.label}
                        </h4>
                        <span className="font-mono text-[10px] text-[#777]">{mw.time}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleMealToggle(mw.key)}
                      className={`rounded-xl px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition ${
                        isDone
                          ? 'bg-volt-lime text-black shadow-[0_0_10px_rgba(198,241,53,0.3)]'
                          : 'border border-[#2a2a2a] bg-[#181818] text-[#888] hover:border-volt-lime hover:text-white'
                      }`}
                    >
                      {isDone ? 'LOGGED ✓' : 'LOG MEAL'}
                    </button>
                  </div>

                  <h5 className="font-sans font-bold text-sm text-volt-lime mb-2">
                    {mealInfo.title || mw.label}
                  </h5>

                  <p className="font-sans text-xs leading-relaxed text-[#aaa] rounded-xl border border-[#1e1e1e] bg-[#0c0c0c] p-3">
                    {mealInfo.options || 'Whole food meal suggestion curated for protein synthesis.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between font-mono text-xs">
                  <span className="text-[#888]">{mealInfo.calories || '450 kcal'}</span>
                  <span className="rounded-full border border-volt-lime/30 bg-volt-lime/10 px-2.5 py-0.5 font-bold text-volt-lime">
                    {mealInfo.protein || '32g Protein'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================
          KEY FOOD SOURCES & HYDRATION RULES
      ========================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {[
          {
            title: 'NATURAL PROTEIN SOURCES',
            icon: Apple,
            color: 'text-volt-lime',
            items: dietData?.keySources?.protein || ['Paneer (cottage cheese)', 'Tofu & Edamame', 'Sprouted Moong & Chana', 'Lentil & Chickpea Curries', 'Greek Yogurt / Hung Curd'],
            dot: 'bg-volt-lime',
          },
          {
            title: 'COMPLEX ENERGY GLYCOGEN',
            icon: Flame,
            color: 'text-amber-400',
            items: dietData?.keySources?.carbs || ['Oats & Sweet Potatoes', 'Brown Rice & Quinoa', 'Millets (Ragi, Bajra)', 'Bananas & Berries', 'Whole Grain Rotis'],
            dot: 'bg-amber-400',
          },
          {
            title: 'HEALTHY LIPIDS & ELECTROLYTES',
            icon: Droplets,
            color: 'text-cyan-neon',
            items: dietData?.keySources?.fats || ['Almonds & Walnuts', 'Chia & Flax Seeds', 'Coconut Oil & Ghee', 'Avocado', 'Himalayan Pink Salt in Water'],
            dot: 'bg-cyan-neon',
          },
        ].map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="rounded-3xl border border-[#222] bg-[#101010] p-6 shadow-sm space-y-4">
              <div className={`flex items-center gap-2 font-display text-lg tracking-wider ${section.color}`}>
                <Icon className="h-5 w-5" /> {section.title}
              </div>
              <ul className="space-y-2.5 font-sans text-xs text-[#bbb]">
                {section.items?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 rounded-xl border border-[#1e1e1e] bg-[#141414] p-2.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${section.dot} shrink-0`} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

    </div>
  );
}
