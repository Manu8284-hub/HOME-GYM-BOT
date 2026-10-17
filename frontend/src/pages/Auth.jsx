import React, { useState, useEffect, useRef } from 'react';
import { LockKeyhole, Mail, User, Sparkles, ArrowRight, Zap, Dumbbell, Flame } from 'lucide-react';
import { loginUser, signupUser } from '../services/api';
// TODO: connect backend — POST /api/auth/login
// TODO: connect backend — POST /api/auth/register

const FEATURES = [
  { icon: Dumbbell, title: 'AI-Powered Workouts',  text: 'Plans built for your body, goals, and home setup.' },
  { icon: Sparkles, title: 'Your AI Coach',          text: 'Streaming answers to every fitness question.' },
  { icon: Flame,    title: 'Streak & Gamification',  text: 'XP, badges, and Beast Mode to keep you locked in.' },
];

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 400, y: Math.random() * 700,
      r: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.15,
    }));
    const loop = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(198,241,53,${p.a})`; ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
}

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const switchMode = (next) => { setMode(next); setError(''); setPassword(''); setConfirm(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const cleanEmail = email.trim();
    if (!cleanEmail || !password.trim()) { setError('Enter your email and password.'); return; }

    setLoading(true);
    try {
      if (isSignup) {
        if (password !== confirm) { setError('Passwords do not match.'); setLoading(false); return; }
        // TODO: connect backend — POST /api/auth/register
        const result = await signupUser({ name, email: cleanEmail, password });
        if (!result.ok) { setError(result.error || 'Signup failed.'); setLoading(false); return; }
        onAuthed({ email: result.user.email, name: result.user.name, isNew: true });
        return;
      }
      // TODO: connect backend — POST /api/auth/login
      const result = await loginUser({ email: cleanEmail, password });
      if (!result.ok) { setError(result.error || 'Login failed.'); setLoading(false); return; }
      localStorage.setItem('fitbot:authToken', result.token);
      onAuthed({ email: result.user.email, name: result.user.name, isNew: false });
    } catch (err) {
      setError(err?.error || err?.message || 'Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden" style={{ background: '#080808' }}>

      {/* ---- Left brand panel (desktop) ---- */}
      <div className="hidden lg:flex relative flex-col w-[48%] overflow-hidden" style={{ background: '#0C0C0C', borderRight: '1px solid #1a1a1a' }}>
        <ParticleCanvas />
        {/* Volt radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse 70% 60% at 30% 60%, rgba(198,241,53,0.06) 0%, transparent 70%)'
        }} />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#C6F135', boxShadow: '0 0 16px rgba(198,241,53,0.4)' }}>
              <Zap className="w-5 h-5 fill-current" style={{ color: '#080808' }} />
            </div>
            <span className="font-bold tracking-tight" style={{ color: '#F5F5F5' }}>FitBot AI</span>
          </div>

          {/* Headline */}
          <div>
            <div className="chip-volt mb-6 inline-flex">AI Power Mode Active</div>
            <h1 className="font-display text-[80px] leading-[0.95] mb-6" style={{ color: '#F5F5F5' }}>
              TRAIN<br />
              <span style={{ color: '#C6F135' }}>SMARTER.</span><br />
              HARDER.
            </h1>
            <p className="text-sm leading-relaxed max-w-sm mb-10" style={{ color: '#666' }}>
              Equipment-free home workouts · Whole-food nutrition · Streaming AI coaching that adapts to your body.
            </p>
            <div className="space-y-4">
              {FEATURES.map(f => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(198,241,53,0.1)', border: '1px solid rgba(198,241,53,0.2)' }}>
                      <Icon className="w-4 h-4" style={{ color: '#C6F135' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>{f.title}</p>
                      <p className="text-xs" style={{ color: '#666' }}>{f.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Right form panel ---- */}
      <div className="flex-1 overflow-y-auto flex items-center justify-center px-6 sm:px-10 py-8"
        style={{ background: '#080808' }}>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#C6F135' }}>
              <Zap className="w-5 h-5 fill-current" style={{ color: '#080808' }} />
            </div>
            <span className="font-bold" style={{ color: '#F5F5F5' }}>FitBot AI</span>
          </div>

          {/* Mode toggle */}
          <div className="p-1 rounded-2xl mb-8 grid grid-cols-2 gap-1"
            style={{ background: '#111', border: '1px solid #1a1a1a' }}>
            {['signin', 'signup'].map(m => (
              <button key={m} onClick={() => switchMode(m)}
                className="py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: mode === m ? '#C6F135' : 'transparent',
                  color: mode === m ? '#080808' : '#666',
                }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <h2 className="font-display text-5xl mb-2" style={{ color: '#F5F5F5' }}>
            {isSignup ? 'JOIN THE\nGRIND' : 'WELCOME\nBACK'}
          </h2>
          <p className="text-sm mb-8" style={{ color: '#666' }}>
            {isSignup
              ? 'Create your account and start training smarter.'
              : 'Log in to access your personalized plan.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#888' }}>Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#555' }} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="neon-input pl-10" placeholder="Your name" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: '#888' }}>Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#555' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="neon-input pl-10" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold block mb-1.5" style={{ color: '#888' }}>Password</label>
              <div className="relative">
                <LockKeyhole className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#555' }} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="neon-input pl-10" placeholder="Enter your password" />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: '#888' }}>Confirm Password</label>
                <div className="relative">
                  <LockKeyhole className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: '#555' }} />
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    className="neon-input pl-10" placeholder="Re-enter your password" />
                </div>
              </div>
            )}

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,23,68,0.1)', border: '1px solid rgba(255,23,68,0.25)', color: '#FF1744' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-volt w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ borderRadius: '0.875rem', animationName: 'none' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[#080808]/40 border-t-[#080808] rounded-full animate-spin" />
                  Processing…
                </span>
              ) : (
                <>
                  {isSignup ? 'Create Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] mt-6 leading-relaxed" style={{ color: '#444' }}>
            Accounts are stored locally in this browser — this is a personal fitness tracker, not a secure system.
          </p>
        </div>
      </div>
    </div>
  );
}
