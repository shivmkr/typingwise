import React from 'react';
import { Keyboard, X, Sparkles, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Alt + 1', description: 'Go to Learn & Type (Wikipedia topics)', category: 'Navigation' },
    { key: 'Alt + 2', description: 'Go to Speed Test', category: 'Navigation' },
    { key: 'Alt + 3', description: 'Go to Typing Games (Word Race, Time Attack, Survival)', category: 'Navigation' },
    { key: 'Alt + 4', description: 'Go to Memory & Revision Library', category: 'Navigation' },
    { key: 'Alt + 5', description: 'Go to Student Dashboard & Analytics', category: 'Navigation' },
    { key: 'Alt + 6', description: 'Go to Community Leaderboard', category: 'Navigation' },
    { key: 'Alt + T', description: 'Toggle Light / Dark Theme', category: 'Settings' },
    { key: 'Alt + S', description: 'Toggle Typing Sound Effects (Mute / Unmute)', category: 'Settings' },
    { key: 'Alt + P', description: 'Open Profile & Practice Goals Settings', category: 'Settings' },
    { key: 'Alt + K', description: 'Show / Hide Keyboard Shortcuts', category: 'Help' },
    { key: 'Esc', description: 'Close any open modal dialog', category: 'General' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                PC Keyboard Shortcuts
              </h2>
              <p className="text-xs text-slate-500">
                Quick commands to navigate and change settings instantly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
          {shortcuts.map((sc, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  {sc.description}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {sc.key.split(' + ').map((part, pIdx) => (
                  <React.Fragment key={pIdx}>
                    <kbd className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs font-mono font-bold text-[11px] text-indigo-600 dark:text-indigo-400">
                      {part}
                    </kbd>
                    {pIdx < sc.key.split(' + ').length - 1 && (
                      <span className="text-slate-400 text-xs">+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between text-xs text-slate-500">
          <span>Tip: Hover over any button to see its keyboard shortcut.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
