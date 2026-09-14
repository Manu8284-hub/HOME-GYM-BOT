import React from 'react';
import { X, Activity, AlertCircle, RefreshCw, Bot, Layers } from 'lucide-react';

export default function ExerciseModal({ exercise, onClose, onAskAI }) {
  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl shadow-slate-300/50 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{exercise.category}</span>
              <h3 className="font-heading font-bold text-xl text-slate-800">{exercise.name}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-600 text-sm">
          {/* Key Badges */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block mb-0.5">Target Muscle</span>
              <span className="font-semibold text-slate-700 text-xs">{exercise.muscle}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-[11px] text-slate-400 block mb-0.5">Difficulty</span>
              <span className="font-semibold text-amber-600 text-xs">{exercise.difficulty}</span>
            </div>
          </div>

          {/* Volume */}
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center gap-3">
            <Layers className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs text-emerald-700 font-semibold block">Recommended Sets & Reps</span>
              <span className="text-slate-800 font-medium">{exercise.setsReps || `${exercise.sets || 3} sets × ${exercise.reps || '10-12'} reps`}</span>
            </div>
          </div>

          {/* Instructions */}
          <div>
            <h4 className="font-semibold text-slate-500 mb-1.5 text-xs uppercase tracking-wider">Step-by-Step Instructions</h4>
            <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700">
              {exercise.instructions}
            </p>
          </div>

          {/* Common Mistakes */}
          {exercise.commonMistakes && (
            <div>
              <h4 className="font-semibold text-amber-600 mb-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" /> Common Mistakes to Avoid
              </h4>
              <p className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-800 text-xs leading-relaxed">
                {exercise.commonMistakes}
              </p>
            </div>
          )}

          {/* Alternative */}
          {exercise.bodyweightAlt && (
            <div>
              <h4 className="font-semibold text-cyan-600 mb-1.5 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Bodyweight Alternative
              </h4>
              <p className="bg-cyan-50 border border-cyan-200 p-3 rounded-xl text-cyan-800 text-xs font-medium">
                {exercise.bodyweightAlt}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
          <button
            onClick={() => {
              onAskAI(`Tell me how to properly perform ${exercise.name} and give tips for ${exercise.muscle}`);
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-98"
          >
            <Bot className="w-4 h-4" />
            <span>Ask FitBot AI About This</span>
          </button>
        </div>
      </div>
    </div>
  );
}
