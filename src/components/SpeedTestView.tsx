import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Timer, RotateCcw, Award, Zap, CheckCircle2, AlertTriangle, Settings2, BookOpen, X, Check } from 'lucide-react';
import { TypingSession, UserProfile } from '../types';
import { soundFx } from '../utils/audio';

interface SpeedTestViewProps {
  profile: UserProfile;
  onSessionComplete: (session: TypingSession) => void;
}

// Curated benchmark passages
const SPEED_TEST_PASSAGES = [
  {
    id: 'education',
    title: 'Education & Wisdom',
    text: "Education is the most powerful weapon which you can use to change the world. Knowledge empowers humanity to solve intricate dilemmas, alleviate suffering, and navigate the frontiers of scientific discovery with wisdom and compassion. The essence of learning lies in disciplined curiosity, continuous practice, and purposeful application."
  },
  {
    id: 'technology',
    title: 'Technology & Algorithms',
    text: "Computers are incredibly fast, accurate, and stupid; humans are incredibly slow, inaccurate, and brilliant; together they are powerful beyond imagination. Algorithmic thinking and software craftsmanship enable us to construct systems that connect civilizations and explore new frontiers."
  },
  {
    id: 'cosmos',
    title: 'Cosmos & The Universe',
    text: "The cosmos is within us. We are made of star-stuff. We are a way for the universe to know itself. Contemplating the vast expanse of galaxies and celestial bodies inspires humility, intellectual ambition, and deep reverence for our fragile blue planet."
  },
  {
    id: 'psychology',
    title: 'Habit & Mindset',
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit. Clear thought leads to disciplined action. When mental resilience and steady determination converge, challenges transform into catalysts for lasting cognitive mastery."
  }
];

