import React from 'react';
import { 
  BookOpen, 
  Timer, 
  Gamepad2, 
  RotateCcw, 
  BarChart3, 
  Trophy, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Flame, 
  User as UserIcon,
  Sparkles,
  Keyboard
} from 'lucide-react';
import { AppView, UserProfile } from '../types';
import { soundFx } from '../utils/audio';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  profile: UserProfile;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onOpenProfile: () => void;
  onOpenShortcuts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  profile,
  onToggleTheme,
  onToggleSound,
  onOpenProfile,
  onOpenShortcuts,
}) => {
  const navItems: { id: AppView; label: string; shortcut: string; icon: React.ReactNode }[] = [
    { id: 'learn', label: 'Learn & Type', shortcut: 'Alt+1', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'speed_test', label: 'Speed Test', shortcut: 'Alt+2', icon: <Timer className="w-4 h-4" /> },
    { id: 'games', label: 'Typing Games', shortcut: 'Alt+3', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'revision', label: 'Memory & Revision', shortcut: 'Alt+4', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', shortcut: 'Alt+5', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'leaderboard', label: 'Leaderboard', shortcut: 'Alt+6', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo"
            onClick={() => onSelectView('learn')} 
            className="flex items-center gap-3 cursor-pointer group shrink-0"
            title="TypeWise - Learn while you type"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  TypeWise
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
                  EDU
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Learn while you type
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    soundFx.playKeyClick();
                    onSelectView(item.id);
                  }}
                  title={`${item.label} (Shortcut: ${item.shortcut})`}
                  className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  <span className="hidden group-hover:inline-block text-[10px] px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                    {item.shortcut}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Streak Badge */}
            <div 
              id="user-streak-pill"
              title={`${profile.currentStreak} day learning streak! Keep practicing daily.`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-700 dark:text-amber-400 text-xs font-bold shadow-xs cursor-default"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span>{profile.currentStreak}d</span>
            </div>

            {/* Keyboard Shortcuts Helper Button */}
            {onOpenShortcuts && (
              <button
                id="shortcuts-toggle-btn"
                onClick={() => {
                  soundFx.playKeyClick();
                  onOpenShortcuts();
                }}
                title="Keyboard Shortcuts (Shortcut: Alt+K)"
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
              >
                <Keyboard className="w-4 h-4" />
              </button>
            )}

            {/* Sound Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={() => {
                onToggleSound();
                soundFx.playKeyClick();
              }}
              title={profile.soundEnabled ? 'Mute Typing Audio (Shortcut: Alt+S)' : 'Enable Typing Audio (Shortcut: Alt+S)'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {profile.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={onToggleTheme}
              title={profile.theme === 'dark' ? 'Switch to Light mode (Shortcut: Alt+T)' : 'Switch to Dark mode (Shortcut: Alt+T)'}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {profile.theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* User Profile Pill */}
            <button
              id="user-profile-button"
              onClick={onOpenProfile}
              title="Profile & Practice Goals Settings (Shortcut: Alt+P)"
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all text-xs font-semibold"
            >
              <span className="text-base">{profile.avatar || '🎓'}</span>
              <span className="hidden sm:inline text-slate-700 dark:text-slate-200 truncate max-w-[100px]">
                {profile.name}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 gap-1">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  soundFx.playKeyClick();
                  onSelectView(item.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive 
                    ? 'bg-indigo-600 text-white font-semibold' 
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
