import React from 'react';
import { X, Activity, AlertCircle, RefreshCw, Bot, Layers, Sparkles, Dumbbell } from 'lucide-react';

export default function ExerciseModal({ exercise, onClose, onAskAI }) {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-volt-lime/40 bg-[#0d0d0d] shadow-[0_0_50px_rgba(198,241,53,0.2)] flex flex-col max-h-[90vh]">

        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-volt-lime/15 blur-2xl" />

        {/* Header */}
        <div className="relative z-10 p-6 border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-volt-lime/10 border border-volt-lime/40 flex items-center justify-center text-volt-lime shadow-[0_0_12px_rgba(198,241,53,0.25)]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] font-bold text-cyan-neon uppercase tracking-widest block">
                {exercise.category || 'Compound Drill'}
              </span>
              <h3 className="font-display text-2xl uppercase tracking-wider text-white">
                {exercise.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-[#181818] hover:bg-[#252525] text-[#888] hover:text-white flex items-center justify-center border border-[#2a2a2a] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#ccc] no-scrollbar">

          {/* Vitals Matrix */}
          <div className="grid grid-cols-2 gap-3 font-mono text-center">
            <div className="rounded-2xl border border-[#222] bg-[#141414] p-3">
              <span className="text-[10px] text-[#777] block uppercase">TARGET COMPLEX</span>
              <span className="font-bold text-volt-lime text-xs mt-0.5 block">{exercise.muscle || 'Full Body'}</span>
            </div>
            <div className="rounded-2xl border border-[#222] bg-[#141414] p-3">
              <span className="text-[10px] text-[#777] block uppercase">DIFFICULTY TIER</span>
              <span className="font-bold text-cyan-neon text-xs mt-0.5 block">{exercise.difficulty || 'Intermediate'}</span>
            </div>
          </div>

          {/* Volume Target */}
          <div className="rounded-2xl border border-volt-lime/30 bg-volt-lime/5 p-4 flex items-center gap-3">
            <Layers className="w-5 h-5 text-volt-lime shrink-0" />
            <div>
              <span className="font-mono text-[11px] font-bold text-volt-lime uppercase block">
                OPTIMAL VOLUME TARGET
              </span>
              <span className="font-mono text-xs text-white">
                {exercise.setsReps || `${exercise.sets || 3} SETS × ${exercise.reps || '10-12'} REPS`}
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#888] mb-2">
              BIOMECHANICAL EXECUTION
            </h4>
            <p className="leading-relaxed rounded-2xl border border-[#222] bg-[#141414] p-4 text-xs sm:text-sm text-[#bbb] font-sans">
              {exercise.instructions}
            </p>
          </div>

          {/* Common Mistakes */}
          {exercise.commonMistakes && (
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> COMMON KINETIC FLAWS
              </h4>
              <p className="rounded-2xl border border-red-500/20 bg-red-500/5 p-3.5 text-xs text-red-200 leading-relaxed font-sans">
                {exercise.commonMistakes}
              </p>
            </div>
          )}

          {/* Alternative */}
          {(exercise.bodyweightAlt || exercise.alternative) && (
            <div>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-neon mb-2 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> REGRESSION / ALTERNATIVE
              </h4>
              <p className="rounded-2xl border border-cyan-neon/30 bg-cyan-neon/5 p-3.5 text-xs text-cyan-200 font-mono">
                {exercise.bodyweightAlt || exercise.alternative}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222] bg-[#101010] flex gap-3">
          <button
            onClick={() => {
              onAskAI?.(`Tell me how to execute ${exercise.name} with elite form, warm-up drills, and variations for ${exercise.muscle}.`);
              onClose();
            }}
            className="flex-1 py-3 px-5 rounded-2xl bg-volt-lime hover:bg-[#d8ff4f] text-black font-mono font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(198,241,53,0.35)] transition-all active:scale-98"
          >
            <Bot className="w-4 h-4 stroke-[2.5]" />
            <span>DISCUSS DRILL WITH COACH AI</span>
          </button>
        </div>

      </div>
    </div>
  );
}
