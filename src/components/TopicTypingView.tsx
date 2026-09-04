import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Search, 
  Sparkles, 
  RotateCcw, 
  ChevronRight, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Zap, 
  Clock, 
  Layers, 
  AlertCircle,
  Loader2,
  TrendingUp,
  BrainCircuit,
  Share2
} from 'lucide-react';
import { 
  TopicContent, 
  PracticeLevel, 
  DifficultyLevel, 
  TypingSession, 
  UserProfile, 
  QuizQuestion 
} from '../types';
import { CURATED_TOPICS } from '../utils/curatedTopics';
import { soundFx } from '../utils/audio';

interface TopicTypingViewProps {
  profile: UserProfile;
  onSessionComplete: (session: TypingSession) => void;
  initialTopicTitle?: string;
}

export const TopicTypingView: React.FC<TopicTypingViewProps> = ({
  profile,
  onSessionComplete,
  initialTopicTitle
}) => {
  // Topic selection & content state
  const [currentTopic, setCurrentTopic] = useState<TopicContent>(() => {
    if (initialTopicTitle) {
      const found = CURATED_TOPICS.find(t => t.title.toLowerCase() === initialTopicTitle.toLowerCase());
      if (found) return found;
    }
    return CURATED_TOPICS[0];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ title: string; snippet: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingTopic, setIsLoadingTopic] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Practice configuration
  const [selectedLevel, setSelectedLevel] = useState<PracticeLevel>('quick');
  
  // The active passage to type
  const targetText = useMemo(() => {
    return currentTopic.passages[selectedLevel] || currentTopic.passages.quick;
  }, [currentTopic, selectedLevel]);

  // Typing engine states with strict force-correction:
  // Cursor waits until correct character is typed!
  const [cursorIndex, setCursorIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [wpmHistory, setWpmHistory] = useState<number[]>([]);

  // Post-session flow: 'results' -> 'summary' -> 'quiz'
  const [postSessionTab, setPostSessionTab] = useState<'results' | 'summary' | 'quiz'>('results');
  
  // Quiz state
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizWarning, setQuizWarning] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const timerIntervalRef = useRef<any>(null);

  // Switch to initial topic if passed via props
  useEffect(() => {
    if (initialTopicTitle) {
      const found = CURATED_TOPICS.find(t => t.title.toLowerCase() === initialTopicTitle.toLowerCase());
      if (found) {
        handleSelectTopic(found);
      } else {
        fetchWikipediaTopic(initialTopicTitle);
      }
    }
  }, [initialTopicTitle]);

  // Keep input focused
  const focusInput = () => {
    if (!isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Reset typing test
  const resetTyping = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setCursorIndex(0);
    setHasError(false);
    setErrorCount(0);
    setIsStarted(false);
    setIsFinished(false);
    setStartTime(null);
    setCurrentTime(0);
    setWpmHistory([]);
    setPostSessionTab('results');
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizWarning(null);
    setTimeout(focusInput, 50);
  };

  // Change topic or level resets test
  const handleSelectTopic = (topic: TopicContent) => {
    setCurrentTopic(topic);
    setSearchQuery('');
    setSearchResults([]);
    resetTyping();
  };

  // Fetch topic from Wikipedia API or Express backend
  const fetchWikipediaTopic = async (title: string) => {
    setIsLoadingTopic(true);
    setSearchError(null);
    try {
      // First check curated
      const curated = CURATED_TOPICS.find(t => t.title.toLowerCase() === title.toLowerCase());
      if (curated) {
        handleSelectTopic(curated);
        setIsLoadingTopic(false);
        return;
      }

      const res = await fetch(`/api/wikipedia/topic?title=${encodeURIComponent(title)}`);
      if (!res.ok) {
        // Fallback to Wikipedia direct API if server route had issues
        throw new Error('Server API failed, trying direct Wikipedia source');
      }
      const data: TopicContent = await res.json();
      handleSelectTopic(data);
    } catch (err) {
      // Direct client Wikipedia fallback
      try {
        const directRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
        if (!directRes.ok) throw new Error('Could not find article on Wikipedia');
        const summary = await directRes.json();
        
        const cleanText = summary.extract || '';
        const words = cleanText.split(/\s+/).length;
        const newTopic: TopicContent = {
          title: summary.title,
          thumbnail: summary.thumbnail?.source || null,
          difficulty: words > 100 ? 'Medium' : 'Easy',
          wordCounts: { quick: Math.min(120, words), standard: words, deep: words },
          passages: {
            quick: cleanText.slice(0, 500),
            standard: cleanText,
            deep: cleanText,
          },
          keyTakeaways: [
            `${summary.title} is a notable topic with significant real-world context.`,
            `Key concepts were extracted directly from the Wikipedia encyclopedic archive.`,
            `Typing this subject reinforces memory patterns and domain vocabulary.`,
            `Review this topic in your revision dashboard to reinforce retention.`
          ],
          quiz: [
            {
              question: `What primary subject is covered in this passage about ${summary.title}?`,
              options: [
                summary.title,
                'Unrelated botanical categorization',
                'Ancient maritime sailing navigation',
                'General cooking guidelines'
              ],
              correctIndex: 0,
              explanation: `The passage directly introduces the fundamental definition of ${summary.title}.`
            }
          ]
        };
        handleSelectTopic(newTopic);
      } catch (fallbackErr: any) {
        setSearchError(`Failed to load topic "${title}". Please try another topic.`);
      }
    } finally {
      setIsLoadingTopic(false);
    }
  };

  // Live search Wikipedia
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/wikipedia/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.results || []);
        } else {
          // Direct client fallback
          const direct = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchQuery)}&limit=6&namespace=0&origin=*&format=json`);
          const directData = await direct.json();
          const titles = directData[1] || [];
          const snippets = directData[2] || [];
          setSearchResults(titles.map((t: string, i: number) => ({ title: t, snippet: snippets[i] || '' })));
        }
      } catch {
        // Fallback filter on curated list
        const matches = CURATED_TOPICS.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()));
        setSearchResults(matches.map(m => ({ title: m.title, snippet: m.keyTakeaways[0] })));
      } finally {
        setIsSearching(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle typing keydown with strict force-correction: cursor waits until correct letter is typed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    if (e.key === 'Tab') {
      e.preventDefault();
      resetTyping();
      return;
    }

    // Ignore modifier keys
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
      if (e.key === 'Backspace') {
        setHasError(false);
      }
      return;
    }

    e.preventDefault();
    const typedChar = e.key;
    const expectedChar = targetText[cursorIndex];

    // Start timer on first keystroke
    if (!isStarted) {
      setIsStarted(true);
      const start = Date.now();
      setStartTime(start);

      timerIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        setCurrentTime(elapsed);

        // Record speed sample
        const currentWpm = Math.round((cursorIndex / 5) / (elapsed / 60));
        setWpmHistory(prev => [...prev.slice(-30), Math.max(0, currentWpm)]);
      }, 500);
    }

    if (typedChar === expectedChar) {
      // Correct keystroke!
      soundFx.playKeyClick();
      setHasError(false);
      const nextIdx = cursorIndex + 1;
      setCursorIndex(nextIdx);

      // Keep active caret visible in text container
      if (activeCharRef.current && textContainerRef.current) {
        const charEl = activeCharRef.current;
        const containerEl = textContainerRef.current;
        const charTop = charEl.offsetTop;
        if (charTop - containerEl.scrollTop > containerEl.clientHeight - 80) {
          containerEl.scrollTop = charTop - 40;
        }
      }

      if (nextIdx >= targetText.length) {
        completeSession(nextIdx);
      }
    } else {
      // Mistake occurred! Cursor waits right here until correct letter is clicked
      soundFx.playError();
      setHasError(true);
      setErrorCount(prev => prev + 1);
    }
  };

  // Complete session calculation
  const completeSession = (finalCorrectChars: number) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsFinished(true);
    soundFx.playFanfare();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    const totalDuration = Math.max(1, currentTime || 1);
    const totalHits = finalCorrectChars + errorCount;
    const accuracy = totalHits > 0 ? Math.round((finalCorrectChars / totalHits) * 100) : 100;
    const finalWpm = Math.round((finalCorrectChars / 5) / (totalDuration / 60));
    const rawWpm = Math.round((totalHits / 5) / (totalDuration / 60));
    const wordCount = targetText.split(/\s+/).length;

    const sessionData: TypingSession = {
      id: 'sess_' + Date.now(),
      topicTitle: currentTopic.title,
      mode: 'topic',
      level: selectedLevel,
      difficulty: currentTopic.difficulty,
      wpm: finalWpm,
      rawWpm: rawWpm,
      accuracy: accuracy,
      errors: errorCount,
      durationSeconds: Math.round(totalDuration),
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      wordCount: wordCount,
      quizTotal: currentTopic.quiz.length,
    };

    onSessionComplete(sessionData);
  };

  // Current real-time stats
  const currentElapsedMinutes = Math.max(0.01, currentTime / 60);
  const totalAttempts = cursorIndex + errorCount;
  const liveWpm = Math.round((cursorIndex / 5) / (isStarted ? currentElapsedMinutes : 1));
  const liveAccuracy = totalAttempts > 0 ? Math.round((cursorIndex / totalAttempts) * 100) : 100;
  const progressPercent = Math.min(100, Math.round((cursorIndex / targetText.length) * 100));

  // Quiz submission
  const handleAnswerSelect = (qIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    soundFx.playKeyClick();
    setQuizWarning(null);
    setUserAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    const answeredCount = Object.keys(userAnswers).length;
    if (answeredCount === 0) {
      setQuizWarning('Please select an answer to at least one question before submitting.');
      return;
    }
    setQuizWarning(null);
    setQuizSubmitted(true);
    let score = 0;
    currentTopic.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score++;
    });
    if (score === currentTopic.quiz.length) {
      soundFx.playFanfare();
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {}
    } else {
      soundFx.playWordDing();
    }
  };

  const quizScore = useMemo(() => {
    let score = 0;
    currentTopic.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  }, [userAnswers, currentTopic.quiz]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      
      {/* Topic Search & Curated Category Pills */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> : <Search className="w-4 h-4" />}
            </div>
            <input
              id="wikipedia-topic-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any educational topic (e.g., Quantum Physics, French Revolution, Black Holes)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 shadow-xs"
            />

            {/* Live Search Autocomplete Dropdown */}
            {searchResults.length > 0 && (
              <div 
                id="search-results-dropdown"
                className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800"
              >
                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Wikipedia Articles
                </div>
                {searchResults.map((item, idx) => (
                  <button
                    key={idx}
                    id={`search-result-item-${idx}`}
                    onClick={() => fetchWikipediaTopic(item.title)}
                    className="w-full text-left px-4 py-2.5 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/40 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {item.title}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item.snippet}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick random topic button */}
          <button
            id="random-curated-topic-btn"
            onClick={() => {
              const others = CURATED_TOPICS.filter(t => t.title !== currentTopic.title);
              const random = others[Math.floor(Math.random() * others.length)] || CURATED_TOPICS[0];
              handleSelectTopic(random);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-semibold shadow-xs shrink-0 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Random Topic</span>
          </button>
        </div>

        {/* Curated Suggested Topics Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0">Popular:</span>
          {CURATED_TOPICS.map(topic => {
            const isSelected = currentTopic.title === topic.title;
            return (
              <button
                key={topic.title}
                id={`curated-pill-${topic.title.replace(/\s+/g, '-').toLowerCase()}`}
                onClick={() => handleSelectTopic(topic)}
                className={`px-3 py-1.5 rounded-full font-medium transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
              >
                {topic.title}
              </button>
            );
          })}
        </div>

        {/* Error message */}
        {searchError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{searchError}</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton when fetching topic from Wikipedia */}
      {isLoadingTopic && (
        <div id="topic-loading-skeleton" className="space-y-4 animate-pulse">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md" />
                <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-800 rounded-md" />
              </div>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
          </div>

          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 min-h-[220px] flex flex-col justify-center items-center space-y-4 text-center">
            <div className="w-10 h-10 rounded-full border-3 border-indigo-600 border-t-transparent animate-spin" />
            <div className="space-y-1">
              <div className="text-base font-bold text-slate-800 dark:text-slate-200">
                Retrieving & Formatting Topic from Wikipedia...
              </div>
              <div className="text-xs text-slate-500 max-w-sm">
                Structuring educational passages, generating academic vocabulary, and preparing recall quiz questions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Topic Header Card (hidden during loading) */}
      {!isLoadingTopic && (
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xl shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {currentTopic.title}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  currentTopic.difficulty === 'Easy'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                    : currentTopic.difficulty === 'Medium'
                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                    : 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                }`}>
                  {currentTopic.difficulty}
                </span>
                {currentTopic.category && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    • {currentTopic.category}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Type Wikipedia-extracted educational passages, absorb academic knowledge, and test your recall.
              </p>
            </div>
          </div>

          {/* Practice Level Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start md:self-auto">
            {(['quick', 'standard', 'deep'] as PracticeLevel[]).map(lvl => {
              const active = selectedLevel === lvl;
              const count = currentTopic.wordCounts[lvl] || 0;
              return (
                <button
                  key={lvl}
                  id={`practice-level-${lvl}`}
                  onClick={() => {
                    setSelectedLevel(lvl);
                    resetTyping();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    active 
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {lvl} ({count}w)
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Metrics Row during active practice */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Speed
            </span>
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {isStarted ? liveWpm : 0} <span className="text-xs font-semibold text-slate-500">WPM</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Accuracy
            </span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {isStarted ? liveAccuracy : 100}%
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Time
            </span>
            <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-200">
              {Math.floor(currentTime)} <span className="text-xs font-semibold text-slate-500">sec</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
              Progress
            </span>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      )}

      {/* Main Interactive Typing Arena (or Post-Session Modal) */}
      {!isLoadingTopic && (!isFinished ? (
        <div 
          id="typing-arena-container"
          onClick={focusInput}
          className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-400/50 transition-colors shadow-sm cursor-text min-h-[260px] flex flex-col justify-between select-none"
        >
          {/* Hidden input catching user keystrokes */}
          <input
            id="typing-active-input"
            ref={inputRef}
            type="text"
            value=""
            onKeyDown={handleKeyDown}
            onChange={() => {}}
            autoFocus
            className="absolute inset-0 opacity-0 pointer-events-auto cursor-text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />

          {/* Character-by-character render with strict mistake-waiting */}
          <div 
            ref={textContainerRef}
            className="font-typing text-lg sm:text-xl leading-relaxed tracking-wide max-h-[360px] overflow-y-auto pr-2 select-none"
          >
            {targetText.split('').map((char, index) => {
              const isTyped = index < cursorIndex;
              const isCurrent = index === cursorIndex;

              let charClass = 'text-slate-400 dark:text-slate-500';
              if (isTyped) {
                charClass = 'text-emerald-600 dark:text-emerald-400 font-medium';
              } else if (isCurrent) {
                if (hasError) {
                  charClass = 'text-white bg-rose-600 dark:bg-rose-600 font-bold px-1 rounded-sm ring-2 ring-rose-500 animate-pulse';
                } else {
                  charClass = 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold px-0.5 rounded-sm';
                }
              }

              return (
                <span
                  key={index}
                  ref={isCurrent ? activeCharRef : null}
                  className={`relative ${charClass}`}
                >
                  {isCurrent && !hasError && (
                    <span className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-indigo-600 dark:bg-indigo-400 animate-caret" />
                  )}
                  {char}
                </span>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                Strict Typing: If you make a mistake, cursor waits for the correct letter.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="reset-typing-button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playKeyClick();
                  resetTyping();
                }}
                title="Restart [Alt + R]"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restart</span>
                <kbd className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">Alt+R</kbd>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Post-Session 3-Step Educational Experience */
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          {/* Tabs: 1. Results | 2. What You Learned | 3. Quick Quiz */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <button
                id="post-tab-results"
                onClick={() => setPostSessionTab('results')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  postSessionTab === 'results'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Typing Performance</span>
              </button>

              <button
                id="post-tab-summary"
                onClick={() => setPostSessionTab('summary')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  postSessionTab === 'summary'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>What You Learned</span>
              </button>

              <button
                id="post-tab-quiz"
                onClick={() => setPostSessionTab('quiz')}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                  postSessionTab === 'quiz'
                    ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span>Quick Quiz</span>
                <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-[10px] text-indigo-700 dark:text-indigo-300">
                  {currentTopic.quiz.length}Q
                </span>
              </button>
            </div>

            <button
              id="practice-again-top-btn"
              onClick={resetTyping}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Practice Again</span>
            </button>
          </div>

          {/* TAB 1: TYPING PERFORMANCE */}
          {postSessionTab === 'results' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="text-center space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Topic Completed
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  Great Practice on {currentTopic.title}!
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Your motor memory and academic recall are both growing stronger.
                </p>
              </div>

              {/* Big Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-center">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Speed</div>
                  <div className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                    {liveWpm}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Words Per Minute</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-center">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Accuracy</div>
                  <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {liveAccuracy}%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Correct Keystrokes</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Time Elapsed</div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-200 mt-1">
                    {Math.round(currentTime)}s
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{targetText.split(/\s+/).length} Words Typed</div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50 text-center">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Errors</div>
                  <div className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 mt-1">
                    {errorCount}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Mistakes made</div>
                </div>
              </div>

              {/* Speed Graph preview */}
              {wpmHistory.length > 3 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-indigo-500" />
                      Session Velocity Progression
                    </span>
                    <span>Peak: {Math.max(...wpmHistory, liveWpm)} WPM</span>
                  </div>
                  <div className="h-16 flex items-end gap-1.5 pt-2">
                    {wpmHistory.map((val, i) => {
                      const max = Math.max(...wpmHistory, 60);
                      const heightPercent = Math.max(10, Math.round((val / max) * 100));
                      return (
                        <div
                          key={i}
                          className="flex-1 bg-indigo-500/70 dark:bg-indigo-400/80 rounded-t-sm transition-all"
                          style={{ height: `${heightPercent}%` }}
                          title={`${val} WPM`}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next Step Banner */}
              <div className="p-4 rounded-2xl bg-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="space-y-0.5 text-center sm:text-left">
                  <div className="font-bold text-sm">Step 2: Consolidate What You Learned</div>
                  <div className="text-xs text-indigo-100">Review key takeaway concepts and test your recall in the quiz.</div>
                </div>
                <button
                  id="view-summary-btn"
                  onClick={() => setPostSessionTab('summary')}
                  className="px-4 py-2 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors shrink-0 shadow-xs"
                >
                  Review Summary &rarr;
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: WHAT YOU LEARNED SUMMARY */}
          {postSessionTab === 'summary' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    What You Learned from "{currentTopic.title}"
                  </h3>
                  <p className="text-xs text-slate-500">
                    Key knowledge nuggets extracted from the text you just typed.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {currentTopic.keyTakeaways.map((point, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {point}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs flex items-center justify-between">
                <span>Memory Rule: Testing yourself strengthens neural connections by up to 50%.</span>
                <button
                  id="go-to-quiz-btn"
                  onClick={() => setPostSessionTab('quiz')}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  Take Recall Quiz &rarr;
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: QUICK QUIZ (READ -> TYPE -> UNDERSTAND -> RECALL -> TEST) */}
          {postSessionTab === 'quiz' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Recall Quiz: {currentTopic.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Answer the questions below to test how much you absorbed while typing.
                    </p>
                  </div>
                </div>

                {quizSubmitted && (
                  <div className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    Score: {quizScore} / {currentTopic.quiz.length}
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {currentTopic.quiz.map((q, qIdx) => {
                  const selectedOption = userAnswers[qIdx];
                  return (
                    <div 
                      key={qIdx}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {qIdx + 1}
                        </span>
                        <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {q.question}
                        </div>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOption === optIdx;
                          const isCorrect = q.correctIndex === optIdx;

                          let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-300';
                          if (isSelected) {
                            btnStyle = 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-semibold';
                          }
                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              id={`quiz-${qIdx}-opt-${optIdx}`}
                              disabled={quizSubmitted}
                              onClick={() => handleAnswerSelect(qIdx, optIdx)}
                              className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />}
                              {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Reveal */}
                      {quizSubmitted && (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{q.explanation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quiz warning if user tries to submit with empty answers */}
              {quizWarning && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{quizWarning}</span>
                </div>
              )}

              {/* Submit Quiz or Practice Next Topic */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {!quizSubmitted ? (
                  <button
                    id="submit-quiz-answers-btn"
                    onClick={handleQuizSubmit}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white cursor-pointer flex items-center gap-2"
                  >
                    <span>Submit Answers & Check Results</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/80 text-[11px]">
                      {Object.keys(userAnswers).length}/{currentTopic.quiz.length} Answered
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      id="quiz-try-again-btn"
                      onClick={() => {
                        setUserAnswers({});
                        setQuizSubmitted(false);
                        setQuizWarning(null);
                      }}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                    <button
                      id="quiz-next-topic-btn"
                      onClick={() => {
                        const others = CURATED_TOPICS.filter(t => t.title !== currentTopic.title);
                        const next = others[Math.floor(Math.random() * others.length)] || CURATED_TOPICS[0];
                        handleSelectTopic(next);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>Next Topic</span>
                      <span>&rarr;</span>
                    </button>
                  </div>
                )}

                <button
                  id="practice-again-bottom-btn"
                  onClick={resetTyping}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Type Passage Again
                </button>
              </div>

            </div>
          )}

        </div>
      ))}

    </div>
  );
};
