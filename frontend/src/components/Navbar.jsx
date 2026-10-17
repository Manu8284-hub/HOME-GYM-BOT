import React, { useState } from 'react';
import { Sparkles, LogOut, Bell, Command, Sun, Moon, Zap } from 'lucide-react';

export default function Navbar({
  activeTab, userProfile, onQuickChat, onLogout, onCommandPalette, darkMode, toggleDark
}) {
  const PAGE_TITLES = {
    dashboard: 'Dashboard',
    workout:   'Workout Plan',
    diet:      'Diet Plan',
    exercises: 'Exercise Library',
    aicoach:   'AI Coach',
    progress:  'Progress',
    profile:   'Profile',
  };

  const title = PAGE_TITLES[activeTab] || 'FitBot';
  const displayName = userProfile?.name?.trim() || 'Athlete';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-[#1a1a1a]"
      style={{ background: 'rgba(10,10,10,0.9)', backdropFilter: 'blur(20px)' }}
    >
      {/* Left: page title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden w-6 h-6 rounded flex items-center justify-center"
          style={{ background: '#C6F135' }}>
          <Zap className="w-3.5 h-3.5" style={{ color: '#080808' }} />
        </div>
        <h2
          className="text-sm font-semibold tracking-tight"
          style={{ color: '#F5F5F5' }}
        >
          {title}
        </h2>
        {activeTab === 'aicoach' && (
          <span className="chip-volt text-[9px]">Live</span>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        {/* Command palette shortcut */}
        <button
          onClick={onCommandPalette}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#222] text-[11px] transition"
          style={{ background: '#111', color: '#666' }}
          title="Command palette (Ctrl+K)"
        >
          <Command className="w-3 h-3" />
          <span>⌘K</span>
        </button>

        {/* Quick AI chat */}
        <button
          onClick={onQuickChat}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition"
          style={{ background: 'rgba(198,241,53,0.1)', color: '#C6F135', border: '1px solid rgba(198,241,53,0.2)' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Ask AI
        </button>

        {/* Dark / light toggle */}
        {toggleDark && (
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-[#222] transition"
            style={{ background: '#111', color: '#888' }}
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        )}

        {/* Avatar + logout */}
        <div className="flex items-center gap-2 pl-1">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: '#C6F135', color: '#080808' }}
          >
            {initials}
          </div>
          <button
            onClick={onLogout}
            className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#222] transition"
            style={{ background: '#111', color: '#888' }}
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}