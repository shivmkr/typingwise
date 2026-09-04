import { UserProfile, TypingSession, RevisionTopic, UserBadge } from '../types';

const STORAGE_KEY = 'typewise_user_profile_v1';

export const DEFAULT_BADGES: UserBadge[] = [
  {
    id: 'first_test',
    title: 'First Step',
    description: 'Complete your first educational typing session.',
    icon: '🏆',
    unlocked: false,
    category: 'milestone'
  },
  {
    id: 'speed_master',
    title: 'Speed Master',
    description: 'Reach 80 WPM or higher in any typing session.',
    icon: '⚡',
    unlocked: false,
    category: 'speed'
  },
  {
    id: 'accuracy_master',
    title: 'Accuracy Master',
    description: 'Achieve 98% or higher accuracy on a session.',
    icon: '🎯',
    unlocked: false,
    category: 'accuracy'
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'Practice consistently for 7 consecutive days.',
    icon: '🔥',
    unlocked: false,
    category: 'streak'
  },
  {
    id: 'knowledge_explorer',
    title: 'Knowledge Explorer',
    description: 'Complete typing sessions across 5 different topics.',
    icon: '📚',
    unlocked: false,
    category: 'knowledge'
  },
  {
    id: 'quiz_ace',
    title: 'Recall Ace',
    description: 'Score 100% on a post-typing knowledge quiz.',
    icon: '🧠',
    unlocked: false,
    category: 'knowledge'
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Type over 1,000 total educational words.',
    icon: '✨',
    unlocked: false,
    category: 'milestone'
  },
  {
    id: 'revision_hero',
    title: 'Memory Keeper',
    description: 'Complete a spaced revision session for a previously learned topic.',
    icon: '🔄',
    unlocked: false,
    category: 'milestone'
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  id: 'student_' + Math.random().toString(36).substring(2, 9),
  name: 'Student Learner',
  avatar: '🎓',
  goals: {
    targetWpm: 70,
    dailyMinutes: 15,
    dailySessions: 3,
  },
  soundEnabled: true,
  theme: 'light',
  currentStreak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  bestWpm: 0,
  totalWordsTyped: 0,
  totalTimeSeconds: 0,
  totalSessions: 0,
  sessions: [],
  revisionTopics: [],
  badges: DEFAULT_BADGES,
  appreciationsSent: 0,
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveUserProfile(DEFAULT_PROFILE);
      return DEFAULT_PROFILE;
    }
    const parsed: UserProfile = JSON.parse(raw);
    
    // Ensure badges array is complete with any new badges
    const existingBadgeIds = new Set(parsed.badges?.map(b => b.id) || []);
    const mergedBadges = [
      ...(parsed.badges || []),
      ...DEFAULT_BADGES.filter(b => !existingBadgeIds.has(b.id))
    ];

    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      badges: mergedBadges,
    };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile:', err);
  }
}

export function updateStreak(profile: UserProfile): UserProfile {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.lastActiveDate;

  if (lastActive === today) {
    return profile; // Already active today
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let newStreak = profile.currentStreak;

  if (lastActive === yesterday) {
    newStreak += 1;
  } else if (!lastActive) {
    newStreak = 1;
  } else {
    // Gap day
    newStreak = 1;
  }

  const updated: UserProfile = {
    ...profile,
    currentStreak: newStreak,
    lastActiveDate: today,
  };

  saveUserProfile(updated);
  return updated;
}

export function recordSession(profile: UserProfile, session: TypingSession): { updatedProfile: UserProfile; newlyUnlockedBadges: UserBadge[] } {
  let p = updateStreak(profile);
  const updatedSessions = [session, ...p.sessions];

  const totalWords = p.totalWordsTyped + session.wordCount;
  const totalTime = p.totalTimeSeconds + session.durationSeconds;
  const bestWpm = Math.max(p.bestWpm, session.wpm);
  const totalSessions = p.totalSessions + 1;

  // Manage Revision list if topic session
  let revisionList = [...p.revisionTopics];
  if (session.mode === 'topic' && session.topicTitle) {
    const existingIndex = revisionList.findIndex(r => r.topicTitle.toLowerCase() === session.topicTitle.toLowerCase());
    const now = Date.now();
    const nextInterval = existingIndex >= 0 ? 86400000 * 3 : 86400000 * 1; // 1 day first, 3 days next

    if (existingIndex >= 0) {
      const existing = revisionList[existingIndex];
      revisionList[existingIndex] = {
        ...existing,
        lastPracticed: now,
        nextRevisionDue: now + nextInterval,
        timesPracticed: existing.timesPracticed + 1,
        avgWpm: Math.round((existing.avgWpm + session.wpm) / 2),
        bestAccuracy: Math.max(existing.bestAccuracy, session.accuracy),
        masteryLevel: Math.min(5, existing.masteryLevel + 1),
      };
    } else {
      revisionList.push({
        topicTitle: session.topicTitle,
        category: 'Learned Topic',
        firstLearned: now,
        lastPracticed: now,
        nextRevisionDue: now + nextInterval,
        timesPracticed: 1,
        avgWpm: session.wpm,
        bestAccuracy: session.accuracy,
        masteryLevel: 1,
        sampleSnippet: `Practiced on ${session.dateStr} at ${session.wpm} WPM`,
      });
    }
  }

  // Check badges
  const newlyUnlocked: UserBadge[] = [];
  const uniqueTopics = new Set(updatedSessions.filter(s => s.mode === 'topic').map(s => s.topicTitle)).size;

  const updatedBadges = p.badges.map(badge => {
    if (badge.unlocked) return badge;

    let unlock = false;
    if (badge.id === 'first_test' && totalSessions >= 1) unlock = true;
    if (badge.id === 'speed_master' && session.wpm >= 80) unlock = true;
    if (badge.id === 'accuracy_master' && session.accuracy >= 98 && session.wordCount >= 50) unlock = true;
    if (badge.id === 'streak_7' && p.currentStreak >= 7) unlock = true;
    if (badge.id === 'knowledge_explorer' && uniqueTopics >= 5) unlock = true;
    if (badge.id === 'quiz_ace' && session.quizScore !== undefined && session.quizTotal && session.quizScore === session.quizTotal) unlock = true;
    if (badge.id === 'century_club' && totalWords >= 1000) unlock = true;
    if (badge.id === 'revision_hero' && session.mode === 'topic' && revisionList.some(r => r.topicTitle === session.topicTitle && r.timesPracticed > 1)) unlock = true;

    if (unlock) {
      const unlockedBadge = { ...badge, unlocked: true, unlockedAt: Date.now() };
      newlyUnlocked.push(unlockedBadge);
      return unlockedBadge;
    }
    return badge;
  });

  const finalProfile: UserProfile = {
    ...p,
    bestWpm,
    totalWordsTyped: totalWords,
    totalTimeSeconds: totalTime,
    totalSessions,
    sessions: updatedSessions,
    revisionTopics: revisionList,
    badges: updatedBadges,
  };

  saveUserProfile(finalProfile);
  return { updatedProfile: finalProfile, newlyUnlockedBadges: newlyUnlocked };
}
