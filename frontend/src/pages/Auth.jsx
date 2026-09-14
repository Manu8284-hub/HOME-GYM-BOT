import React, { useState } from 'react';
import { LockKeyhole, Mail, User, Sparkles, ArrowRight, ShieldAlert, Home, Leaf, Bot, Zap } from 'lucide-react';
import { loginUser, signupUser } from '../services/api';

const DOT_PATTERN = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1px)',
  backgroundSize: '22px 22px'
};

const FEATURES = [
  { icon: Home, title: '100% bodyweight', text: 'Home workouts with no equipment — ever.' },
  { icon: Leaf, title: 'Whole-food nutrition', text: 'Natural protein sources, zero powder supplements.' },
  { icon: Bot, title: 'AI coach', text: 'Guidance that adapts to your BMI and goals.' }
];

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setPassword('');
    setConfirm('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !password.trim()) {
      setError('Enter your email and password to continue.');
      return;
    }

    try {
      if (isSignup) {
        if (password !== confirm) {
          setError('Passwords do not match.');
          return;
        }

        const result = await signupUser({ name, email: cleanEmail, password });
        if (!result.ok) {
          setError(result.error || 'Signup failed.');
          return;
        }

        onAuthed({ email: result.user.email, name: result.user.name, isNew: true });
        return;
      }

      const result = await loginUser({ email: cleanEmail, password });
      if (!result.ok) {
        setError(result.error || 'Login failed.');
        return;
      }

      localStorage.setItem('fitbot:authToken', result.token);
      onAuthed({ email: result.user.email, name: result.user.name, isNew: false });
    } catch (err) {
      setError(err?.error || err?.message || 'Something went wrong. Please try again.');
    }
  };

  const inputClass =
    'w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition-all';

  return (
    <div className="h-screen w-full flex bg-slate-900 overflow-hidden">
      {/* Brand panel — full-height, monochrome, no imagery (desktop only) */}
      <div className="hidden lg:flex relative w-1/2 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0" style={DOT_PATTERN} />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative h-full w-full flex flex-col justify-between p-12 xl:p-16">
          {/* Brand mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-slate-900 fill-slate-900" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">FitBot AI</span>
          </div>

          {/* Headline + features */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> Home Workouts · Natural Nutrition
            </div>
            <h1 className="font-heading font-extrabold text-4xl xl:text-5xl leading-[1.05] max-w-md">
              Your equipment-free fitness home.
            </h1>
            <p className="text-sm text-white/60 mt-4 max-w-sm leading-relaxed">
              Log in to see today's home workout instantly, and track your streak, water, and progress.
            </p>

            <div className="mt-9 space-y-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold leading-tight">{f.title}</p>
                      <p className="text-xs text-white/50 leading-snug mt-0.5">{f.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Form panel — full-height, scrolls internally only if needed */}
      <div className="flex-1 bg-white overflow-y-auto">
        <div className="min-h-full flex items-center justify-center px-6 sm:px-10 py-8">
          <div className="w-full max-w-md">
            {/* Mobile brand mark */}
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-slate-900">FitBot AI</span>
            </div>

            {/* Mode toggle */}
            <div className="bg-slate-100 border border-slate-200 p-1.5 rounded-2xl grid grid-cols-2 gap-1.5 mb-6">
              <button
                type="button"
                onClick={() => switchMode('signin')}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                  !isSignup ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                  isSignup ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign Up
              </button>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold w-fit mb-4">
              <LockKeyhole className="w-3.5 h-3.5" /> {isSignup ? 'Create your account' : 'Welcome back'}
            </div>
            <h2 className="font-heading font-extrabold text-3xl text-slate-900">
              {isSignup ? 'Start training at home' : 'Sign in to continue'}
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              {isSignup
                ? 'Set up your account, build your profile, and jump straight into today’s workout.'
                : 'Log in to land on your dashboard with today’s workout and your saved progress.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
              {isSignup && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                      placeholder="Your name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1.5">Password</label>
                <div className="relative">
                  <LockKeyhole className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              {isSignup && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <LockKeyhole className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className={inputClass}
                      placeholder="Re-enter your password"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl p-3">
                  {error}
                </div>
              )}

              <button type="submit" className="w-full px-5 py-3 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-sm shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 active:scale-[0.99]">
                {isSignup ? 'Create Account' : 'Sign In'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[11px] text-slate-400 mt-5 flex items-start gap-1.5 leading-relaxed">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
              Accounts are stored locally in this browser only — this is a personal tracker, not a secure login.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
