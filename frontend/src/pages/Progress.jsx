import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
  Droplets,
  Calendar,
  Plus,
  CheckCircle2,
  Target,
  Activity,
  Award,
  Lock,
  Sparkles,
  Zap,
  ChevronRight,
} from 'lucide-react';
import {
  getSessionEmail,
  getWater,
  setWater,
  getStreak,
  getSessionsCount,
  getNotes,
  addNote,
} from '../services/localStore';
import {
  MOCK_ACHIEVEMENTS,
  MOCK_WEEKLY_HEATMAP,
  MOCK_PROGRESS_RINGS,
  XP_LEVEL,
} from '../data/mockData';
import { useCountUp } from '../hooks/useCountUp';

function parseKg(value) {
  const n = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
}

export default function Progress({ userProfile }) {
  const email = getSessionEmail();

  const currentWeight = parseKg(userProfile?.weight) ?? 74;
  const targetWeight = parseKg(userProfile?.targetWeight) ?? 78;

  const [waterCups, setWaterCups] = useState(() => getWater(email));
  const [streakDays] = useState(() => getStreak(email));
  const [sessions] = useState(() => getSessionsCount(email));
  const [notes, setNotes] = useState(() => getNotes(email));
  const [newNote, setNewNote] = useState('');
  const [activeConfetti, setActiveConfetti] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const animatedStreak = useCountUp(streakDays, 900);
  const animatedSessions = useCountUp(sessions || 14, 1100);

  useEffect(() => {
    setWater(email, waterCups);
  }, [email, waterCups]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes(addNote(email, newNote.trim()));
    setNewNote('');
  };

  const triggerBadgeCelebration = (badge) => {
    setSelectedBadge(badge);
    if (badge.unlocked) {
      setActiveConfetti(true);
      setTimeout(() => setActiveConfetti(false), 2500);
    }
  };

  // Ring 1 (Workout)
  const r1 = 68;
  const c1 = 2 * Math.PI * r1;
  const offset1 = c1 - (0.78 * c1);

  // Ring 2 (Hydration)
  const r2 = 52;
  const c2 = 2 * Math.PI * r2;
  const offset2 = c2 - (0.64 * c2);

  // Ring 3 (Weekly Target)
  const r3 = 36;
  const c3 = 2 * Math.PI * r3;
  const offset3 = c3 - (0.85 * c3);

  const xpPercent = Math.round((XP_LEVEL.currentXP / XP_LEVEL.nextLevelXP) * 100);

  return (
    <div className="space-y-8 pb-24 lg:pb-12 text-[#F5F5F5] relative">

      {/* Confetti effect when clicking an unlocked achievement */}
      {activeConfetti && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
          <div className="text-center bg-[#101010]/95 border border-volt-lime p-8 rounded-3xl shadow-[0_0_50px_rgba(198,241,53,0.5)] animate-bounce">
            <Sparkles className="h-12 w-12 text-volt-lime mx-auto mb-2 animate-spin" />
            <h3 className="font-display text-4xl text-volt-lime uppercase">ACHIEVEMENT UNLOCKED!</h3>
            <p className="font-mono text-sm text-white mt-1">{selectedBadge?.name}</p>
            <p className="font-mono text-xs text-cyan-neon mt-2">+{selectedBadge?.xp} XP ADDED TO PROFILE</p>
          </div>
        </div>
      )}

      {/* =========================================================
          HEADER & LEVEL-UP XP BAR
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[#222] bg-[#101010] p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-volt-lime/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-volt-lime/40 bg-volt-lime/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-volt-lime uppercase">
                <TrendingUp className="w-3.5 h-3.5" /> TELEMETRY & RECORDS
              </span>
              <span className="rounded-full border border-cyan-neon/40 bg-cyan-neon/10 px-3 py-1 font-mono text-[11px] font-bold text-cyan-neon uppercase">
                TIER: {XP_LEVEL.tier}
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white">
              ATHLETE EVOLUTION
            </h2>

            <p className="mt-1 font-sans text-xs sm:text-sm text-[#888] max-w-xl">
              Real-time biomechanical output, habit consistency, and milestones recorded on device.
            </p>
          </div>

          {/* XP Level Box */}
          <div className="rounded-2xl border border-[#262626] bg-[#141414] p-5 shrink-0 min-w-[280px]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-volt-lime uppercase">
                LEVEL {XP_LEVEL.level}
              </span>
              <span className="font-mono text-xs text-[#888]">
                {XP_LEVEL.currentXP} / {XP_LEVEL.nextLevelXP} XP
              </span>
            </div>
            {/* Cyber XP bar */}
            <div className="h-3 w-full rounded-full bg-[#202020] p-0.5 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-volt-lime to-cyan-neon transition-all duration-1000 shadow-[0_0_12px_#C6F135]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between font-mono text-[10px] text-[#666]">
              <span>PROGRESSION</span>
              <span className="text-volt-lime font-bold">{xpPercent}% TO LEVEL {XP_LEVEL.level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CONCENTRIC PROGRESS RINGS + KEY VITALS
      ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">

        {/* Concentric Multi-Metric Rings */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-[#222] bg-[#101010] p-6 text-center shadow-sm">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#888] mb-4">
            DAILY EQUILIBRIUM RINGS
          </span>

          <div className="relative flex items-center justify-center">
            <svg className="h-56 w-56 -rotate-90">
              {/* Outer Ring: Workout (Volt Lime) */}
              <circle cx="112" cy="112" r={r1} stroke="#1c1c1c" strokeWidth="10" fill="none" />
              <circle
                cx="112"
                cy="112"
                r={r1}
                stroke="#C6F135"
                strokeWidth="10"
                fill="none"
                strokeDasharray={c1}
                strokeDashoffset={offset1}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />

              {/* Middle Ring: Hydration (Cyan) */}
              <circle cx="112" cy="112" r={r2} stroke="#1c1c1c" strokeWidth="10" fill="none" />
              <circle
                cx="112"
                cy="112"
                r={r2}
                stroke="#00E5FF"
                strokeWidth="10"
                fill="none"
                strokeDasharray={c2}
                strokeDashoffset={offset2}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />

              {/* Inner Ring: Weekly Target (Orange/Red) */}
              <circle cx="112" cy="112" r={r3} stroke="#1c1c1c" strokeWidth="10" fill="none" />
              <circle
                cx="112"
                cy="112"
                r={r3}
                stroke="#FF6D00"
                strokeWidth="10"
                fill="none"
                strokeDasharray={c3}
                strokeDashoffset={offset3}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>

            <div className="absolute flex flex-col items-center pointer-events-none">
              <Flame className="h-6 w-6 text-volt-lime animate-pulse fill-volt-lime" />
              <span className="font-display text-3xl font-black text-white">78%</span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#777]">COMBINED</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-4 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-volt-lime shadow-[0_0_6px_#C6F135]" />
              <span className="text-[#ccc]">WORKOUT: 78%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-cyan-neon shadow-[0_0_6px_#00E5FF]" />
              <span className="text-[#ccc]">WATER: 64%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#FF6D00]" />
              <span className="text-[#ccc]">WEEK: 85%</span>
            </div>
          </div>
        </div>

        {/* 4 Neon Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-3xl border border-[#222] bg-[#101010] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-[#888]">SCALE MASS</span>
              <Activity className="h-5 w-5 text-volt-lime" />
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl text-white font-black">{currentWeight}</span>
              <span className="font-mono text-xs text-[#888]">KG</span>
            </div>
            <div className="font-mono text-xs text-volt-lime">
              TARGET: {targetWeight} KG
            </div>
          </div>

          <div className="rounded-3xl border border-[#222] bg-[#101010] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-[#888]">STREAK MOMENTUM</span>
              <Flame className="h-5 w-5 text-amber-400 fill-amber-400 animate-pulse" />
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl text-amber-400 font-black">{animatedStreak}</span>
              <span className="font-mono text-xs text-[#888]">DAYS</span>
            </div>
            <div className="font-mono text-xs text-[#888]">
              ACTIVE 🔥 UNBROKEN
            </div>
          </div>

          <div className="rounded-3xl border border-[#222] bg-[#101010] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-[#888]">TOTAL SESSIONS</span>
              <CheckCircle2 className="h-5 w-5 text-cyan-neon" />
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl text-cyan-neon font-black">{animatedSessions}</span>
              <span className="font-mono text-xs text-[#888]">LOGGED</span>
            </div>
            <div className="font-mono text-xs text-[#888]">
              DISCIPLINE VERIFIED
            </div>
          </div>

          <div className="rounded-3xl border border-[#222] bg-[#101010] p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-widest text-[#888]">HYDRATION</span>
              <Droplets className="h-5 w-5 text-cyan-neon" />
            </div>
            <div className="my-3 flex items-baseline gap-2">
              <span className="font-display text-4xl sm:text-5xl text-white font-black">{(waterCups * 0.25).toFixed(1)}</span>
              <span className="font-mono text-xs text-[#888]">/ 3.5L</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-[#888]">{waterCups} cups</span>
              <button
                onClick={() => setWaterCups((prev) => prev + 1)}
                className="rounded-lg bg-cyan-neon/15 px-2 py-0.5 font-mono text-[11px] font-bold text-cyan-neon hover:bg-cyan-neon/25 transition"
              >
                +250ml
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================
          DRAW-IN PROGRESS CHART & WEEKLY RADAR
      ========================================================= */}
      <div className="rounded-3xl border border-[#222] bg-[#101010] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-volt-lime">
              VOLUMETRIC TREND
            </span>
            <h3 className="mt-1 font-display text-2xl uppercase tracking-wider text-white">
              PERFORMANCE TRAJECTORY (LAST 6 WEEKS)
            </h3>
          </div>
          <span className="font-mono text-xs text-[#888]">OVERLOAD INDEX: +14.2%</span>
        </div>

        {/* Cyber SVG Line Chart */}
        <div className="mt-6 h-48 w-full relative">
          <svg className="h-full w-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C6F135" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#C6F135" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line x1="0" y1="40" x2="600" y2="40" stroke="#1f1f1f" strokeDasharray="4" />
            <line x1="0" y1="80" x2="600" y2="80" stroke="#1f1f1f" strokeDasharray="4" />
            <line x1="0" y1="120" x2="600" y2="120" stroke="#1f1f1f" strokeDasharray="4" />

            {/* Area */}
            <path
              d="M 0 140 Q 100 120 200 90 T 400 60 T 600 30 L 600 160 L 0 160 Z"
              fill="url(#chartGrad)"
            />

            {/* Glowing Line */}
            <path
              d="M 0 140 Q 100 120 200 90 T 400 60 T 600 30"
              fill="none"
              stroke="#C6F135"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="drop-shadow-[0_0_10px_#C6F135]"
            />

            {/* Data points */}
            {[
              { cx: 0, cy: 140, label: 'W1' },
              { cx: 120, cy: 110, label: 'W2' },
              { cx: 240, cy: 85, label: 'W3' },
              { cx: 360, cy: 65, label: 'W4' },
              { cx: 480, cy: 45, label: 'W5' },
              { cx: 600, cy: 30, label: 'W6' },
            ].map((pt, i) => (
              <circle
                key={i}
                cx={pt.cx}
                cy={pt.cy}
                r="5"
                fill="#000"
                stroke="#C6F135"
                strokeWidth="2.5"
                className="hover:scale-150 transition-transform"
              />
            ))}
          </svg>

          <div className="mt-4 flex justify-between font-mono text-[11px] text-[#777]">
            <span>WEEK 1</span>
            <span>WEEK 2</span>
            <span>WEEK 3</span>
            <span>WEEK 4</span>
            <span>WEEK 5</span>
            <span className="text-volt-lime font-bold">CURRENT (W6)</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          ACHIEVEMENT BADGES (TAP TO UNLOCK CONFETTI)
      ========================================================= */}
      <div className="rounded-3xl border border-[#222] bg-[#101010] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f1f1f] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-volt-lime" />
              <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#888]">
                HALL OF DISCIPLINE
              </span>
            </div>
            <h3 className="mt-1 font-display text-2xl uppercase tracking-wider text-white">
              ACHIEVEMENT BADGES
            </h3>
          </div>
          <span className="font-mono text-xs text-[#777]">
            TAP UNLOCKED BADGES TO CELEBRATE
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOCK_ACHIEVEMENTS.map((badge) => (
            <div
              key={badge.id}
              onClick={() => triggerBadgeCelebration(badge)}
              className={`group relative cursor-pointer overflow-hidden rounded-2xl border p-4 transition-all duration-300 ${
                badge.unlocked
                  ? 'border-volt-lime/40 bg-[#13170e] hover:border-volt-lime hover:shadow-[0_0_20px_rgba(198,241,53,0.2)]'
                  : 'border-[#1f1f1f] bg-[#121212] opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="text-3xl">{badge.icon}</span>
                {badge.unlocked ? (
                  <span className="rounded-full bg-volt-lime/20 px-2 py-0.5 font-mono text-[9px] font-bold text-volt-lime">
                    +{badge.xp} XP
                  </span>
                ) : (
                  <Lock className="h-3.5 w-3.5 text-[#555]" />
                )}
              </div>

              <h4 className="mt-3 font-display text-lg uppercase tracking-wider text-white">
                {badge.name}
              </h4>
              <p className="mt-1 font-sans text-xs text-[#888] leading-tight">
                {badge.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          PROGRESS JOURNAL / LOG
      ========================================================= */}
      <div className="rounded-3xl border border-[#222] bg-[#101010] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-[#1f1f1f] pb-4">
          <Calendar className="h-5 w-5 text-cyan-neon" />
          <h3 className="font-display text-2xl uppercase tracking-wider text-white">
            TRAINING JOURNAL
          </h3>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddNote();
              }
            }}
            placeholder="Log workout highlights, PR weights, energy levels, soreness..."
            className="flex-1 rounded-2xl border border-[#2a2a2a] bg-[#0c0c0c] px-4 py-3 font-sans text-sm text-white placeholder-[#555] focus:border-volt-lime focus:outline-none"
          />
          <button
            onClick={handleAddNote}
            className="flex items-center gap-2 rounded-2xl bg-volt-lime px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-black transition hover:bg-[#d8ff4f] shadow-[0_0_15px_rgba(198,241,53,0.3)]"
          >
            <Plus className="h-4 w-4 stroke-[3]" /> LOG
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#262626] p-8 text-center font-mono text-xs text-[#666]">
            No journal logs recorded yet. Add your first training insight today!
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between rounded-2xl border border-[#1f1f1f] bg-[#141414] p-4 text-xs font-sans text-[#ddd]"
              >
                <span>{note.text}</span>
                <span className="font-mono text-[10px] text-volt-lime shrink-0 ml-4">
                  {note.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
