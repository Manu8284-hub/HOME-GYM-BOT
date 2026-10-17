import React, { useState, useEffect } from 'react';
import {
  Search,
  Dumbbell,
  Zap,
  Check,
  ArrowUpRight,
  Info,
  Layers,
  Sparkles,
  Activity,
  SlidersHorizontal,
} from 'lucide-react';
import { getExercises } from '../services/api';
import { MOCK_BODY_MUSCLES, MOCK_EXERCISES } from '../data/mockData';

const CATEGORIES = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Glutes',
  'Core',
  'Cardio',
];

export default function ExerciseLibrary({ setExerciseModal, onAskAI }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'bodymap'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bodyweightOnly, setBodyweightOnly] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3D Card tilt state tracker
  const [tiltMap, setTiltMap] = useState({});

  useEffect(() => {
    async function loadLibrary() {
      try {
        setLoading(true);
        // TODO: connect backend — GET /exercises?category=${selectedCategory}&query=${searchQuery}&bodyweight=${bodyweightOnly}
        const data = await getExercises(selectedCategory, searchQuery, bodyweightOnly);
        // If API returns empty or offline, fallback to rich mock data
        if (!data || data.length === 0) {
          const filtered = MOCK_EXERCISES.filter((ex) => {
            const matchesCat =
              selectedCategory === 'All' ||
              ex.category?.toLowerCase() === selectedCategory.toLowerCase();
            const matchesSearch =
              !searchQuery ||
              ex.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              ex.muscle?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCat && matchesSearch;
          });
          setExercises(filtered.length > 0 ? filtered : MOCK_EXERCISES);
        } else {
          setExercises(data);
        }
      } catch (err) {
        console.error('Error fetching exercises, using local catalog:', err);
        setExercises(MOCK_EXERCISES);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(loadLibrary, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, bodyweightOnly]);

  const handleMouseMove = (id, e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTiltMap((prev) => ({
      ...prev,
      [id]: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    }));
  };

  const handleMouseLeave = (id) => {
    setTiltMap((prev) => ({
      ...prev,
      [id]: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    }));
  };

  return (
    <div className="space-y-8 pb-24 lg:pb-12 text-[#F5F5F5]">

      {/* =========================================================
          HERO & SEARCH CONTROLS
      ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl border border-[#222] bg-[#101010] p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-cyan-neon/10 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-neon/40 bg-cyan-neon/10 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-cyan-neon uppercase">
                <Dumbbell className="w-3.5 h-3.5" /> 50+ DRILL REPOSITORY
              </span>
              <span className="rounded-full border border-volt-lime/40 bg-volt-lime/10 px-3 py-1 font-mono text-[11px] font-bold text-volt-lime uppercase">
                BIOMECHANICS VERIFIED
              </span>
            </div>

            <h2 className="font-display text-4xl sm:text-5xl uppercase tracking-wider text-white">
              EXERCISE COMPENDIUM
            </h2>

            <p className="mt-1 text-xs sm:text-sm text-[#888] max-w-xl">
              Explore form cues, muscle engagement mappings, and bodyweight regressions.
            </p>
          </div>

          {/* View Mode Toggle & Bodyweight Switch */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex rounded-xl border border-[#262626] bg-[#141414] p-1 font-mono text-xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                  viewMode === 'grid'
                    ? 'bg-volt-lime text-black shadow-[0_0_10px_rgba(198,241,53,0.3)]'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                GRID VIEW
              </button>
              <button
                onClick={() => setViewMode('bodymap')}
                className={`rounded-lg px-3 py-1.5 font-bold transition ${
                  viewMode === 'bodymap'
                    ? 'bg-volt-lime text-black shadow-[0_0_10px_rgba(198,241,53,0.3)]'
                    : 'text-[#888] hover:text-white'
                }`}
              >
                BODY MAP
              </button>
            </div>

            <button
              onClick={() => setBodyweightOnly(!bodyweightOnly)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition ${
                bodyweightOnly
                  ? 'border-cyan-neon bg-cyan-neon/20 text-cyan-neon shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                  : 'border-[#2a2a2a] bg-[#161616] text-[#888] hover:border-[#444] hover:text-white'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>BODYWEIGHT ONLY</span>
              {bodyweightOnly && <Check className="h-3.5 w-3.5 text-cyan-neon" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <Search className="h-5 w-5 text-[#666] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drills e.g. Diamond Push-ups, Bulgarian Split Squats, Pull-ups..."
            className="w-full rounded-2xl border border-[#262626] bg-[#0c0c0c] pl-12 pr-16 py-3.5 font-sans text-sm text-white placeholder-[#555] focus:border-cyan-neon focus:shadow-[0_0_20px_rgba(0,229,255,0.2)] focus:outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-3.5 font-mono text-xs text-[#888] hover:text-white"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 rounded-xl px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition ${
                selectedCategory === cat
                  ? 'bg-volt-lime text-black shadow-[0_0_12px_rgba(198,241,53,0.35)]'
                  : 'border border-[#222] bg-[#141414] text-[#888] hover:border-[#383838] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
          BODY MAP VIEW (OPTIONAL INTERACTIVE MODE)
      ========================================================= */}
      {viewMode === 'bodymap' ? (
        <div className="rounded-3xl border border-[#222] bg-[#101010] p-6 sm:p-8 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-volt-lime">
              ANATOMICAL SELECTOR
            </span>
            <h3 className="mt-1 font-display text-3xl uppercase tracking-wider text-white">
              SELECT TARGET MUSCLE COMPLEX
            </h3>
            <p className="mt-1 text-xs text-[#888]">
              Tap any muscle group below to instantly isolate tailored exercises and activation protocols.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {MOCK_BODY_MUSCLES.map((muscle) => (
              <button
                key={muscle.id}
                onClick={() => {
                  setSelectedCategory(muscle.category);
                  setViewMode('grid');
                }}
                className="group flex flex-col items-center rounded-2xl border border-[#222] bg-[#141414] p-5 transition hover:border-volt-lime hover:bg-[#181818] hover:shadow-[0_0_20px_rgba(198,241,53,0.15)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0e0e0e] border border-[#2a2a2a] group-hover:border-volt-lime text-volt-lime">
                  <Activity className="h-7 w-7" />
                </div>
                <h4 className="mt-3 font-display text-lg uppercase tracking-wider text-white group-hover:text-volt-lime">
                  {muscle.name}
                </h4>
                <span className="mt-1 font-mono text-[11px] text-[#777]">
                  {muscle.exercisesCount} DRILLS
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* =========================================================
            CARD GRID VIEW (WITH 3D TILT EFFECT)
        ========================================================= */
        <div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-3xl bg-[#141414]" />
              ))}
            </div>
          ) : exercises.length === 0 ? (
            <div className="rounded-3xl border border-[#222] bg-[#101010] p-12 text-center shadow-sm">
              <Info className="mx-auto h-12 w-12 text-[#555]" />
              <h4 className="mt-4 font-display text-2xl uppercase tracking-wider text-white">
                NO DRILLS MATCH YOUR FILTER
              </h4>
              <p className="mt-1 font-mono text-xs text-[#777]">
                Try selecting "All" or resetting your query term.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {exercises.map((ex) => {
                const diffBadge =
                  ex.difficulty === 'Advanced'
                    ? 'border-red-500/40 bg-red-500/10 text-red-400'
                    : ex.difficulty === 'Intermediate'
                    ? 'border-cyan-neon/40 bg-cyan-neon/10 text-cyan-neon'
                    : 'border-volt-lime/40 bg-volt-lime/10 text-volt-lime';

                return (
                  <div
                    key={ex.id || ex.name}
                    onMouseMove={(e) => handleMouseMove(ex.id || ex.name, e)}
                    onMouseLeave={() => handleMouseLeave(ex.id || ex.name)}
                    style={{
                      transform: tiltMap[ex.id || ex.name] || 'perspective(1000px)',
                      transition: 'transform 0.15s ease-out',
                    }}
                    onClick={() => setExerciseModal(ex)}
                    className="group relative cursor-pointer flex flex-col justify-between rounded-3xl border border-[#222] bg-[#121212] p-6 shadow-sm hover:border-volt-lime/50 hover:bg-[#151515] hover:shadow-[0_0_25px_rgba(198,241,53,0.15)]"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="rounded-full border border-volt-lime/30 bg-volt-lime/10 px-3 py-0.5 font-mono text-[10px] font-bold text-volt-lime uppercase">
                          {ex.category || 'Compound'}
                        </span>
                        <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase ${diffBadge}`}>
                          {ex.difficulty || 'Intermediate'}
                        </span>
                      </div>

                      <h3 className="font-display text-2xl uppercase tracking-wider text-white group-hover:text-volt-lime transition">
                        {ex.name}
                      </h3>

                      <p className="mt-1 font-mono text-xs text-cyan-neon">
                        TARGET: <span className="text-[#ddd]">{ex.muscle || 'Full Body'}</span>
                      </p>

                      <p className="mt-3 text-xs leading-relaxed text-[#999] line-clamp-3 rounded-xl border border-[#1e1e1e] bg-[#0c0c0c] p-3">
                        {ex.instructions}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#1f1f1f] flex items-center justify-between text-xs font-mono">
                      <span className="text-cyan-neon truncate max-w-[170px]" title={ex.bodyweightAlt || 'Bodyweight'}>
                        ALT: {ex.bodyweightAlt || ex.alternative || 'Standard Form'}
                      </span>

                      <span className="flex items-center gap-1 font-bold text-volt-lime group-hover:translate-x-1 transition-transform">
                        DETAILS <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
