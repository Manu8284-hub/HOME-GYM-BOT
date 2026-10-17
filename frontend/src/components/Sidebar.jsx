import React, { useState } from 'react';
import {
  LayoutDashboard, Dumbbell, UtensilsCrossed, BookOpen,
  Bot, TrendingUp, User, Zap, ChevronLeft, ChevronRight, Command
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'workout',   label: 'Workout',    icon: Dumbbell },
  { id: 'diet',      label: 'Diet',       icon: UtensilsCrossed },
  { id: 'exercises', label: 'Exercises',  icon: BookOpen },
  { id: 'aicoach',   label: 'AI Coach',   icon: Bot,    badge: 'AI' },
  { id: 'progress',  label: 'Progress',   icon: TrendingUp },
  { id: 'profile',   label: 'Profile',    icon: User },
];

const STORAGE_KEY = 'fitbot_sidebar_collapsed';

export default function Sidebar({ activeTab, setActiveTab, userProfile, sessionEmail, onCommandPalette }) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });

  const toggle = () => setCollapsed(prev => {
    const next = !prev;
    try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* noop */ }
    return next;
  });

  const displayName = userProfile?.name?.trim()
    || sessionEmail?.split('@')?.[0]?.replace(/[._-]+/g, ' ')
    || 'Athlete';
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const displayDetail = userProfile?.fitnessGoal?.trim() || 'Fitness journey';

  return (
    <>
      {/* ====================================================
          DESKTOP SIDEBAR
      ==================================================== */}
      <aside
        className={`
          relative hidden lg:flex flex-col shrink-0 h-screen max-h-screen
          overflow-y-auto sticky top-0 transition-all duration-300
          border-r border-[#222]
          ${collapsed ? 'w-[72px]' : 'w-[240px]'}
        `}
        style={{ background: '#0C0C0C' }}
      >
        {/* ---- Top section ---- */}
        <div className="flex-1 px-3 py-5 flex flex-col gap-1">

          {/* Brand */}
          <div className={`flex items-center mb-7 ${collapsed ? 'justify-center' : 'justify-between px-1'}`}>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 min-w-0 group"
              title="FitBot AI"
              style={{ background: 'transparent', transform: 'none' }}
            >
              {/* Logo */}
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200"
                style={{ background: '#C6F135', boxShadow: '0 0 14px rgba(198,241,53,0.35)' }}
              >
                <Zap className="w-4.5 h-4.5 fill-current" style={{ color: '#080808', width: '18px', height: '18px' }} />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-sm font-bold tracking-tight" style={{ color: '#F5F5F5' }}>FitBot</p>
                  <p className="text-[10px]" style={{ color: '#555' }}>AI Power Mode</p>
                </div>
              )}
            </button>
            {!collapsed && (
              <button onClick={toggle} className="w-6 h-6 rounded-md flex items-center justify-center transition"
                style={{ color: '#444', background: 'transparent' }}>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand toggle when collapsed */}
          {collapsed && (
            <button onClick={toggle}
              className="absolute left-[52px] top-[66px] z-20 w-5 h-5 rounded-full flex items-center justify-center border border-[#333] transition"
              style={{ background: '#1a1a1a', color: '#888' }}>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}

          {/* Nav label */}
          {!collapsed && (
            <p className="px-2 mb-1 text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: '#444' }}>
              Navigate
            </p>
          )}

          {/* Nav items */}
          <nav className="flex flex-col gap-0.5">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`
                    relative group w-full flex items-center rounded-xl transition-all duration-200
                    ${collapsed ? 'justify-center px-0 py-3' : 'justify-between px-3 py-2.5'}
                    ${isActive ? 'nav-active' : ''}
                  `}
                  style={{
                    background: isActive ? 'rgba(198,241,53,0.10)' : 'transparent',
                    color: isActive ? '#C6F135' : '#666',
                  }}
                >
                  <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                    <Icon
                      className="w-[18px] h-[18px] shrink-0 transition"
                      style={{ color: isActive ? '#C6F135' : '#555' }}
                    />
                    {!collapsed && (
                      <span className="text-sm font-medium" style={{ color: isActive ? '#F5F5F5' : '#888' }}>
                        {item.label}
                      </span>
                    )}
                  </div>
                  {/* AI badge */}
                  {!collapsed && item.badge && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: isActive ? 'rgba(198,241,53,0.2)' : '#1a1a1a', color: isActive ? '#C6F135' : '#555' }}>
                      {item.badge}
                    </span>
                  )}
                  {/* Hover glow */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(255,255,255,0.03)' }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Command palette shortcut */}
          {!collapsed && (
            <button
              onClick={onCommandPalette}
              className="mt-4 w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-[#222] transition group"
              style={{ background: '#111', color: '#555' }}
            >
              <Command className="w-3.5 h-3.5" />
              <span className="text-xs flex-1 text-left">Quick jump</span>
              <kbd className="text-[9px] border border-[#333] px-1 py-0.5 rounded font-mono" style={{ color: '#444' }}>⌘K</kbd>
            </button>
          )}
        </div>

        {/* ---- Bottom user card ---- */}
        <div className="p-3 border-t border-[#1a1a1a]">
          {collapsed ? (
            <button onClick={() => setActiveTab('profile')} title={displayName}
              className="w-full flex justify-center py-1.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: '#C6F135', color: '#080808' }}>
                {initials}
              </div>
            </button>
          ) : (
            <button onClick={() => setActiveTab('profile')}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-[#1a1a1a] transition text-left"
              style={{ background: '#111' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                style={{ background: '#C6F135', color: '#080808' }}>
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: '#F5F5F5' }}>{displayName}</p>
                <p className="text-[11px] truncate" style={{ color: '#555' }}>{displayDetail}</p>
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* ====================================================
          MOBILE BOTTOM NAV
      ==================================================== */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#1a1a1a] px-1 py-2 flex justify-around items-center"
        style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(20px)' }}
      >
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="relative flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg transition mob-nav-active"
              style={{ color: isActive ? '#C6F135' : '#555', minWidth: 44, minHeight: 44 }}
            >
              <Icon className="w-5 h-5 transition-all" style={{ filter: isActive ? 'drop-shadow(0 0 6px rgba(198,241,53,0.7))' : 'none' }} />
              <span className="text-[9px] font-medium truncate max-w-[56px]" style={{ color: isActive ? '#C6F135' : '#444' }}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ background: '#C6F135', boxShadow: '0 0 6px rgba(198,241,53,0.8)' }} />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}