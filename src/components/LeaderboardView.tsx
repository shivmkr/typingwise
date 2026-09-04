import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Flame, 
  Award, 
  Heart, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Share2, 
  Check, 
  UploadCloud,
  Medal
} from 'lucide-react';
import { LeaderboardPeer, UserProfile } from '../types';
import { soundFx } from '../utils/audio';

interface LeaderboardViewProps {
  profile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
}

const INITIAL_PEERS: LeaderboardPeer[] = [
  { id: 'p1', name: 'Aarav Sharma', avatar: '🎓', wpm: 96, accuracy: 99, streak: 14, topicsLearned: 28, badge: 'Speed Master', appreciations: 42 },
  { id: 'p2', name: 'Elena Rostova', avatar: '🔬', wpm: 92, accuracy: 98, streak: 21, topicsLearned: 34, badge: 'Scholar Typist', appreciations: 38 },
  { id: 'p3', name: 'David Chen', avatar: '💻', wpm: 88, accuracy: 97, streak: 9, topicsLearned: 19, badge: 'Code Typist', appreciations: 29 },
  { id: 'p4', name: 'Priya Patel', avatar: '📚', wpm: 85, accuracy: 99, streak: 18, topicsLearned: 25, badge: 'Accuracy Master', appreciations: 51 },
  { id: 'p5', name: 'Marcus Miller', avatar: '🚀', wpm: 81, accuracy: 96, streak: 6, topicsLearned: 15, badge: 'Cosmos Explorer', appreciations: 19 },
  { id: 'p6', name: 'Sara Tanaka', avatar: '🧠', wpm: 78, accuracy: 98, streak: 11, topicsLearned: 22, badge: 'Neuro Typist', appreciations: 27 },
  { id: 'p7', name: 'Zainab Ahmed', avatar: '⚡', wpm: 75, accuracy: 95, streak: 5, topicsLearned: 12, badge: 'Speed Initiate', appreciations: 14 },
];

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ profile, onProfileUpdated }) => {
  const [tab, setTab] = useState<'weekly' | 'daily' | 'global'>('weekly');
  const [peers, setPeers] = useState<LeaderboardPeer[]>(INITIAL_PEERS);
  const [hasSubmittedScore, setHasSubmittedScore] = useState(false);
  const [appreciatedPeerIds, setAppreciatedPeerIds] = useState<Set<string>>(new Set());

  // Fetch from server or use local peers
  useEffect(() => {
    fetch(`/api/leaderboard?category=${tab}`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
          setPeers(data.leaderboard);
        }
      })
      .catch(() => {
        // Use initial peers
      });
  }, [tab]);

  // Social peer appreciation handler (Give Kudos)
  const handleAppreciate = (peerId: string) => {
    if (appreciatedPeerIds.has(peerId)) return;

    soundFx.playWordDing();
    setAppreciatedPeerIds(prev => new Set(prev).add(peerId));

    // Update state locally
    setPeers(prev => prev.map(peer => {
      if (peer.id === peerId) {
        return { ...peer, appreciations: peer.appreciations + 1, userAppreciated: true };
      }
      return peer;
    }));

    // Micro celebration confetti
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 }
    });

    // Notify backend
    fetch('/api/leaderboard/appreciate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ peerId })
    }).catch(() => {});

    // Update profile appreciations sent
    const updated = {
      ...profile,
      appreciationsSent: (profile.appreciationsSent || 0) + 1
    };
    onProfileUpdated(updated);
  };

  // Submit current student's personal best to the leaderboard
  const handleSubmitMyScore = () => {
    if (hasSubmittedScore || profile.bestWpm === 0) return;
    soundFx.playFanfare();

    const myEntry: LeaderboardPeer = {
      id: profile.id,
      name: profile.name + ' (You)',
      avatar: profile.avatar,
      wpm: profile.bestWpm,
      accuracy: profile.sessions.length > 0 ? profile.sessions[0].accuracy : 98,
      streak: profile.currentStreak,
      topicsLearned: profile.revisionTopics.length,
      badge: profile.bestWpm >= 80 ? 'Speed Master' : 'Knowledge Typist',
      appreciations: 1
    };

    setPeers(prev => [...prev, myEntry].sort((a, b) => b.wpm - a.wpm));
    setHasSubmittedScore(true);

    fetch('/api/leaderboard/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profile.name,
        avatar: profile.avatar,
        wpm: profile.bestWpm,
        accuracy: profile.sessions[0]?.accuracy || 98,
        streak: profile.currentStreak,
        topicsLearned: profile.revisionTopics.length,
        badge: profile.bestWpm >= 80 ? 'Speed Master' : 'Knowledge Typist'
      })
    }).catch(() => {});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              Student Community Leaderboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Celebrate peers, share encouragement with kudos, and challenge classmates in typing mastery.
          </p>
        </div>

        {/* Time Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto">
          {(['weekly', 'daily', 'global'] as const).map(t => (
            <button
              key={t}
              id={`leaderboard-tab-${t}`}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                tab === t
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Your Rank / Submit Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl">
            {profile.avatar}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Your Personal Record: {profile.bestWpm} WPM
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {profile.revisionTopics.length} topics practiced • {profile.currentStreak} day streak
            </p>
          </div>
        </div>

        <button
          id="submit-leaderboard-score-btn"
          disabled={hasSubmittedScore || profile.bestWpm === 0}
          onClick={handleSubmitMyScore}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 ${
            hasSubmittedScore
              ? 'bg-emerald-600 text-white cursor-default'
              : profile.bestWpm > 0
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          {hasSubmittedScore ? (
            <>
              <Check className="w-4 h-4" />
              <span>Published on Board</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Post My High Score</span>
            </>
          )}
        </button>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
          <span>Rank & Student</span>
          <div className="flex items-center gap-8">
            <span className="hidden sm:inline">Topics</span>
            <span className="hidden sm:inline">Accuracy</span>
            <span>Speed</span>
            <span>Appreciate</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {peers.map((peer, index) => {
            const isTop3 = index < 3;
            const hasAppreciated = appreciatedPeerIds.has(peer.id) || peer.userAppreciated;

            return (
              <div 
                key={peer.id}
                className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
              >
                {/* Left: Rank & Avatar & Details */}
                <div className="flex items-center gap-3.5">
                  <div className="w-7 text-center font-black text-sm">
                    {index === 0 ? (
                      <span className="text-amber-500 text-base">🥇</span>
                    ) : index === 1 ? (
                      <span className="text-slate-400 text-base">🥈</span>
                    ) : index === 2 ? (
                      <span className="text-amber-700 text-base">🥉</span>
                    ) : (
                      <span className="text-slate-400 text-xs">#{index + 1}</span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                    {peer.avatar}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">
                        {peer.name}
                      </span>
                      {peer.streak >= 7 && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {peer.streak}d
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {peer.badge}
                    </span>
                  </div>
                </div>

                {/* Right: Metrics & Appreciation Button */}
                <div className="flex items-center gap-6 sm:gap-8">
                  <div className="hidden sm:block text-xs font-semibold text-slate-500 text-center w-12">
                    {peer.topicsLearned}
                  </div>

                  <div className="hidden sm:block text-xs font-bold text-emerald-600 dark:text-emerald-400 text-center w-12">
                    {peer.accuracy}%
                  </div>

                  <div className="text-right w-16">
                    <span className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400">
                      {peer.wpm}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold block sm:inline sm:ml-1">
                      WPM
                    </span>
                  </div>

                  {/* Social Appreciation Kudos Button */}
                  <button
                    id={`appreciate-peer-${peer.id}`}
                    onClick={() => handleAppreciate(peer.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
                      hasAppreciated
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-rose-300 hover:text-rose-500'
                    }`}
                    title="Send appreciation kudos to this student"
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasAppreciated ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{peer.appreciations}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
