import React from 'react';
import {
  Sparkles,
  Home,
  Leaf,
  LogOut
} from 'lucide-react';

export default function Navbar({
  activeTab,
  userProfile,
  setUserProfile,
  onQuickChat,
  onLogout
}) {
  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';

      case 'workout':
        return 'Workout Plan';

      case 'diet':
        return 'Diet Plan';

      case 'exercises':
        return 'Exercise Library';

      case 'aicoach':
        return 'AI Coach';

      case 'progress':
        return 'Progress';

      case 'profile':
        return 'Profile';

      default:
        return 'FitBot AI';
    }
  };

  return (
    <header className="
      sticky top-0
      z-40
      bg-white/95
      backdrop-blur-xl
      border-b border-slate-200
    ">
      <div className="
        min-h-[72px]
        px-5
        sm:px-7
        lg:px-8
        flex
        items-center
        justify-between
        gap-4
      ">

        {/* Left */}
        <div className="min-w-0">

          <div className="flex items-center gap-3">

            <h2 className="
              text-xl
              sm:text-2xl
              font-bold
              tracking-tight
              text-slate-950
              truncate
            ">
              {getTitle()}
            </h2>

            {activeTab === 'dashboard' && (
              <span className="
                hidden
                sm:flex
                items-center
                gap-1.5
                px-2.5
                py-1
                rounded-full
                bg-slate-100
                border border-slate-200
                text-slate-600
                text-[11px]
                font-semibold
              ">
                <Leaf className="w-3 h-3" />
                Natural Foods
              </span>
            )}
          </div>

          <p className="
            hidden
            sm:block
            mt-0.5
            text-xs
            text-slate-400
          ">
            {activeTab === 'dashboard'
              ? 'Your personalized fitness overview'
              : 'FitBot AI · Personal Fitness Coach'}
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Home Mode */}
          <div className="
            hidden
            md:flex
            items-center
            gap-1.5
            px-3
            py-2
            rounded-xl
            bg-slate-50
            border border-slate-200
            text-slate-600
            text-xs
            font-semibold
          ">
            <Home className="w-3.5 h-3.5" />
            Home Only
          </div>

          {/* AI Coach */}
          <button
            onClick={onQuickChat}
            className="
              flex
              items-center
              gap-2
              px-3.5
              py-2
              rounded-xl
              bg-slate-950
              hover:bg-slate-800
              text-white
              text-xs
              font-bold
              transition
              shadow-sm
              active:scale-95
            "
          >
            <Sparkles className="w-4 h-4" />

            <span className="hidden sm:inline">
              AI Coach
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="
              flex
              items-center
              gap-2
              px-3.5
              py-2
              rounded-xl
              bg-white
              hover:bg-red-50
              text-slate-600
              hover:text-red-600
              border border-slate-200
              hover:border-red-200
              text-xs
              font-bold
              transition
              active:scale-95
            "
          >
            <LogOut className="w-4 h-4" />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}