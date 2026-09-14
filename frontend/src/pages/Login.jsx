import React, { useState } from 'react';
import { LockKeyhole, Mail, Sparkles, ArrowRight } from 'lucide-react';

const WELCOME_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoSOqmwaZadtZohybIIJFL0PNQ2kp_Dp_ucCoRLEIqqlHwx327X7ct7IA&s=10';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password to continue.');
      return;
    }

    setError('');
    onLogin({ email: email.trim() });
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[680px]">
          <img src={WELCOME_IMAGE} alt="FitBot login welcome" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-slate-950/10"></div>
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold mb-3 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" /> FitBot AI
            </div>
            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl leading-tight max-w-lg">
              Sign in to your fitness home.
            </h1>
            <p className="text-sm sm:text-base text-white/80 mt-3 max-w-lg">
              Your workout plan, diet plan, BMI tracking, and AI coach all stay in one place.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold w-fit mb-4">
            <LockKeyhole className="w-3.5 h-3.5" /> Secure Session Login
          </div>
          <h2 className="font-heading font-extrabold text-3xl text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500 mt-2 max-w-md">Log in to continue to your home screen, dashboard, workout plan, and diet plan.</p>

          <form onSubmit={handleSubmit} className="space-y-4 mt-8">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
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
                  className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl p-3">
                {error}
              </div>
            )}

            <button type="submit" className="w-full px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}