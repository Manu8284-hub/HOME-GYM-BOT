import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Dumbbell, LayoutDashboard, Bot, BookOpen, TrendingUp, User, UtensilsCrossed, Zap, ArrowRight } from 'lucide-react';

const COMMANDS = [
  { id: 'dashboard',  label: 'Go to Dashboard',       icon: LayoutDashboard, tab: 'dashboard',  shortcut: 'D' },
  { id: 'workout',    label: 'Start Today\'s Workout', icon: Dumbbell,         tab: 'workout',    shortcut: 'W' },
  { id: 'aicoach',   label: 'Open AI Coach',          icon: Bot,              tab: 'aicoach',    shortcut: 'A' },
  { id: 'exercises',  label: 'Exercise Library',       icon: BookOpen,         tab: 'exercises',  shortcut: 'E' },
  { id: 'diet',       label: 'Diet Plan',              icon: UtensilsCrossed,  tab: 'diet',       shortcut: 'N' },
  { id: 'progress',   label: 'My Progress',            icon: TrendingUp,       tab: 'progress',   shortcut: 'P' },
  { id: 'profile',    label: 'Profile Settings',       icon: User,             tab: 'profile',    shortcut: 'S' },
];

export default function CommandPalette({ open, onClose, setActiveTab }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = COMMANDS.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const execute = useCallback((cmd) => {
    setActiveTab(cmd.tab);
    onClose();
    setQuery('');
  }, [setActiveTab, onClose]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (!open) return;
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) execute(filtered[selected]);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selected, execute, onClose]);

  if (!open) return null;

  return (
    <div
      className="cmd-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="cmd-box">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/08">
          <Search className="w-4 h-4 text-neon-muted shrink-0" style={{ color: '#888' }} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            placeholder="Search commands…"
            className="flex-1 bg-transparent text-[#F5F5F5] placeholder-[#555] text-sm focus:outline-none"
          />
          <kbd className="text-[10px] bg-white/06 border border-white/10 px-1.5 py-0.5 rounded text-[#888] font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="py-2 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-center text-sm py-8" style={{ color: '#555' }}>No commands found</p>
          ) : filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            const isSelected = i === selected;
            return (
              <button
                key={cmd.id}
                onClick={() => execute(cmd)}
                onMouseEnter={() => setSelected(i)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${isSelected ? 'bg-white/08' : ''}`}
                style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.06)' : '' }}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#C6F135]/15' : 'bg-white/05'}`}>
                  <Icon className="w-4 h-4" style={{ color: isSelected ? '#C6F135' : '#888' }} />
                </div>
                <span className="flex-1 text-sm" style={{ color: isSelected ? '#F5F5F5' : '#888' }}>
                  {cmd.label}
                </span>
                <div className="flex items-center gap-2">
                  {isSelected && <ArrowRight className="w-3.5 h-3.5" style={{ color: '#C6F135' }} />}
                  <kbd className="text-[10px] bg-white/05 border border-white/08 px-1.5 py-0.5 rounded font-mono hidden sm:block" style={{ color: '#555' }}>
                    {cmd.shortcut}
                  </kbd>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-white/05 flex items-center gap-4 text-[11px]" style={{ color: '#444' }}>
          <span className="flex items-center gap-1.5"><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1.5"><kbd className="font-mono">↵</kbd> select</span>
          <span className="flex items-center gap-1.5"><kbd className="font-mono">Esc</kbd> close</span>
          <span className="ml-auto flex items-center gap-1.5">
            <Zap className="w-3 h-3" style={{ color: '#C6F135' }} />
            <span style={{ color: '#C6F135' }}>FitBot</span>
          </span>
        </div>
      </div>
    </div>
  );
}
