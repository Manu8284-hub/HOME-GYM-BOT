import React from 'react';
import { ArrowRight, Sparkles, Activity, ChefHat, Dumbbell, Scale, Zap } from 'lucide-react';

const WELCOME_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoSOqmwaZadtZohybIIJFL0PNQ2kp_Dp_ucCoRLEIqqlHwx327X7ct7IA&s=10';

export default function Home({ userProfile, setActiveTab, onAskAI }) {
  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[520px]">
            <img src={WELCOME_IMAGE} alt="FitBot welcome" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-slate-950/10"></div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5" /> Welcome Back
              </div>
              <h1 className="font-heading font-extrabold text-3xl sm:text-5xl leading-tight max-w-xl">
                Your fitness home starts here.
              </h1>
              <p className="text-sm sm:text-base text-white/80 mt-3 max-w-lg">
                Build muscle, gain mass, lose weight, or train smarter. FitBot organizes your workout and diet plan around your goal, BMI, and exercise style.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-white to-emerald-50/40 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                <Activity className="w-3.5 h-3.5" /> Personalized from your profile
              </div>
              <div>
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">{userProfile?.name || 'Athlete'}, your plan is ready to explore</h2>
                <p className="text-slate-500 text-sm mt-2 max-w-md">
                  Goal: {userProfile?.fitnessGoal || 'Build Muscle'} · Style: {userProfile?.exercisePreference || 'Home Bodyweight'} · BMI: {userProfile?.bmi ?? '--'} ({userProfile?.bmiCategory || 'Unknown'})
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Scale className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-xs uppercase tracking-wider text-slate-400">BMI</p>
                  <p className="font-bold text-lg text-slate-800">{userProfile?.bmi ?? '--'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <Dumbbell className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-xs uppercase tracking-wider text-slate-400">Training</p>
                  <p className="font-bold text-lg text-slate-800">{userProfile?.exercisePreference || 'Home Bodyweight'}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <ChefHat className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-xs uppercase tracking-wider text-slate-400">Nutrition</p>
                  <p className="font-bold text-lg text-slate-800">Whole Food</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={() => setActiveTab('dashboard')} className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => setActiveTab('workout')} className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
                View Workout Plan
              </button>
              <button onClick={() => setActiveTab('diet')} className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">
                View Diet Plan
              </button>
              <button onClick={() => onAskAI('Design a weekly plan based on my profile, BMI, and goal.')} className="px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm shadow-sm hover:bg-slate-800 transition-all">
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'Goal-first planning', text: 'Workout and diet are organized from the goal you entered.', icon: Zap },
          { title: 'BMI-aware guidance', text: 'BMI is calculated from height and weight and used in the AI plan.', icon: Scale },
          { title: 'Natural nutrition', text: 'The diet flow stays focused on whole foods and practical meals.', icon: ChefHat }
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">{card.title}</h3>
              <p className="text-sm text-slate-500">{card.text}</p>
            </div>
          );
        })}
      </section>
    </div>
  );
}