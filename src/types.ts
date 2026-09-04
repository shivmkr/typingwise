export type PracticeLevel = 'quick' | 'standard' | 'deep';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type AppView = 'learn' | 'speed_test' | 'games' | 'revision' | 'dashboard' | 'leaderboard';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicPassages {
  quick: string;
  standard: string;
  deep: string;
}

export interface TopicContent {
  title: string;
  category?: string;
  thumbnail?: string | null;
  difficulty: DifficultyLevel;
  wordCounts: {
    quick: number;
    standard: number;
    deep: number;
  };
  passages: TopicPassages;
  keyTakeaways: string[];
  quiz: QuizQuestion[];
}

export interface TypingSession {
  id: string;
  topicTitle: string;
  mode: 'topic' | 'speed_test' | 'game_word_race' | 'game_time_attack' | 'game_survival';
  level?: PracticeLevel;
  difficulty?: DifficultyLevel;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
  durationSeconds: number;
  timestamp: number;
  dateStr: string;
  quizScore?: number;
  quizTotal?: number;
  wordCount: number;
}

export interface RevisionTopic {
  topicTitle: string;
  category: string;
  firstLearned: number;
  lastPracticed: number;
  nextRevisionDue: number;
  timesPracticed: number;
  avgWpm: number;
  bestAccuracy: number;
  masteryLevel: number; // 1 to 5 stars
  sampleSnippet: string;
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  category: 'speed' | 'accuracy' | 'streak' | 'knowledge' | 'milestone';
}

export interface UserGoals {
  targetWpm: number;
  dailyMinutes: number;
  dailySessions: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  goals: UserGoals;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
  currentStreak: number;
  lastActiveDate: string;
  bestWpm: number;
  totalWordsTyped: number;
  totalTimeSeconds: number;
  totalSessions: number;
  sessions: TypingSession[];
  revisionTopics: RevisionTopic[];
  badges: UserBadge[];
  appreciationsSent: number;
}

export interface LeaderboardPeer {
  id: string;
  name: string;
  avatar: string;
  wpm: number;
  accuracy: number;
  streak: number;
  topicsLearned: number;
  badge: string;
  appreciations: number;
  userAppreciated?: boolean;
}
