import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { TopicTypingView } from './components/TopicTypingView';
import { SpeedTestView } from './components/SpeedTestView';
import { TypingGamesView } from './components/TypingGamesView';
import { RevisionMemoryView } from './components/RevisionMemoryView';
import { DashboardView } from './components/DashboardView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileModal } from './components/ProfileModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { AppView, UserProfile, TypingSession, UserBadge } from './types';
import { loadUserProfile, saveUserProfile, recordSession } from './utils/storage';
import { soundFx } from './utils/audio';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(loadUserProfile);
  const [currentView, setCurrentView] = useState<AppView>('learn');
  const [activeRevisionTopic, setActiveRevisionTopic] = useState<string | undefined>(undefined);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  
  // Unlocked badge toast banner
  const [recentBadgeUnlock, setRecentBadgeUnlock] = useState<UserBadge | null>(null);

  // Synchronize dark mode class on HTML root element
  useEffect(() => {
    const root = document.documentElement;
    if (profile.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    soundFx.setEnabled(profile.soundEnabled);
  }, [profile.theme, profile.soundEnabled]);

  // Global PC keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileModalOpen(false);
        setIsShortcutsModalOpen(false);
        return;
      }

      if (e.altKey) {
        if (e.key === '1') {
          e.preventDefault();
          setActiveRevisionTopic(undefined);
          setCurrentView('learn');
        } else if (e.key === '2') {
          e.preventDefault();
          setCurrentView('speed_test');
        } else if (e.key === '3') {
          e.preventDefault();
          setCurrentView('games');
        } else if (e.key === '4') {
          e.preventDefault();
          setCurrentView('revision');
        } else if (e.key === '5') {
          e.preventDefault();
          setCurrentView('dashboard');
        } else if (e.key === '6') {
          e.preventDefault();
          setCurrentView('leaderboard');
        } else if (e.key.toLowerCase() === 't') {
          e.preventDefault();
          handleToggleTheme();
        } else if (e.key.toLowerCase() === 's') {
          e.preventDefault();
          handleToggleSound();
        } else if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          setIsProfileModalOpen(prev => !prev);
        } else if (e.key.toLowerCase() === 'k' || e.key === '?') {
          e.preventDefault();
          setIsShortcutsModalOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [profile.theme, profile.soundEnabled]);

  // Toggle dark/light theme
  const handleToggleTheme = () => {
    soundFx.playKeyClick();
    const nextTheme = profile.theme === 'dark' ? 'light' : 'dark';
    const updated = { ...profile, theme: nextTheme };
    setProfile(updated);
    saveUserProfile(updated);
  };

  // Toggle typing audio effects
  const handleToggleSound = () => {
    const nextSound = !profile.soundEnabled;
    soundFx.setEnabled(nextSound);
    const updated = { ...profile, soundEnabled: nextSound };
    setProfile(updated);
    saveUserProfile(updated);
  };

  // Save profile updates from modal or dashboard
  const handleSaveProfile = (updated: UserProfile) => {
    setProfile(updated);
    saveUserProfile(updated);
  };

  // Record completed session
  const handleSessionComplete = (session: TypingSession) => {
    const { updatedProfile, newlyUnlockedBadges } = recordSession(profile, session);
    setProfile(updatedProfile);

    // If a badge was unlocked, show celebration banner
    if (newlyUnlockedBadges.length > 0) {
      setRecentBadgeUnlock(newlyUnlockedBadges[0]);
      soundFx.playFanfare();
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.4 }
        });
      } catch {}

      setTimeout(() => {
        setRecentBadgeUnlock(null);
      }, 5000);
    }
  };

  // Switch to learn view for a specific topic
  const handleSelectTopicFromRevision = (topicTitle: string) => {
    setActiveRevisionTopic(topicTitle);
    setCurrentView('learn');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => {
          if (v !== 'learn') {
            setActiveRevisionTopic(undefined);
          }
          setCurrentView(v);
        }}
        profile={profile}
        onToggleTheme={handleToggleTheme}
        onToggleSound={handleToggleSound}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
      />

      {/* Achievement Unlocked Toast Banner */}
      {recentBadgeUnlock && (
        <div className="sticky top-16 z-50 max-w-md mx-auto mt-3 px-4 animate-bounce">
          <div className="p-4 rounded-2xl bg-amber-500 text-slate-950 shadow-xl border-2 border-amber-300 flex items-center gap-3">
            <span className="text-3xl">{recentBadgeUnlock.icon}</span>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-950/80">
                Badge Unlocked!
              </div>
              <div className="font-extrabold text-sm">
                {recentBadgeUnlock.title}
              </div>
              <div className="text-xs text-slate-950/80">
                {recentBadgeUnlock.description}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'learn' && (
          <TopicTypingView
            profile={profile}
            onSessionComplete={handleSessionComplete}
            initialTopicTitle={activeRevisionTopic}
          />
        )}

        {currentView === 'speed_test' && (
          <SpeedTestView
            profile={profile}
            onSessionComplete={handleSessionComplete}
          />
        )}

        {currentView === 'games' && (
          <TypingGamesView />
        )}

        {currentView === 'revision' && (
          <RevisionMemoryView
            profile={profile}
            onSelectTopicForRevision={handleSelectTopicFromRevision}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            profile={profile}
            onSelectTopic={handleSelectTopicFromRevision}
            onUpdateProfile={handleSaveProfile}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView
            profile={profile}
            onProfileUpdated={handleSaveProfile}
          />
        )}
      </main>

      {/* Educational Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-6 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xs text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">TypeWise</span>
            <span>•</span>
            <span>“Type what you want to learn, and learn while you type.”</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Wikipedia Educational Integration</span>
            <span>•</span>
            <span>Spaced Memory System</span>
            <span>•</span>
            <span>Academic Typing Analytics</span>
          </div>
        </div>
      </footer>

      {/* Profile & Goal Settings Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* PC Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

    </div>
  );
}
