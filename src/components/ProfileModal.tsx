import React, { useState } from 'react';
import { X, Check, Target, Clock, User, Award, Flame, Zap } from 'lucide-react';
import { UserProfile } from '../types';
import { soundFx } from '../utils/audio';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

const AVATAR_OPTIONS = ['🎓', '🚀', '🔬', '💻', '🧠', '⚡', '📚', '🏆', '🎨', '🌟'];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [targetWpm, setTargetWpm] = useState(profile.goals.targetWpm);
  const [dailyMinutes, setDailyMinutes] = useState(profile.goals.dailyMinutes);

  const handleSave = () => {
    soundFx.playKeyClick();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Student Learner',
      avatar: selectedAvatar,
      goals: {
        ...profile.goals,
        targetWpm: Number(targetWpm) || 70,
        dailyMinutes: Number(dailyMinutes) || 15,
      },
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div 
        id="user-profile-modal"
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Student Profile & Goals
            </h2>
          </div>
          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Choose Avatar
          </label>
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {AVATAR_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  soundFx.playKeyClick();
                  setSelectedAvatar(emoji);
                }}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all shrink-0 ${
                  selectedAvatar === emoji
                    ? 'bg-indigo-600 text-white shadow-md scale-105 ring-2 ring-indigo-300'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Student Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Display Name
          </label>
          <input
            id="profile-name-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name or handle"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500/40 focus:outline-hidden"
          />
        </div>

        {/* Personalized Goal Tracking */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
              Personalized Learning Goals
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Target Speed (WPM)
              </label>
              <input
                id="profile-target-wpm-input"
                type="number"
                min="20"
                max="180"
                value={targetWpm}
                onChange={(e) => setTargetWpm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Daily Study (Minutes)
              </label>
              <input
                id="profile-daily-minutes-input"
                type="number"
                min="5"
                max="120"
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold"
              />
            </div>
          </div>
        </div>

        {/* Current Stats Summary */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs py-1">
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Best WPM</span>
            <div className="text-base font-black text-indigo-600 dark:text-indigo-400 mt-0.5">
              {profile.bestWpm}
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Streak</span>
            <div className="text-base font-black text-amber-500 mt-0.5">
              {profile.currentStreak}d
            </div>
          </div>
          <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
            <span className="text-slate-400 text-[10px] uppercase font-bold">Topics</span>
            <div className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {profile.revisionTopics.length}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            id="save-profile-btn"
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Save Profile
          </button>
        </div>

      </div>
    </div>
  );
};