export const SpeedTestView: React.FC<SpeedTestViewProps> = ({ profile, onSessionComplete }) => {
  const [duration, setDuration] = useState<number>(30); // 15, 30, 60, 300, or custom
  const [customInput, setCustomInput] = useState<string>('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Passage selection state
  const [selectedPassageId, setSelectedPassageId] = useState<string>('education');
  const [targetText, setTargetText] = useState<string>(SPEED_TEST_PASSAGES[0].text);
  const [showPassageModal, setShowPassageModal] = useState(false);
  const [customPassageInput, setCustomPassageInput] = useState('');

  // Strict typing state: cursor waits until correct letter is typed
  const [cursorIndex, setCursorIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);

  // Focus input
  const focusInput = () => {
    if (!isFinished && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const resetTest = (newDuration?: number, newText?: string) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const d = newDuration !== undefined ? newDuration : duration;
    setTimeLeft(d);
    setCursorIndex(0);
    setHasError(false);
    setErrorCount(0);
    setTotalKeystrokes(0);
    setIsStarted(false);
    setIsFinished(false);
    if (newText !== undefined) {
      setTargetText(newText);
    }
    setTimeout(focusInput, 50);
  };

  const handleSelectDuration = (sec: number) => {
    setDuration(sec);
    resetTest(sec);
  };

  const handleSelectPassage = (passage: typeof SPEED_TEST_PASSAGES[0]) => {
    setSelectedPassageId(passage.id);
    resetTest(duration, passage.text);
    setShowPassageModal(false);
  };

  const handleApplyCustomPassage = () => {
    const trimmed = customPassageInput.trim();
    if (trimmed.length >= 20) {
      setSelectedPassageId('custom');
      resetTest(duration, trimmed);
      setShowPassageModal(false);
    }
  };

  // Keyboard event handler enforcing wait-on-mistake
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isFinished) return;

    // Restart shortcut
    if (e.key === 'Tab') {
      e.preventDefault();
      resetTest();
      return;
    }

    // Ignore non-printable keys
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
      if (e.key === 'Backspace') {
        setHasError(false);
      }
      return;
    }

    e.preventDefault(); // Prevent standard input insertion
    const typedChar = e.key;
    const expectedChar = targetText[cursorIndex];

    setTotalKeystrokes(prev => prev + 1);

    // Start timer on first keystroke
    if (!isStarted) {
      setIsStarted(true);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishTest(cursorIndex);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (typedChar === expectedChar) {
      // Correct character pressed!
      soundFx.playKeyClick();
      setHasError(false);
      const nextIndex = cursorIndex + 1;
      setCursorIndex(nextIndex);

      if (nextIndex >= targetText.length) {
        finishTest(nextIndex);
      }
    } else {
      // Mistake occurred! Play error sound, increment error counter,
      // and do NOT advance cursor: cursor waits right here!
      soundFx.playError();
      setHasError(true);
      setErrorCount(prev => prev + 1);
    }
  };

  const finishTest = (finalCorrectChars: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFinished(true);
    soundFx.playFanfare();

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {}

    const totalSecondsElapsed = duration - Math.max(0, timeLeft);
    const timeUsed = Math.max(1, totalSecondsElapsed);
    
    // Accuracy calculation based on keystrokes
    const totalHits = finalCorrectChars + errorCount;
    const accuracy = totalHits > 0 ? Math.round((finalCorrectChars / totalHits) * 100) : 100;
    const wpm = Math.round((finalCorrectChars / 5) / (timeUsed / 60));
    const rawWpm = Math.round((totalHits / 5) / (timeUsed / 60));
    const wordCount = Math.round(finalCorrectChars / 5);

    const session: TypingSession = {
      id: 'speed_' + Date.now(),
      topicTitle: `Speed Test (${duration}s)`,
      mode: 'speed_test',
      wpm,
      rawWpm,
      accuracy,
      errors: errorCount,
      durationSeconds: timeUsed,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      wordCount,
    };

    onSessionComplete(session);
  };

  // Live metrics
  const elapsedSeconds = duration - timeLeft;
  const elapsedMinutes = Math.max(0.01, elapsedSeconds / 60);
  const liveWpm = Math.round((cursorIndex / 5) / (isStarted ? elapsedMinutes : 1));
  const totalAttempts = cursorIndex + errorCount;
  const liveAccuracy = totalAttempts > 0 ? Math.round((cursorIndex / totalAttempts) * 100) : 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Classic Speed Test
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Test your pure typing velocity, accuracy, and character errors under a timed countdown.
          </p>
        </div>

        {/* Duration selector buttons: 15s, 30s, 1m (60s), 5m (300s), Custom and Change Text */}
        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            id="change-passage-btn"
            onClick={() => setShowPassageModal(true)}
            title="Change practice text / benchmark passage"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Change Text</span>
          </button>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            {[15, 30, 60, 300].map(sec => (
              <button
                key={sec}
                id={`duration-btn-${sec}`}
                onClick={() => handleSelectDuration(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  duration === sec && !showCustomModal
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {sec < 60 ? `${sec}s` : `${sec / 60}m`}
              </button>
            ))}
            <button
              id="duration-btn-custom"
              onClick={() => setShowCustomModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900"
            >
              <Settings2 className="w-3.5 h-3.5" />
              <span>Custom</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change Text / Passage Modal */}
      {showPassageModal && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800/60 shadow-lg space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Choose Speed Test Passage
              </h3>
            </div>
            <button
              onClick={() => setShowPassageModal(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SPEED_TEST_PASSAGES.map(p => {
              const isSelected = selectedPassageId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPassage(p)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-400/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50/50 dark:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white mb-1">
                    <span>{p.title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {p.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Custom text entry */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Or paste your own custom typing passage:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPassageInput}
                onChange={(e) => setCustomPassageInput(e.target.value)}
                placeholder="Paste or type any paragraph here (minimum 20 characters)..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleApplyCustomPassage}
                disabled={customPassageInput.trim().length < 20}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
              >
                Use Custom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Duration Modal */}
      {showCustomModal && (
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span>Set custom test duration (seconds):</span>
            <input
              type="number"
              min="5"
              max="600"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g. 45"
              className="w-20 px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const parsed = parseInt(customInput, 10);
                if (parsed > 0) {
                  handleSelectDuration(parsed);
                  setShowCustomModal(false);
                }
              }}
              className="px-3 py-1 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700"
            >
              Apply
            </button>
            <button
              onClick={() => setShowCustomModal(false)}
              className="px-2 py-1 text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Live Speedometer & Countdown */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Timer</span>
          <div className={`text-3xl sm:text-4xl font-black mt-1 ${timeLeft <= 5 && isStarted ? 'text-rose-600 animate-pulse' : 'text-indigo-600 dark:text-indigo-400'}`}>
            {timeLeft}s
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Speed</span>
          <div className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100 mt-1">
            {isStarted ? liveWpm : 0} <span className="text-xs font-semibold text-slate-500">WPM</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Accuracy</span>
          <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {isStarted ? liveAccuracy : 100}%
          </div>
        </div>
      </div>

      {/* Active Arena or Test Complete */}
      {!isFinished ? (
        <div 
          id="speed-test-arena"
          onClick={focusInput}
          className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm cursor-text min-h-[220px] select-none flex flex-col justify-between"
        >
          <input
            id="speed-test-input"
            ref={inputRef}
            type="text"
            value=""
            onKeyDown={handleKeyDown}
            onChange={() => {}}
            autoFocus
            className="absolute inset-0 opacity-0 pointer-events-auto cursor-text"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />

          {/* Passage rendering with strict mistake-waiting indicator */}
          <div className="font-typing text-lg sm:text-xl leading-relaxed tracking-wide select-none">
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
                  charClass = 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold px-0.5 rounded-sm';
                }
              }

              return (
                <span
                  key={index}
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

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-medium text-slate-600 dark:text-slate-400">
                Strict Typing: If you make a mistake, type the correct letter to continue.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="speed-test-reset-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  resetTest();
                }}
                title="Reset test [Alt + R]"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Test</span>
                <kbd className="hidden sm:inline text-[10px] px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">Alt+R</kbd>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Speed Test Finished Scorecard */
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/20">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
              {duration}s Test Completed
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {liveWpm} Words Per Minute
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Accuracy: <strong className="text-emerald-600">{liveAccuracy}%</strong> • Correct Keystrokes: <strong>{cursorIndex}</strong> • Mistakes: <strong className="text-rose-600">{errorCount}</strong>
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              id="speed-test-retry-btn"
              onClick={() => resetTest()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Test</span>
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-indigo-700 text-indigo-200">Alt+R</kbd>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
