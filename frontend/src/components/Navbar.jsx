import React from 'react';
import { Sparkles, Home, Leaf, LogOut } from 'lucide-react';

export default function Navbar({ activeTab, userProfile, setUserProfile, onQuickChat, onLogout }) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Fitness Dashboard';
      case 'workout': return 'Weekly Workout Planner';
      case 'diet': return 'Natural Diet & Nutrition';
      case 'exercises': return 'Exercise Library';
      case 'aicoach': return 'AI Coach Assistant';
      case 'progress': return 'Progress Tracker';
      case 'profile': return 'Fitness Profile';
      default: return 'FitBot AI';
    }
  };

  const isHome = true;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Page Title */}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading font-bold text-xl sm:text-2xl text-slate-800 tracking-tight">
              {getTitle()}
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <Leaf className="w-3 h-3" /> Natural Foods
            </span>
          </div>
          <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
            Mode: <strong className="text-emerald-600">🏠 Home (Equipment-Free)</strong>
          </p>
        </div>

        {/* Right: Switcher & AI Button */}
        <div className="flex items-center gap-2.5">
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-emerald-700 text-xs font-bold">
            <Home className="w-3.5 h-3.5" />
            <span>Home Only</span>
          </div>

          {/* AI Coach Button */}
          <button
            onClick={onQuickChat}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-500/25 active:scale-95"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">Ask AI Coach</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all border border-slate-200 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
