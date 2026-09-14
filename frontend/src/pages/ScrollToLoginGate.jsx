import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import Login from './Login';

const WELCOME_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoSOqmwaZadtZohybIIJFL0PNQ2kp_Dp_ucCoRLEIqqlHwx327X7ct7IA&s=10';

export default function ScrollToLoginGate({ onLogin }) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const nextProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      setScrollProgress(nextProgress);
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  const imageStyle = useMemo(() => ({
    transform: `scale(${1 + scrollProgress * 0.14}) translateY(${scrollProgress * -4}%)`,
    opacity: 1 - scrollProgress * 0.9,
    filter: `blur(${scrollProgress * 6}px)`,
  }), [scrollProgress]);

  const loginStyle = useMemo(() => ({
    opacity: Math.min(Math.max((scrollProgress - 0.18) / 0.72, 0), 1),
    transform: `translateY(${(1 - scrollProgress) * 24}px) scale(${0.9 + scrollProgress * 0.1})`,
    pointerEvents: scrollProgress > 0.58 ? 'auto' : 'none',
  }), [scrollProgress]);

  return (
    <div className="relative min-h-[220vh] bg-slate-950 text-white overflow-hidden">
      <div className="sticky top-0 h-screen transition-transform duration-200 ease-out will-change-transform" style={imageStyle}>
        <img src={WELCOME_IMAGE} alt="FitBot welcome" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/88 via-slate-950/40 to-slate-950/12" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> Full screen welcome
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl leading-tight">
              Scroll once to open your login screen.
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-xl">
              The image fills the whole screen first, then the login page zooms in as you scroll down.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/70">
              <ChevronDown className="w-4 h-4 animate-bounce" /> Scroll to continue
            </div>
          </div>
        </div>
      </div>

      <div
        className="sticky top-0 flex h-screen items-center justify-center px-4 sm:px-6 transition-all duration-200 ease-out will-change-transform"
        style={loginStyle}
      >
        <div className="w-full max-w-5xl">
          <Login onLogin={onLogin} />
        </div>
      </div>
    </div>
  );
}