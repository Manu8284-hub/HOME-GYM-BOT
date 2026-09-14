import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, Droplets, Calendar, Plus, CheckCircle2, Target, Activity } from 'lucide-react';
import { getSessionEmail, getWater, setWater, getStreak, getSessionsCount, getNotes, addNote } from '../services/localStore';

function parseKg(value) {
  const n = parseFloat(String(value || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : null;
}

export default function Progress({ userProfile }) {
  const email = getSessionEmail();

  const currentWeight = parseKg(userProfile?.weight);
  const targetWeight = parseKg(userProfile?.targetWeight);

  const [waterCups, setWaterCups] = useState(() => getWater(email));
  const [streakDays] = useState(() => getStreak(email));
  const [sessions] = useState(() => getSessionsCount(email));
  const [notes, setNotes] = useState(() => getNotes(email));
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    setWater(email, waterCups);
  }, [email, waterCups]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes(addNote(email, newNote.trim()));
    setNewNote('');
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5" /> Your Progress
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-800">Progress Tracker</h2>
          <p className="text-xs text-slate-400 mt-1">Your workout streak, sessions, hydration, and journal — saved on this device.</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
          <Target className="w-6 h-6 text-emerald-600" />
          <div>
            <span className="text-[10px] text-slate-400 block">Goal Target</span>
            <span className="font-bold text-slate-800 text-sm">
              {userProfile?.fitnessGoal || 'Build Muscle'}{targetWeight ? ` (${targetWeight} kg)` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Current Weight (from profile — display only) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Current Weight</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-slate-800">{currentWeight ?? '--'}</span>
            <span className="text-xs text-slate-400">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            {targetWeight ? `Target: ${targetWeight} kg` : 'Set your weight in Profile'}
          </p>
        </div>

        {/* Streak */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-amber-500">{streakDays}</span>
            <span className="text-xs text-slate-400">{streakDays === 1 ? 'Day' : 'Days'} 🔥</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">Consecutive days completed</p>
        </div>

        {/* Workouts Completed */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Sessions Done</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-cyan-600">{sessions}</span>
            <span className="text-xs text-slate-400">{sessions === 1 ? 'Session' : 'Sessions'}</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-100">Workouts you marked complete</p>
        </div>

        {/* Water */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Water Intake</span>
            <Droplets className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold text-3xl text-slate-800">{(waterCups * 0.25).toFixed(2)}</span>
            <span className="text-xs text-slate-400">Liters</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400">Goal: 3.50L</span>
            <button onClick={() => setWaterCups(prev => prev + 1)} className="px-2 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold border border-cyan-200">+ 250ml</button>
          </div>
        </div>
      </div>

      {/* Progress Journal */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-lg text-slate-800 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-500" /> Progress Journal
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddNote(); } }}
            placeholder="Log today's workout highlight, how you felt, energy levels..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            onClick={handleAddNote}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shadow-emerald-200"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
        {notes.length === 0 ? (
          <div className="bg-slate-50 border border-dashed border-slate-200 p-6 rounded-2xl text-center text-xs text-slate-400">
            No entries yet. Add your first note after today's workout!
          </div>
        ) : (
          <div className="space-y-2.5">
            {notes.map((note) => (
              <div key={note.id} className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center justify-between text-xs">
                <span className="text-slate-700">{note.text}</span>
                <span className="text-[10px] text-slate-400 shrink-0 ml-3">{note.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
