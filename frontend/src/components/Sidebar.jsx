import React, { useState } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  BookOpen,
  Bot,
  TrendingUp,
  User,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'workout', label: 'Workout Plan', icon: Dumbbell },
  { id: 'diet', label: 'Diet Plan', icon: UtensilsCrossed },
  { id: 'exercises', label: 'Exercise Library', icon: BookOpen },
  { id: 'aicoach', label: 'AI Coach', icon: Bot, badge: 'AI' },
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'profile', label: 'Profile', icon: User }
];

const STORAGE_KEY = 'fitbot_sidebar_collapsed';

export default function Sidebar({ activeTab, setActiveTab, userProfile, sessionEmail }) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
  });

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, next ? '1' : '0'); } catch { /* ignore */ }
      return next;
    });
  };

  const displayName = userProfile?.name?.trim() || sessionEmail?.split('@')?.[0]?.replace(/[._-]+/g, ' ') || '';
  const displayDetail = userProfile?.fitnessGoal?.trim() || sessionEmail || '';
  const showUserCard = Boolean(displayName || displayDetail);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-slate-200 shrink-0 min-h-screen sticky top-0 py-4 justify-between shadow-sm transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-20 px-2' : 'w-64 px-4'
        }`}
      >
        <div className="space-y-6">
          {/* App Branding + collapse toggle */}
          <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between px-1'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <h1 className="font-heading font-bold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
                    FitBot
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-white font-bold tracking-wide">AI</span>
                  </h1>
                  <p className="text-xs text-slate-400 truncate">Personal Fitness Coach</p>
                </div>
              )}
            </div>
            <button
              onClick={toggle}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors shrink-0"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-xl font-medium text-sm transition-all duration-200 ${
                    collapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className={`flex items-center ${collapsed ? '' : 'gap-3'}`}>
                    <span className="relative">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {/* Collapsed: show a dot instead of the text badge */}
                      {collapsed && item.badge && (
                        <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-2 ring-white ${isActive ? 'bg-white' : 'bg-slate-900'}`} />
                      )}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </div>
                  {!collapsed && item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isActive ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Card */}
        {showUserCard && (
          collapsed ? (
            <div className="flex justify-center" title={`${displayName}${displayDetail ? ` · ${displayDetail}` : ''}`}>
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl flex items-center gap-3 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {displayName ? displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{displayName}</p>
                <p className="text-xs text-slate-400 font-medium truncate">{displayDetail}</p>
              </div>
            </div>
          )
        )}
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex justify-around items-center shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isActive ? 'text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] mt-0.5 truncate max-w-[56px]">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
