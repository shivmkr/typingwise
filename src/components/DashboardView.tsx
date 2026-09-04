import React, { useState } from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  Target, 
  Award, 
  TrendingUp, 
  Check, 
  BookOpen, 
  Zap, 
  Calendar,
  Lock,
  Sparkles,
  ChevronRight,
  Edit3,
  Save,
  X,
  CheckCircle2,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { UserProfile, UserBadge, TypingSession } from '../types';
import { soundFx } from '../utils/audio';

interface DashboardViewProps {
  profile: UserProfile;
  onSelectTopic: (topic: string) => void;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  profile, 
  onSelectTopic,
  onUpdateProfile 
}) => {
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editTargetWpm, setEditTargetWpm] = useState(profile.goals.targetWpm);
  const [editDailyMinutes, setEditDailyMinutes] = useState(profile.goals.dailyMinutes);
  const [editDailySessions, setEditDailySessions] = useState(profile.goals.dailySessions || 5);
  const [editAvatar, setEditAvatar] = useState(profile.avatar || '🎓');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Graph state: active hovered session index
  const [hoveredSessionIdx, setHoveredSessionIdx] = useState<number | null>(null);
  const [sessionFilter, setSessionFilter] = useState<'last10' | 'last20' | 'all'>('last10');

  // Format total practice time
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${Math.max(1, minutes)}m`;
  };

  // Compute stats
  const sessions = profile.sessions || [];
  const avgWpm = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.wpm, 0) / sessions.length) 
    : 0;
  const bestWpm = profile.bestWpm || 0;
  const avgAccuracy = sessions.length > 0 
    ? Math.round(sessions.reduce((acc, s) => acc + s.accuracy, 0) / sessions.length) 
    : 100;
  const totalWords = profile.totalWordsTyped || 0;
  const totalTime = profile.totalTimeSeconds || 0;
  const streak = profile.currentStreak || 1;

  // Days of week for streak visualization
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const currentDayIndex = (new Date().getDay() + 6) % 7;

  // Save profile modifications
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playFanfare();
    const updated: UserProfile = {
      ...profile,
      name: editName.trim() || 'Learner',
      avatar: editAvatar,
      goals: {
        targetWpm: Math.max(20, Math.min(200, Number(editTargetWpm))),
        dailyMinutes: Math.max(5, Math.min(180, Number(editDailyMinutes))),
        dailySessions: Math.max(1, Math.min(50, Number(editDailySessions))),
      }
    };
    onUpdateProfile(updated);
    setIsEditing(false);
    setSaveMessage('Profile and practice goals saved successfully!');
    setTimeout(() => setSaveMessage(null), 4000);
  };

  // Filtered sessions for progression graph
  let displaySessions: TypingSession[] = [];
  if (sessionFilter === 'last10') {
    displaySessions = sessions.slice(-10);
  } else if (sessionFilter === 'last20') {
    displaySessions = sessions.slice(-20);
  } else {
    displaySessions = sessions;
  }

  // Dual-axis Graph Dimensions & Calculations
  const graphWidth = 720;
  const graphHeight = 260;
  const paddingLeft = 55;
  const paddingRight = 55;
  const paddingTop = 30;
  const paddingBottom = 45;

  const innerWidth = graphWidth - paddingLeft - paddingRight;
  const innerHeight = graphHeight - paddingTop - paddingBottom;

  // Max scale for speed (left axis)
  const maxWpmValue = Math.max(
    80,
    ...displaySessions.map(s => s.wpm),
    profile.goals.targetWpm + 10
  );

  // Helper to map session to X coordinate
  const getX = (idx: number) => {
    if (displaySessions.length <= 1) return paddingLeft + innerWidth / 2;
    return paddingLeft + (idx / (displaySessions.length - 1)) * innerWidth;
  };

  // Helper to map WPM to Y coordinate (Left Axis: 0 to maxWpmValue)
  const getY_Wpm = (wpm: number) => {
    const clamped = Math.max(0, Math.min(maxWpmValue, wpm));
    return paddingTop + innerHeight - (clamped / maxWpmValue) * innerHeight;
  };

  // Helper to map Accuracy to Y coordinate (Right Axis: 0 to 100%)
  const getY_Acc = (acc: number) => {
    const clamped = Math.max(0, Math.min(100, acc));
    return paddingTop + innerHeight - (clamped / 100) * innerHeight;
  };

  // SVG polyline points
  const wpmPoints = displaySessions
    .map((s, i) => `${getX(i)},${getY_Wpm(s.wpm)}`)
    .join(' ');

  const accPoints = displaySessions
    .map((s, i) => `${getX(i)},${getY_Acc(s.accuracy)}`)
    .join(' ');

  const targetY = getY_Wpm(profile.goals.targetWpm);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Student Welcome & Profile Card (View or Edit Mode) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        {saveMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {!isEditing ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center text-4xl shadow-xs">
                {profile.avatar || '🎓'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                    {profile.name}'s Dashboard
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                    Student Active
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Track typing velocity, spaced retention, and study goals in real time.
                </p>
              </div>
            </div>

            {/* Goal Pill & Edit Button */}
            <div className="flex items-center gap-3 self-stretch sm:self-auto flex-wrap">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Goal Target</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {profile.goals.targetWpm} WPM
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Daily Practice</span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                    {profile.goals.dailyMinutes} min
                  </span>
                </div>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">Daily Sessions</span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400 text-sm">
                    {profile.goals.dailySessions || 5}
                  </span>
                </div>
              </div>

              <button
                id="edit-profile-btn"
                onClick={() => {
                  soundFx.playKeyClick();
                  setEditName(profile.name);
                  setEditTargetWpm(profile.goals.targetWpm);
                  setEditDailyMinutes(profile.goals.dailyMinutes);
                  setEditDailySessions(profile.goals.dailySessions || 5);
                  setEditAvatar(profile.avatar || '🎓');
                  setIsEditing(true);
                }}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile & Goals</span>
              </button>
            </div>
          </div>
        ) : (
          /* Inline Editable Profile Form */
          <form onSubmit={handleSaveProfile} className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border-2 border-indigo-200 dark:border-indigo-800 space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-indigo-100 dark:border-indigo-900 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Edit Profile & Learning Targets
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Student Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Student Name
                </label>
                <input
                  id="profile-edit-name-input"
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Target WPM */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Speed Goal (WPM)
                </label>
                <input
                  id="profile-edit-wpm-input"
                  type="number"
                  min="20"
                  max="200"
                  value={editTargetWpm}
                  onChange={(e) => setEditTargetWpm(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Daily Practice Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daily Practice (Minutes)
                </label>
                <input
                  id="profile-edit-minutes-input"
                  type="number"
                  min="5"
                  max="180"
                  value={editDailyMinutes}
                  onChange={(e) => setEditDailyMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-emerald-600 dark:text-emerald-400 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Daily Sessions Target */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Daily Sessions Goal
                </label>
                <input
                  id="profile-edit-sessions-input"
                  type="number"
                  min="1"
                  max="50"
                  value={editDailySessions}
                  onChange={(e) => setEditDailySessions(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Choose Avatar Icon:
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {['🎓', '🚀', '💡', '⚡', '📚', '🧠', '🏆', '🌟', '💻', '🎯'].map(icon => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setEditAvatar(icon)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                      editAvatar === icon 
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 scale-110 shadow-sm' 
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Save / Cancel Controls */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                id="save-profile-changes-btn"
                type="submit"
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Average WPM */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Average Speed</span>
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {avgWpm} <span className="text-xs font-bold text-slate-400">WPM</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Peak: <strong className="text-slate-700 dark:text-slate-300">{bestWpm} WPM</strong>
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Accuracy Rate</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {avgAccuracy}%
          </div>
          <div className="text-[11px] text-slate-400">
            Across {sessions.length} sessions
          </div>
        </div>

        {/* Practice Time */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Study & Type Time</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
            {formatTime(totalTime)}
          </div>
          <div className="text-[11px] text-slate-400">
            {totalWords.toLocaleString()} educational words
          </div>
        </div>

        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {streak} <span className="text-xs font-bold text-slate-400">days</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Daily practice maintained
          </div>
        </div>

      </div>

      {/* 7-DAY PRACTICE STREAK CALENDAR */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              7-Day Practice Streak Calendar
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Daily consistency drives rapid keyboard and academic mastery
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-3 text-center">
          {daysOfWeek.map((day, idx) => {
            const isCompleted = idx <= currentDayIndex && (currentDayIndex - idx < streak);
            const isToday = idx === currentDayIndex;

            return (
              <div 
                key={day}
                className={`p-3 sm:p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  isToday 
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20' 
                    : isCompleted
                    ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {day}
                </span>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCompleted
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : '·'}
                </div>

                {isToday && (
                  <span className="text-[9px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400">
                    Today
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DUAL-AXIS TYPING PROGRESSION GRAPH (Time on X, Speed & Accuracy on Y) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Typing Progression: Speed (WPM) & Accuracy (%) Over Time
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              X-Axis: Practice Time & Date | Left Y-Axis: Speed (WPM) | Right Y-Axis: Accuracy (%)
            </p>
          </div>

          {/* Session filter and Legend */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                <span>Speed (WPM)</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                <span>Accuracy (%)</span>
              </span>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
              {(['last10', 'last20', 'all'] as const).map(filt => (
                <button
                  key={filt}
                  onClick={() => setSessionFilter(filt)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    sessionFilter === filt
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {filt === 'last10' ? 'Last 10' : filt === 'last20' ? 'Last 20' : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {displaySessions.length > 0 ? (
          <div className="relative overflow-x-auto pt-2">
            
            {/* SVG Dual-Axis Chart */}
            <div className="min-w-[640px]">
              <svg 
                viewBox={`0 0 ${graphWidth} ${graphHeight}`} 
                className="w-full h-auto overflow-visible select-none"
              >
                <defs>
                  {/* Indigo gradient for WPM area */}
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Emerald gradient for Accuracy area */}
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines & Y-Axis values */}
                {[0, 25, 50, 75, 100].map((pct) => {
                  const y = paddingTop + innerHeight - (pct / 100) * innerHeight;
                  const leftVal = Math.round((pct / 100) * maxWpmValue);
                  const rightVal = `${pct}%`;

                  return (
                    <g key={pct}>
                      <line 
                        x1={paddingLeft} 
                        y1={y} 
                        x2={graphWidth - paddingRight} 
                        y2={y} 
                        stroke="currentColor" 
                        className="text-slate-200 dark:text-slate-800"
                        strokeDasharray="4 4"
                      />
                      {/* Left Axis Label (Speed WPM) */}
                      <text 
                        x={paddingLeft - 8} 
                        y={y + 4} 
                        textAnchor="end" 
                        className="text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400"
                      >
                        {leftVal}
                      </text>
                      {/* Right Axis Label (Accuracy %) */}
                      <text 
                        x={graphWidth - paddingRight + 8} 
                        y={y + 4} 
                        textAnchor="start" 
                        className="text-[10px] font-bold fill-emerald-600 dark:fill-emerald-400"
                      >
                        {rightVal}
                      </text>
                    </g>
                  );
                })}

                {/* Left Y Axis Title */}
                <text
                  x={15}
                  y={paddingTop - 12}
                  className="text-[10px] font-black uppercase tracking-wider fill-indigo-600 dark:fill-indigo-400"
                >
                  WPM &uarr;
                </text>

                {/* Right Y Axis Title */}
                <text
                  x={graphWidth - 15}
                  y={paddingTop - 12}
                  textAnchor="end"
                  className="text-[10px] font-black uppercase tracking-wider fill-emerald-600 dark:fill-emerald-400"
                >
                  Acc % &uarr;
                </text>

                {/* Target WPM dashed line */}
                <line
                  x1={paddingLeft}
                  y1={targetY}
                  x2={graphWidth - paddingRight}
                  y2={targetY}
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                />
                <text
                  x={paddingLeft + 6}
                  y={targetY - 5}
                  className="text-[9px] font-bold fill-purple-600 dark:fill-purple-400"
                >
                  Target Goal: {profile.goals.targetWpm} WPM
                </text>

                {/* Speed (WPM) Polyline */}
                {displaySessions.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={wpmPoints}
                  />
                )}

                {/* Accuracy (%) Polyline */}
                {displaySessions.length > 1 && (
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={accPoints}
                  />
                )}

                {/* Data Points and Interaction Circles */}
                {displaySessions.map((sess, i) => {
                  const cx = getX(i);
                  const cy_wpm = getY_Wpm(sess.wpm);
                  const cy_acc = getY_Acc(sess.accuracy);
                  const isHovered = hoveredSessionIdx === i;

                  // Format practice time for X axis label
                  const dateObj = new Date(sess.timestamp || Date.now());
                  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

                  return (
                    <g key={i} className="cursor-pointer">
                      {/* Vertical indicator line when hovered */}
                      {isHovered && (
                        <line
                          x1={cx}
                          y1={paddingTop}
                          x2={cx}
                          y2={paddingTop + innerHeight}
                          stroke="#6366f1"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Speed dot (Indigo) */}
                      <circle
                        cx={cx}
                        cy={cy_wpm}
                        r={isHovered ? 6 : 4.5}
                        fill="#6366f1"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all"
                      />

                      {/* Accuracy dot (Emerald) */}
                      <circle
                        cx={cx}
                        cy={cy_acc}
                        r={isHovered ? 6 : 4}
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all"
                      />

                      {/* Hit target for easier mouse hover */}
                      <rect
                        x={cx - (innerWidth / displaySessions.length) / 2}
                        y={paddingTop}
                        width={innerWidth / Math.max(1, displaySessions.length)}
                        height={innerHeight}
                        fill="transparent"
                        onMouseEnter={() => setHoveredSessionIdx(i)}
                        onMouseLeave={() => setHoveredSessionIdx(null)}
                      />

                      {/* X-axis time label */}
                      <text
                        x={cx}
                        y={paddingTop + innerHeight + 16}
                        textAnchor="middle"
                        className={`text-[9px] transition-colors ${
                          isHovered 
                            ? 'font-extrabold fill-indigo-600 dark:fill-indigo-400' 
                            : 'font-medium fill-slate-400 dark:fill-slate-500'
                        }`}
                      >
                        {timeStr}
                      </text>
                      <text
                        x={cx}
                        y={paddingTop + innerHeight + 28}
                        textAnchor="middle"
                        className="text-[8px] fill-slate-400/80"
                      >
                        {dateStr}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Hover Tooltip Overlay */}
            {hoveredSessionIdx !== null && displaySessions[hoveredSessionIdx] && (
              <div 
                className="p-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 text-xs space-y-1 max-w-xs mt-2 mx-auto animate-fadeIn"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                  <span className="font-bold text-indigo-400">
                    {displaySessions[hoveredSessionIdx].topicTitle}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(displaySessions[hoveredSessionIdx].timestamp).toLocaleString([], { 
                      month: 'short', 
                      day: 'numeric', 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Typing Speed:</span>
                    <strong className="text-indigo-400 font-extrabold text-sm">
                      {displaySessions[hoveredSessionIdx].wpm} WPM
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Accuracy:</span>
                    <strong className="text-emerald-400 font-extrabold text-sm">
                      {displaySessions[hoveredSessionIdx].accuracy}%
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Duration:</span>
                    <span className="text-slate-200 font-medium">
                      {displaySessions[hoveredSessionIdx].durationSeconds} sec
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Errors:</span>
                    <span className="text-rose-400 font-medium">
                      {displaySessions[hoveredSessionIdx].errors}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-4 border-t border-slate-100 dark:border-slate-800">
              <span>X-Axis shows the exact time each practice was completed</span>
              <span>Left Axis: Speed (WPM) • Right Axis: Accuracy (%)</span>
            </div>
          </div>
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-xs text-slate-400 space-y-2">
            <TrendingUp className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            <p>Complete your first typing test to see your speed and accuracy plotted over time!</p>
          </div>
        )}
      </div>

      {/* TOPICS PRACTICED & BADGES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Topics Practiced List */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Practiced Topics
            </h2>
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {profile.revisionTopics.length > 0 ? (
              profile.revisionTopics.map((topic, i) => (
                <div
                  key={i}
                  onClick={() => onSelectTopic(topic.topicTitle)}
                  className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50 dark:bg-slate-800/40 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {topic.topicTitle}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {topic.avgWpm} WPM • {topic.bestAccuracy}% acc
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-6 text-center">
                No topics practiced yet. Start typing your favorite topic!
              </div>
            )}
          </div>
        </div>

        {/* Student Badges & Achievements */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Student Badges & Achievements
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {profile.badges.filter(b => b.unlocked).length} / {profile.badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {profile.badges.map(badge => (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border text-center space-y-1.5 transition-all ${
                  badge.unlocked
                    ? 'border-amber-200 dark:border-amber-800/50 bg-amber-50/40 dark:bg-amber-950/20'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 opacity-60'
                }`}
              >
                <div className="text-2xl relative inline-block">
                  {badge.icon}
                  {!badge.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70 rounded-full">
                      <Lock className="w-3 h-3 text-slate-500" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-900 dark:text-white">
                    {badge.title}
                  </h4>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                    {badge.description}
                  </p>
                </div>
                {badge.unlocked && (
                  <span className="inline-block px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 text-[8px] font-extrabold uppercase">
                    Earned
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

