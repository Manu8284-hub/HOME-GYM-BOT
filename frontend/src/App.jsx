import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DisclaimerBanner from './components/DisclaimerBanner';
import ExerciseModal from './components/ExerciseModal';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import { useBeastMode } from './hooks/useBeastMode';

import Auth from './pages/Auth';
import SplashScreen from './pages/SplashScreen';
import Dashboard from './pages/Dashboard';
import WorkoutPlanner from './pages/WorkoutPlanner';
import DietPlanner from './pages/DietPlanner';
import ExerciseLibrary from './pages/ExerciseLibrary';
import AICoach from './pages/AICoach';
import Progress from './pages/Progress';
import Assessment from './pages/Assessment';

import {
  isLoggedIn as readLoggedIn,
  getSessionEmail,
  setSession,
  clearSession,
  getUserData,
  saveProfile,
  getPlan,
  savePlan,
  isOnboarded,
  setOnboarded,
} from './services/localStore';
import { getOrganizedPlan, getUserProfile } from './services/api';

function initialTab(loggedIn, email) {
  if (!loggedIn || !email) return 'login';
  return isOnboarded(email) ? 'dashboard' : 'profile';
}

export default function App() {
  const bootEmail = getSessionEmail();
  const bootLoggedIn = readLoggedIn();

  const [isLoggedIn, setIsLoggedIn] = useState(bootLoggedIn);
  const [sessionEmail, setSessionEmail] = useState(bootEmail);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(
    bootLoggedIn && bootEmail ? isOnboarded(bootEmail) : false
  );
  const [activeTab, setActiveTab] = useState(() => initialTab(bootLoggedIn, bootEmail));
  const [startupStage, setStartupStage] = useState(bootLoggedIn ? 'ready' : 'splash');
  const [userProfile, setUserProfile] = useState(() => {
    if (bootLoggedIn && bootEmail) {
      const data = getUserData(bootEmail);
      return data.profile || { email: bootEmail };
    }
    return null;
  });
  const [userPlan, setUserPlan] = useState(() => {
    if (bootLoggedIn && bootEmail) return getPlan(bootEmail);
    return null;
  });
  const [regenerating, setRegenerating] = useState(false);

  const [exerciseModalData, setExerciseModalData] = useState(null);
  const [pendingAIQuery, setPendingAIQuery] = useState('');
  const [cmdOpen, setCmdOpen] = useState(false);

  // Easter egg: Konami code activator for Beast Mode
  useBeastMode();

  // Ctrl+K / Cmd+K listener for Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setStartupStage('ready');
      return;
    }

    setStartupStage('splash');
    const timer = window.setTimeout(() => {
      setStartupStage('intro');
    }, 2400);

    return () => window.clearTimeout(timer);
  }, [isLoggedIn]);

  function handleAskAI(queryText) {
    setPendingAIQuery(queryText);
    setActiveTab('aicoach');
  }

  async function handleAuthed(sessionUser) {
    const email = sessionUser?.email || '';
    if (!email) return;

    setSession(email);
    setSessionEmail(email);
    setIsLoggedIn(true);
    setStartupStage('ready');

    const localData = getUserData(email);
    let remoteData = null;
    try {
      // TODO: connect backend — GET /user/profile?email=${email}
      remoteData = await getUserProfile(email);
    } catch {
      remoteData = null;
    }

    const data = {
      ...localData,
      profile: { ...(localData.profile || {}), ...(remoteData?.profile || {}) },
      plan: localData.plan || remoteData?.plan || null,
      onboardingComplete: localData.onboardingComplete || Boolean(remoteData?.onboardingComplete),
    };
    if (data.profile && Object.keys(data.profile).length > 0) {
      saveProfile(email, data.profile);
    }
    if (data.plan && !localData.plan) savePlan(email, data.plan);

    const onboarded = data.onboardingComplete;
    setHasCompletedOnboarding(onboarded);

    setUserProfile({
      email,
      name: sessionUser?.name || '',
      ...(data.profile || {}),
    });
    setUserPlan(data.plan || null);

    setActiveTab(onboarded ? 'dashboard' : 'profile');
  }

  // Rebuild the plan from the current profile
  async function handleRegeneratePlan() {
    if (!userProfile || regenerating) return;
    setRegenerating(true);
    try {
      // TODO: connect backend — POST /workout/regenerate
      const plan = await getOrganizedPlan(userProfile);
      if (sessionEmail) savePlan(sessionEmail, plan);
      setUserPlan(plan);
    } catch (err) {
      console.error('Regenerate plan failed:', err);
    } finally {
      setRegenerating(false);
    }
  }

  // Called by Assessment wizard once it has built & saved the plan
  function handleAssessmentComplete() {
    if (sessionEmail) setOnboarded(sessionEmail);
    setHasCompletedOnboarding(true);
    setActiveTab('dashboard');
  }

  function handleLogout() {
    clearSession();
    setIsLoggedIn(false);
    setSessionEmail('');
    setUserProfile(null);
    setUserPlan(null);
    setHasCompletedOnboarding(false);
    setStartupStage('splash');
    setActiveTab('login');
  }

  if (startupStage === 'splash') {
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    return <Auth onAuthed={handleAuthed} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
      case 'dashboard':
        return (
          <Dashboard
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            plan={userPlan}
            onRegenerate={handleRegeneratePlan}
            regenerating={regenerating}
            setActiveTab={setActiveTab}
            onAskAI={handleAskAI}
            setExerciseModal={setExerciseModalData}
          />
        );
      case 'workout':
        return (
          <WorkoutPlanner
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            plan={userPlan}
            onAskAI={handleAskAI}
            setExerciseModal={setExerciseModalData}
          />
        );
      case 'diet':
        return (
          <DietPlanner
            userProfile={userProfile}
            plan={userPlan}
            onAskAI={handleAskAI}
          />
        );
      case 'exercises':
        return (
          <ExerciseLibrary
            setExerciseModal={setExerciseModalData}
            onAskAI={handleAskAI}
          />
        );
      case 'aicoach':
        return (
          <AICoach
            userProfile={userProfile}
            pendingQuery={pendingAIQuery}
            setPendingQuery={setPendingAIQuery}
          />
        );
      case 'progress':
        return <Progress userProfile={userProfile} />;
      case 'profile':
        return (
          <Assessment
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            setUserPlan={setUserPlan}
            onComplete={handleAssessmentComplete}
            onboarding={false}
          />
        );
      default:
        return (
          <Dashboard
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            plan={userPlan}
            onRegenerate={handleRegeneratePlan}
            regenerating={regenerating}
            setActiveTab={setActiveTab}
            onAskAI={handleAskAI}
            setExerciseModal={setExerciseModalData}
          />
        );
    }
  };

  if (!hasCompletedOnboarding) {
    return (
      <Assessment
        userProfile={userProfile}
        setUserProfile={setUserProfile}
        setUserPlan={setUserPlan}
        onComplete={handleAssessmentComplete}
        onboarding
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-sans relative selection:bg-volt-lime selection:text-black">
      {/* Interactive Custom Cursor */}
      <CustomCursor />

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onSelect={(tabId) => {
          setActiveTab(tabId);
          setCmdOpen(false);
        }}
      />

      <DisclaimerBanner />

      <div className="flex flex-1 relative">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          sessionEmail={sessionEmail}
          onCommandPalette={() => setCmdOpen(true)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <Navbar
            activeTab={activeTab}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onQuickChat={() => handleAskAI('Give me a high-intensity workout check-in for today!')}
            onLogout={handleLogout}
            onCommandPalette={() => setCmdOpen(true)}
          />

          <main className={`flex-1 w-full mx-auto p-4 sm:p-6 lg:p-8 ${activeTab === 'aicoach' ? 'max-w-none' : 'max-w-7xl'}`}>
            <div key={activeTab} className="animate-slideUpFade">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>

      {exerciseModalData && (
        <ExerciseModal
          exercise={exerciseModalData}
          onClose={() => setExerciseModalData(null)}
          onAskAI={handleAskAI}
        />
      )}
    </div>
  );
}
