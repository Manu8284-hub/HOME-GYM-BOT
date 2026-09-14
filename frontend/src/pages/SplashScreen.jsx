import React from 'react';
import { Zap } from 'lucide-react';

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
  backgroundSize: '24px 24px'
};

export default function SplashScreen() {
  return (
    <div className="min-h-screen boot-splash text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle dot texture + soft glows */}
      <div className="absolute inset-0 pointer-events-none" style={DOT_PATTERN} />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Logo mark with pulsing ring */}
        <div className="relative mb-7">
          <span className="absolute inset-0 rounded-3xl bg-white/20 animate-ping" />
          <div className="relative w-20 h-20 rounded-3xl bg-white flex items-center justify-center shadow-2xl">
            <Zap className="w-10 h-10 text-slate-900 fill-slate-900" />
          </div>
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl tracking-tight">
          FitBot AI
        </h1>
        <p className="text-sm text-white/60 mt-2.5 leading-relaxed max-w-xs">
          Preparing your fitness home — today's workout, natural diet, and BMI-aware AI coach.
        </p>

        {/* Indeterminate progress bar */}
        <div className="w-full max-w-[240px] mt-8 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="loader-bar h-full w-1/3 rounded-full bg-white" />
        </div>

        <p className="text-[11px] uppercase tracking-[0.35em] text-white/40 font-semibold mt-5">
          Loading your dashboard
        </p>
      </div>
    </div>
  );
}
