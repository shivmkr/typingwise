import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Gamepad2, Heart, Zap, Clock, Trophy, RotateCcw, ShieldAlert, Award } from 'lucide-react';
import { soundFx } from '../utils/audio';

type GameMode = 'word_race' | 'time_attack' | 'survival';
type RaceDifficulty = 'easy' | 'medium' | 'hard';

const ACADEMIC_WORDS = [
  'algorithm', 'synapse', 'quantum', 'mitochondria', 'gravity', 
  'democracy', 'polymorphism', 'hemoglobin', 'galaxy', 'photosynthesis', 
  'entropy', 'chromosome', 'hypothesis', 'electromagnetism', 'metabolism', 
  'tectonics', 'civilization', 'astronomy', 'stoichiometry', 'neuroplasticity', 
  'evolution', 'paradox', 'velocity', 'biosphere', 'resilience', 
  'thermodynamics', 'nanotechnology', 'stratosphere', 'supernova', 'paleontology'
];

export const TypingGamesView: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameMode>('word_race');
  
  // Word Race Speed Difficulty (only for Word Race mode)
  const [raceDifficulty, setRaceDifficulty] = useState<RaceDifficulty>('medium');

  // Game states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<Record<GameMode, number>>({
    word_race: 0,
    time_attack: 0,
    survival: 0
  });

  // Current word & input
  const [currentWord, setCurrentWord] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [hasTypingMistake, setHasTypingMistake] = useState(false);
  
  // Time Attack state
  const [gameTimer, setGameTimer] = useState(30);

  // Survival state
  const [health, setHealth] = useState(100);
  const [wave, setWave] = useState(1);

  // Word Race state
  const [racePosition, setRacePosition] = useState(0); // 0 to 100%

  const inputRef = useRef<HTMLInputElement>(null);
  const gameIntervalRef = useRef<any>(null);

  // Pick random word
  const getRandomWord = () => {
    return ACADEMIC_WORDS[Math.floor(Math.random() * ACADEMIC_WORDS.length)];
  };

  // Start game
  const startGame = (mode: GameMode, difficulty: RaceDifficulty = raceDifficulty) => {
    setSelectedGame(mode);
    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setTypedInput('');
    setHasTypingMistake(false);
    setCurrentWord(getRandomWord());

    if (mode === 'time_attack') {
      setGameTimer(30);
    } else if (mode === 'survival') {
      setHealth(100);
      setWave(1);
    } else if (mode === 'word_race') {
      setRacePosition(0);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Game loop tick
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    if (selectedGame === 'time_attack') {
      gameIntervalRef.current = setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (selectedGame === 'word_race') {
      // Word speed adjusted specifically according to Easy, Medium, Hard difficulty
      // Easy: gentle pace (+1.2% every 120ms)
      // Medium: balanced standard (+2.0% every 100ms)
      // Hard: fast challenge (+3.2% every 75ms)
      const tickInterval = raceDifficulty === 'easy' ? 120 : raceDifficulty === 'medium' ? 100 : 75;
      const stepIncrement = raceDifficulty === 'easy' ? 1.2 : raceDifficulty === 'medium' ? 2.0 : 3.2;

      gameIntervalRef.current = setInterval(() => {
        setRacePosition(prev => {
          if (prev >= 98) {
            endGame();
            return 100;
          }
          return prev + stepIncrement;
        });
      }, tickInterval);
    }

    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [isPlaying, isGameOver, selectedGame, raceDifficulty]);

  const endGame = () => {
    if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    setIsPlaying(false);
    setIsGameOver(true);
    soundFx.playError();

    setHighScore(prev => ({
      ...prev,
      [selectedGame]: Math.max(prev[selectedGame], score)
    }));
  };

  // Input change with strict mistake waiting
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying || isGameOver) return;
    const val = e.target.value;
    const targetWord = currentWord.toLowerCase();

    // Check if the typed prefix matches
    if (targetWord.startsWith(val.toLowerCase())) {
      setTypedInput(val);
      setHasTypingMistake(false);
      soundFx.playKeyClick();

      if (val.toLowerCase() === targetWord) {
        // Word completed successfully!
        soundFx.playWordDing();
        setScore(s => s + (raceDifficulty === 'hard' ? 20 : raceDifficulty === 'medium' ? 10 : 5));
        setTypedInput('');
        setCurrentWord(getRandomWord());

        if (selectedGame === 'time_attack') {
          setGameTimer(t => Math.min(60, t + 2)); // Bonus 2 seconds
        } else if (selectedGame === 'word_race') {
          setRacePosition(0); // Reset distance
        } else if (selectedGame === 'survival') {
          setWave(w => w + 1);
        }
      }
    } else {
      // Mistake occurred! Cursor waits, error sound plays
      soundFx.playError();
      setHasTypingMistake(true);

      if (selectedGame === 'survival') {
        setHealth(h => {
          const nextH = h - 20;
          if (nextH <= 0) {
            endGame();
            return 0;
          }
          return nextH;
        });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      
      {/* Game Mode Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Academic Typing Games
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Level up your keyboard reaction speeds while mastering scientific and academic terminology.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          {(['word_race', 'time_attack', 'survival'] as GameMode[]).map(mode => (
            <button
              key={mode}
              id={`game-tab-${mode}`}
              onClick={() => {
                if (isPlaying) endGame();
                startGame(mode);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                selectedGame === mode 
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Game Arena */}
      <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-6 min-h-[360px] flex flex-col justify-center items-center">
        
        {!isPlaying && !isGameOver && (
          <div className="space-y-5 max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-2xl font-bold">
              {selectedGame === 'word_race' ? '🏎️' : selectedGame === 'time_attack' ? '⏱️' : '🛡️'}
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white capitalize">
                {selectedGame.replace('_', ' ')}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {selectedGame === 'word_race' && 'Type the academic word before it reaches the right boundary!'}
                {selectedGame === 'time_attack' && 'Type as many words as possible. Every correct word gives +2 bonus seconds!'}
                {selectedGame === 'survival' && 'Maintain pristine accuracy! Each typing error costs 20% health.'}
              </p>
            </div>

            {/* Word Race Speed Difficulty Selector (ONLY for Word Race) */}
            {selectedGame === 'word_race' && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Select Race Speed:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as RaceDifficulty[]).map(diff => {
                    const isSelected = raceDifficulty === diff;
                    return (
                      <button
                        key={diff}
                        id={`race-diff-${diff}-btn`}
                        onClick={() => setRaceDifficulty(diff)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold capitalize transition-all ${
                          isSelected
                            ? diff === 'easy'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : diff === 'medium'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-rose-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {diff}
                        <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                          {diff === 'easy' ? 'Relaxed' : diff === 'medium' ? 'Standard' : 'Fast'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button
              id="start-game-btn"
              onClick={() => startGame(selectedGame)}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs transition-colors"
            >
              Start Game {selectedGame === 'word_race' ? `(${raceDifficulty.toUpperCase()})` : ''}
            </button>
          </div>
        )}

        {/* ACTIVE GAMEPLAY */}
        {isPlaying && !isGameOver && (
          <div className="w-full max-w-xl space-y-6 animate-fadeIn">
            
            {/* Game specific status header */}
            <div className="flex items-center justify-between text-xs font-bold px-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Score: {score}</span>
              </div>

              {selectedGame === 'time_attack' && (
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-black">{gameTimer}s remaining</span>
                </div>
              )}

              {selectedGame === 'survival' && (
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <div className="w-24 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${health > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                      style={{ width: `${health}%` }} 
                    />
                  </div>
                  <span>Wave {wave}</span>
                </div>
              )}

              {/* Word Race speed indicator & toggle */}
              {selectedGame === 'word_race' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 text-[11px]">Speed:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    raceDifficulty === 'easy'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : raceDifficulty === 'medium'
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                  }`}>
                    {raceDifficulty}
                  </span>
                </div>
              )}
            </div>

            {/* Word Race Track bar */}
            {selectedGame === 'word_race' && (
              <div className="w-full h-12 bg-slate-100 dark:bg-slate-800 rounded-xl relative overflow-hidden flex items-center px-3 border border-slate-200 dark:border-slate-700">
                <div 
                  className="absolute font-typing font-extrabold text-indigo-600 dark:text-indigo-400 text-base transition-all bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded-md shadow-xs"
                  style={{ left: `${racePosition}%`, transform: 'translateX(-50%)' }}
                >
                  {currentWord}
                </div>
                <div className="absolute right-2 text-rose-500 font-bold text-xs">FINISH</div>
              </div>
            )}

            {/* Target Word Display for Time Attack & Survival */}
            {selectedGame !== 'word_race' && (
              <div className="py-6 font-typing text-4xl sm:text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-wider">
                {currentWord}
              </div>
            )}

            {/* Typing input */}
            <div className="relative max-w-sm mx-auto space-y-1">
              <input
                ref={inputRef}
                type="text"
                value={typedInput}
                onChange={handleInputChange}
                placeholder="Type here..."
                autoFocus
                className={`w-full text-center py-3 text-xl font-typing font-bold rounded-xl border-2 transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden shadow-sm ${
                  hasTypingMistake 
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/40 text-rose-600 ring-2 ring-rose-500/20' 
                    : 'border-indigo-500'
                }`}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
              {hasTypingMistake && (
                <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400 animate-pulse">
                  Wrong letter! Waiting for correct letter...
                </div>
              )}
            </div>
          </div>
        )}

        {/* GAME OVER CARD */}
        {isGameOver && (
          <div className="space-y-4 max-w-sm animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Game Complete</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                Final Score: {score}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                High Score: {Math.max(highScore[selectedGame], score)} points
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                id="play-game-again-btn"
                onClick={() => startGame(selectedGame)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xs"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
