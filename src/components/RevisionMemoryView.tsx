import React, { useState } from 'react';
import { RotateCcw, BrainCircuit, Calendar, Star, Clock, Sparkles, ChevronRight, CheckCircle2, XCircle, HelpCircle, AlertCircle, BookOpen } from 'lucide-react';
import { RevisionTopic, UserProfile } from '../types';
import { CURATED_TOPICS } from '../utils/curatedTopics';
import { soundFx } from '../utils/audio';

interface RevisionMemoryViewProps {
  profile: UserProfile;
  onSelectTopicForRevision: (topicTitle: string) => void;
}

export const RevisionMemoryView: React.FC<RevisionMemoryViewProps> = ({
  profile,
  onSelectTopicForRevision,
}) => {
  const hasUserTopics = profile.revisionTopics && profile.revisionTopics.length > 0;

  // Active quiz state within Memory & Revision
  const initialTopicTitle = hasUserTopics ? profile.revisionTopics[0].topicTitle : CURATED_TOPICS[0].title;
  const [activeQuizTopicTitle, setActiveQuizTopicTitle] = useState<string>(initialTopicTitle);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizWarning, setQuizWarning] = useState<string | null>(null);

  // Find active topic object
  const activeCuratedTopic = CURATED_TOPICS.find(
    t => t.title.toLowerCase() === activeQuizTopicTitle.toLowerCase()
  ) || CURATED_TOPICS[0];

  const now = Date.now();
  const dueTopics = profile.revisionTopics.filter(t => t.nextRevisionDue <= now);

  const handleSelectQuizTopic = (title: string) => {
    setActiveQuizTopicTitle(title);
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizWarning(null);
  };

  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    soundFx.playKeyClick();
    setQuizWarning(null);
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount === 0) {
      setQuizWarning('Please pick an answer for at least one question before submitting.');
      return;
    }
    setQuizWarning(null);
    setQuizSubmitted(true);
    let correct = 0;
    activeCuratedTopic.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correct++;
    });
    if (correct === activeCuratedTopic.quiz.length) {
      soundFx.playFanfare();
    } else {
      soundFx.playWordDing();
    }
  };

  // Calculate score
  let quizScore = 0;
  if (quizSubmitted) {
    activeCuratedTopic.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) quizScore++;
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Spaced Repetition & Active Recall</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Memory & Spaced Revision System
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            “Choose what you want to learn, type it, and remember it.” TypeWise pairs motor typing memory with spaced testing to convert short-term typing into permanent academic knowledge.
          </p>
        </div>
      </div>

      {/* 3-Step Simple Guide for New Users */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
            How TypeWise Spaced Revision Works (Simple 3-Step Cycle)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Type & Encode Knowledge
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Typing meaningful Wikipedia passages engages motor cortex pathways and domain vocabulary faster than passive reading.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Spaced Review Reminders
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The Ebbinghaus Forgetting Curve shows memory decays within 24–48 hours. TypeWise schedules timely prompts right before you forget.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Active Recall Quiz
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Take the quick recall quiz below! Click Submit to instantly verify right vs. wrong answers with educational explanations.
            </p>
          </div>
        </div>
      </div>

      {/* Due for Revision Banner */}
      {dueTopics.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
              <RotateCcw className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Revision Due Today: {dueTopics[0].topicTitle}!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                You practiced this topic earlier. Revising today cements it into your long-term memory.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectQuizTopic(dueTopics[0].topicTitle)}
              className="px-4 py-2 rounded-xl border border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-bold text-xs hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors shrink-0"
            >
              Take Recall Quiz
            </button>
            <button
              onClick={() => onSelectTopicForRevision(dueTopics[0].topicTitle)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
            >
              Revise Passage &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Interactive Quick Recall Quiz Section with Submit Button */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-900/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold uppercase tracking-wider mb-1">
              Active Recall Test
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Quick Knowledge Quiz: {activeCuratedTopic.title}
            </h2>
            <p className="text-xs text-slate-500">
              Select your answers and click "Submit Answers" below to check whether you answered right or wrong!
            </p>
          </div>

          {/* Quiz Topic Selector */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-semibold text-slate-400 mr-1">Topic:</span>
            {CURATED_TOPICS.slice(0, 4).map(t => (
              <button
                key={t.title}
                onClick={() => handleSelectQuizTopic(t.title)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeCuratedTopic.title === t.title
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-5">
          {activeCuratedTopic.quiz.map((q, qIdx) => {
            const selectedOpt = userAnswers[qIdx];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = isAnswered && selectedOpt === q.correctIndex;

            return (
              <div 
                key={qIdx}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  quizSubmitted 
                    ? isCorrect
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      Q{qIdx + 1}
                    </span>
                    <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {q.question}
                    </div>
                  </div>

                  {/* Right/Wrong Status Badge */}
                  {quizSubmitted && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 ${
                      isCorrect 
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    const isOptionCorrect = q.correctIndex === optIdx;

                    let optClass = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300';
                    if (isSelected) {
                      optClass = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold';
                    }

                    if (quizSubmitted) {
                      if (isOptionCorrect) {
                        optClass = 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-600 text-emerald-800 dark:text-emerald-200 font-bold';
                      } else if (isSelected && !isOptionCorrect) {
                        optClass = 'bg-rose-100 dark:bg-rose-950/80 border-rose-600 text-rose-800 dark:text-rose-200 font-semibold';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleAnswerSelect(qIdx, optIdx)}
                        className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${optClass}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isOptionCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {quizSubmitted && isSelected && !isOptionCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation text */}
                {quizSubmitted && (
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 mt-2">
                    <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">Explanation: </strong>
                      {q.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Warning if submitted without answers */}
        {quizWarning && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{quizWarning}</span>
          </div>
        )}

        {/* Bottom Submit Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          {!quizSubmitted ? (
            <button
              id="submit-revision-quiz-btn"
              onClick={handleQuizSubmit}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <span>Submit Answers & Check Results</span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/80 text-xs">
                {Object.keys(userAnswers).length}/{activeCuratedTopic.quiz.length} Answered
              </span>
            </button>
          ) : (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-sm flex items-center gap-2">
                <span>Quiz Score:</span>
                <span className="text-base">{quizScore} / {activeCuratedTopic.quiz.length}</span>
                <span>({Math.round((quizScore / activeCuratedTopic.quiz.length) * 100)}%)</span>
              </div>

              <button
                id="retry-revision-quiz-btn"
                onClick={() => {
                  setUserAnswers({});
                  setQuizSubmitted(false);
                  setQuizWarning(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          )}

          <button
            onClick={() => onSelectTopicForRevision(activeCuratedTopic.title)}
            className="px-5 py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Practice & Type {activeCuratedTopic.title} &rarr;</span>
          </button>
        </div>
      </div>

      {/* All Practiced Topics Library Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Your Revision Library ({profile.revisionTopics.length} Topics Tracked)
          </h2>
          <span className="text-xs text-slate-500">
            Higher stars = stronger memory retention
          </span>
        </div>

        {hasUserTopics ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.revisionTopics.map((topic, idx) => {
              const isDue = topic.nextRevisionDue <= now;
              const daysAgo = Math.max(0, Math.floor((now - topic.lastPracticed) / 86400000));

              return (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all space-y-4 ${
                    isDue 
                      ? 'border-indigo-400 dark:border-indigo-600 shadow-sm' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {topic.topicTitle}
                        </h3>
                        {isDue && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                            Due Today
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Practiced {topic.timesPracticed} {topic.timesPracticed === 1 ? 'time' : 'times'} • {daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}
                      </div>
                    </div>

                    {/* Mastery Stars */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          className={`w-3.5 h-3.5 ${star <= topic.masteryLevel ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Avg WPM</span>
                      <div className="font-bold text-slate-800 dark:text-slate-200">{topic.avgWpm}</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Accuracy</span>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{topic.bestAccuracy}%</div>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold">Review In</span>
                      <div className="font-bold text-indigo-600 dark:text-indigo-400">
                        {isDue ? 'Now' : `${Math.ceil((topic.nextRevisionDue - now) / 86400000)}d`}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => handleSelectQuizTopic(topic.topicTitle)}
                      className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>Take Quiz</span>
                    </button>
                    <button
                      id={`revise-btn-${idx}`}
                      onClick={() => onSelectTopicForRevision(topic.topicTitle)}
                      className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revise Topic</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl">
              📚
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                No Practiced Topics Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Choose any topic from Learn & Type or try the quick recall quiz above to build your memory retention library!
              </p>
            </div>
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                Suggested Topics to Begin With:
              </span>
              <div className="flex items-center justify-center gap-2 flex-wrap max-w-lg mx-auto">
                {CURATED_TOPICS.slice(0, 4).map(topic => (
                  <button
                    key={topic.title}
                    id={`empty-suggest-${topic.title.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => onSelectTopicForRevision(topic.title)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors"
                  >
                    {topic.title} &rarr;
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
