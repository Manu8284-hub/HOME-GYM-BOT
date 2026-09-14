import React, { useState, useEffect } from 'react';
import { Search, Dumbbell, Zap, Check, ArrowUpRight, Info } from 'lucide-react';
import { getExercises } from '../services/api';

const CATEGORIES = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Cardio'];

export default function ExerciseLibrary({ setExerciseModal, onAskAI }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bodyweightOnly, setBodyweightOnly] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLibrary() {
      try {
        setLoading(true);
        const data = await getExercises(selectedCategory, searchQuery, bodyweightOnly);
        setExercises(data);
      } catch (err) {
        console.error('Error fetching exercises', err);
      } finally {
        setLoading(false);
      }
    }
    const timer = setTimeout(loadLibrary, 200);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, bodyweightOnly]);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header & Search */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1">
              <Dumbbell className="w-3.5 h-3.5" /> 40+ Exercises
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-800">Exercise Library</h2>
            <p className="text-xs text-slate-400 mt-1">Click any exercise to view instructions and bodyweight alternatives.</p>
          </div>
          <button
            onClick={() => setBodyweightOnly(!bodyweightOnly)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border flex items-center gap-2 ${
              bodyweightOnly
                ? 'bg-cyan-500 text-white border-cyan-400 shadow-sm shadow-cyan-200'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            <Zap className="w-4 h-4" /> Bodyweight Only {bodyweightOnly && <Check className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises e.g. Push-ups, Squats, Lunges..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-3.5 text-xs text-slate-400 hover:text-slate-600">Clear</button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-sm scale-105'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">Searching library...</div>
      ) : exercises.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-3">
          <Info className="w-10 h-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-700 text-lg">No exercises found</h4>
          <p className="text-xs text-slate-400">Try adjusting filters or searching a different term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exercises.map((ex) => (
            <div
              key={ex.id}
              onClick={() => setExerciseModal(ex)}
              className="bg-white rounded-3xl border border-slate-200 hover:border-emerald-300 hover:shadow-md p-5 cursor-pointer transition-all group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{ex.category}</span>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{ex.difficulty}</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-slate-800 group-hover:text-emerald-700 transition-colors">{ex.name}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Muscle: <span className="text-emerald-600">{ex.muscle}</span></p>
                <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-200">{ex.instructions}</p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-3">
                <span className="text-cyan-600 font-medium text-[11px] truncate max-w-[170px]" title={ex.bodyweightAlt || 'Bodyweight'}>🏠 {ex.bodyweightAlt || 'Bodyweight'}</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Details <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
