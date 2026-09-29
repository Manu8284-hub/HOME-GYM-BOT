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
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    id: 'workout',
    label: 'Workout Plan',
    icon: Dumbbell
  },
  {
    id: 'diet',
    label: 'Diet Plan',
    icon: UtensilsCrossed
  },
  {
    id: 'exercises',
    label: 'Exercise Library',
    icon: BookOpen
  },
  {
    id: 'aicoach',
    label: 'AI Coach',
    icon: Bot,
    badge: 'AI'
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: TrendingUp
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: User
  }
];

const STORAGE_KEY = 'fitbot_sidebar_collapsed';

export default function Sidebar({
  activeTab,
  setActiveTab,
  userProfile,
  sessionEmail
}) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const toggle = () => {
    setCollapsed((previous) => {
      const next = !previous;

      try {
        localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      } catch {
        // Ignore localStorage errors
      }

      return next;
    });
  };

  const displayName =
    userProfile?.name?.trim() ||
    sessionEmail?.split('@')?.[0]?.replace(/[._-]+/g, ' ') ||
    'User';

  const displayDetail =
    userProfile?.fitnessGoal?.trim() ||
    'Fitness journey';

  return (
    <>
      {/* ================================
          DESKTOP SIDEBAR
      ================================= */}

      <aside
        className={`
          relative
          hidden lg:flex
          flex-col
          shrink-0
          h-screen
          max-h-screen
          overflow-y-auto
          sticky top-0
          bg-slate-950
          text-white
          border-r border-slate-800
          transition-all duration-300
          ${collapsed ? 'w-[82px]' : 'w-[250px]'}
        `}
      >
        {/* ================================
            TOP SECTION
        ================================= */}

        <div className="flex-1 px-3 py-5">

          {/* Brand */}
          <div
            className={`
              flex items-center mb-8
              ${collapsed
                ? 'justify-center'
                : 'justify-between px-2'
              }
            `}
          >
            <div className="flex items-center gap-3 min-w-0">

              {/* Logo */}
              <div
                className="
                  w-10 h-10
                  rounded-xl
                  bg-white
                  text-slate-950
                  flex items-center justify-center
                  shrink-0
                  shadow-lg
                "
              >
                <Zap className="w-5 h-5 fill-current" />
              </div>

              {/* Brand Text */}
              {!collapsed && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h1 className="text-lg font-bold tracking-tight">
                      FitBot
                    </h1>

                    <span
                      className="
                        text-[9px]
                        font-bold
                        bg-white
                        text-slate-950
                        px-1.5
                        py-0.5
                        rounded
                      "
                    >
                      AI
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    Personal Fitness Coach
                  </p>
                </div>
              )}
            </div>

            {/* Collapse Button */}
            {!collapsed && (
              <button
                type="button"
                onClick={toggle}
                title="Collapse sidebar"
                className="
                  w-7 h-7
                  rounded-lg
                  flex items-center justify-center
                  text-slate-400
                  hover:text-white
                  hover:bg-slate-800
                  transition
                "
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Expand Button */}
          {collapsed && (
            <button
              type="button"
              onClick={toggle}
              title="Expand sidebar"
              className="
                absolute
                left-[58px]
                top-[66px]
                z-20
                w-7 h-7
                rounded-lg
                bg-slate-800
                border border-slate-700
                text-slate-300
                hover:text-white
                hover:bg-slate-700
                flex items-center justify-center
                transition
              "
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* Navigation Title */}
          {!collapsed && (
            <p
              className="
                px-3
                mb-2
                text-[10px]
                font-bold
                uppercase
                tracking-[0.15em]
                text-slate-500
              "
            >
              Main Menu
            </p>
          )}

          {/* Navigation */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`
                    relative
                    group
                    w-full
                    flex items-center
                    rounded-xl
                    transition-all duration-200

                    ${
                      collapsed
                        ? 'justify-center px-0 py-3'
                        : 'justify-between px-3 py-3'
                    }

                    ${
                      isActive
                        ? 'bg-white text-slate-950 shadow-lg'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }
                  `}
                >
                  {/* Left Side */}
                  <div
                    className={`
                      flex items-center
                      ${collapsed ? '' : 'gap-3'}
                    `}
                  >
                    <Icon
                      className={`
                        w-[18px] h-[18px]
                        shrink-0
                        transition

                        ${
                          isActive
                            ? 'text-slate-950'
                            : 'text-slate-500 group-hover:text-white'
                        }
                      `}
                    />

                    {!collapsed && (
                      <span className="text-sm font-medium">
                        {item.label}
                      </span>
                    )}
                  </div>

                  {/* AI Badge */}
                  {!collapsed && item.badge && (
                    <span
                      className={`
                        text-[9px]
                        font-bold
                        px-1.5
                        py-0.5
                        rounded-md

                        ${
                          isActive
                            ? 'bg-slate-950 text-white'
                            : 'bg-slate-800 text-slate-300'
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}

                  {/* Collapsed AI Indicator */}
                  {collapsed && item.badge && (
                    <span
                      className="
                        absolute
                        top-2
                        right-2
                        w-2
                        h-2
                        rounded-full
                        bg-white
                      "
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ================================
            BOTTOM USER CARD
        ================================= */}

        <div className="p-3 border-t border-slate-800">

          {collapsed ? (
            /* Collapsed User */
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              title={displayName}
              className="
                w-full
                flex justify-center
                py-2
              "
            >
              <div
                className="
                  w-10 h-10
                  rounded-full
                  bg-white
                  text-slate-950
                  flex items-center justify-center
                  font-bold
                  text-sm
                "
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
            </button>
          ) : (
            /* Expanded User */
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className="
                w-full
                flex items-center
                gap-3
                p-3
                rounded-xl
                bg-slate-900
                border border-slate-800
                hover:bg-slate-800
                transition
                text-left
              "
            >
              <div
                className="
                  w-10 h-10
                  rounded-full
                  bg-white
                  text-slate-950
                  flex items-center justify-center
                  font-bold
                  text-sm
                  shrink-0
                "
              >
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {displayName}
                </p>

                <p className="text-xs text-slate-500 truncate">
                  {displayDetail}
                </p>
              </div>
            </button>
          )}
        </div>
      </aside>

      {/* ================================
          MOBILE BOTTOM NAVIGATION
      ================================= */}

      <nav
        className="
          lg:hidden
          fixed
          bottom-0
          left-0
          right-0
          z-50
          bg-slate-950
          border-t border-slate-800
          px-1.5
          py-2
          flex
          justify-around
          items-center
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`
                flex
                flex-col
                items-center
                justify-center
                gap-1
                px-2
                py-1.5
                rounded-lg
                transition

                ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500'
                }
              `}
            >
              <Icon
                className={`
                  w-5 h-5
                  ${isActive ? 'scale-110' : ''}
                  transition-transform
                `}
              />

              <span className="text-[9px] font-medium truncate max-w-[58px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}