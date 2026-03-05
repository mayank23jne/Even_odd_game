import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, questions as questionsApi, gameSessions, monthlyScores, userStats, yesNoQuestions } from "@/lib/api";
import { toast } from "sonner";
import guestQuestions from "../lib/guest-questions.json";
import yesNoGuestQuestions from "../lib/yesNoquestion.json";
import { useGameAudio } from "@/hooks/useGameAudio";
import StartScreen from "@/components/game/StartScreen";
import GamePlay from "@/components/game/GamePlay";
import AnimationOverlay, {
  preloadCelebration,
  preloadSadAnimation,
  preloadGameOverAnimation,
  CELEBRATION_COMPONENTS,
  SAD_ANIMATION_COMPONENTS
} from "@/components/game/AnimationOverlay";
import { calculateScore, shuffleArray } from "@/lib/gameUtils";
import { Question } from "@/types/game";
import GameOver from "@/components/game/GameOver";
import { useBGMusicStore } from "@/store/useBGMusicStore";
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import YesNoGamePlay from "@/components/game/YesNoGamePlay";

const MAX_LIVES = 3;

const Game = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuestMode = searchParams.get("mode") === "guest";
  const isOddEven = searchParams.get("type") === "odd-even";
  const { playSound } = useGameAudio();
  const pause = useBGMusicStore(state => state.pause);
  const resume = useBGMusicStore(state => state.resume);

  console.log('SEARCH PARAMS:', searchParams.get("type"));

  const [user, setUser] = useState<any>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize duration from localStorage
  const [gameDuration, setGameDuration] = useState(() => {
    const saved = localStorage.getItem("gameDuration");
    return saved ? Number(saved) : 60;
  });

  const [timeRemaining, setTimeRemaining] = useState(gameDuration);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showSadAnimation, setShowSadAnimation] = useState(false);
  const [celebrationIndex, setCelebrationIndex] = useState(0);
  const [sadAnimationIndex, setSadAnimationIndex] = useState(0);
  const [showGameOverAnimation, setShowGameOverAnimation] = useState(false);
  const [showGameFinishAnimation, setShowGameFinishAnimation] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [endReason, setEndReason] = useState<"win" | "time" | "lives" | null>(null);
  const [appIsActive, setAppIsActive] = useState(true);

  // appStateChange listener (background/foreground) to pause timer
  useEffect(() => {
    let appStateListener: any;
    let pauseListener: any;
    let resumeListener: any;

    const handleVisibilityChange = () => {
      const isActive = document.visibilityState === 'visible';
      console.log('👁️ Game.tsx: Visibility changed:', isActive ? 'VISIBLE' : 'HIDDEN');
      setAppIsActive(isActive);
    };

    // 1. Web Visibility API (Instant response for WebView)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 2. Capacitor App State (Native platform specific)
    if (Capacitor.isNativePlatform()) {
      // Get initial state immediately
      CapacitorApp.getState().then(({ isActive }) => {
        console.log('📱 Game.tsx: Initial Capacitor state:', isActive ? 'FOREGROUND' : 'BACKGROUND');
        setAppIsActive(isActive);
      });

      // Primary state listener
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        console.log('📱 Game.tsx: appStateChange:', isActive ? 'FOREGROUND' : 'BACKGROUND');
        setAppIsActive(isActive);
      }).then(l => appStateListener = l);

      // Backup listeners for older Android / edge cases
      CapacitorApp.addListener('pause', () => {
        console.log('📱 Game.tsx: App PAUSED');
        setAppIsActive(false);
      }).then(l => pauseListener = l);

      CapacitorApp.addListener('resume', () => {
        console.log('📱 Game.tsx: App RESUMED');
        setAppIsActive(true);
      }).then(l => resumeListener = l);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (appStateListener) appStateListener.remove();
      if (pauseListener) pauseListener.remove();
      if (resumeListener) resumeListener.remove();
    };
  }, []);

  // Preload animations on game start
  useEffect(() => {
    if (gameStarted) {
      preloadCelebration(0);
      preloadSadAnimation(0);
      setTimeout(() => {
        preloadGameOverAnimation();
      }, 2000);
    }
  }, [gameStarted]);

  // Preload next celebration
  useEffect(() => {
    if (showCelebration) {
      const nextIndex = (celebrationIndex + 1) % CELEBRATION_COMPONENTS.length;
      preloadCelebration(nextIndex);
    }
  }, [showCelebration, celebrationIndex]);

  // Preload next sad animation
  useEffect(() => {
    if (showSadAnimation) {
      const nextIndex = (sadAnimationIndex + 1) % SAD_ANIMATION_COMPONENTS.length;
      preloadSadAnimation(nextIndex);
    }
  }, [showSadAnimation, sadAnimationIndex]);

  // Preload game over
  useEffect(() => {
    if (lives <= 1 || timeRemaining <= 10) {
      preloadGameOverAnimation();
    }
  }, [lives, timeRemaining]);

  // // Preload level change
  // useEffect(() => {
  //   const currentLevel = Math.floor(score / 100) + 1;
  //   const pointsToNextLevel = (currentLevel * 100) - score;
  //   if (pointsToNextLevel <= 20) {
  //     preloadLevelChangeAnimation();
  //   }          
  // }, [score]);

  // local back button listener - Block Pura Hi (Completely)
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    // 1. Intercept Hardware Back Button (Capacitor Android)
    const initHardwareBack = async () => {
      const backHandler = await CapacitorApp.addListener("backButton", (data) => {
        console.log('🚫 [FORTIFIED] Hardware back button BLOCKED');
        // This consumed the event, so Capacitor won't pulse the Android back behavior.
      });
      return backHandler;
    };

    const hardwareHandlerPromise = initHardwareBack();

    // 2. Disable Browser Back Navigation (React / Web / Gestures)
    // We push a dummy state to create a history buffer.
    // This traps the user on the current full URL including query params.
    window.history.pushState(null, '', window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      if (gameStarted && !gameOver) {
        console.log('🚫 [FORTIFIED] Browser back button/gesture BLOCKED for:', window.location.pathname);
        // Instantly push back to keep the user trapped in the current URL with params
        window.history.pushState(null, '', window.location.href);
      }
    };

    window.addEventListener('popstate', handlePopState);

    // 3. Prevent page refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (gameStarted && !gameOver) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // 4. Proper Cleanup
    return () => {
      hardwareHandlerPromise.then(handler => handler.remove());
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      console.log('🔓 Back button restrictions removed');
    };
  }, [gameStarted, gameOver]);


  // Auth check
  useEffect(() => {
    if (!isGuestMode) {
      if (!auth.isAuthenticated()) {
        navigate("/auth");
      } else {
        setUser(auth.getUser());
      }
    }
  }, [isGuestMode, navigate]);

  // Timer
  useEffect(() => {
    if (!gameStarted || isPaused || gameOver || !appIsActive) return;

    const timer = setInterval(() => {
      // Direct verification: If document is hidden, BAIL OUT immediately
      if (document.hidden) {
        console.log('🛑 [FORCE-STOP] Timer tick skipped - document.hidden is true');
        return;
      }

      setTimeRemaining((prev) => {
        if (prev <= 0) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isPaused, gameOver, appIsActive]);

  // Handle timer expiration separately to access fresh state
  useEffect(() => {
    if (timeRemaining <= 0 && gameStarted && !gameOver) {
      endGame("time");
    }
  }, [timeRemaining, gameStarted, gameOver]); // Removed endGame from deps

  // Check lives
  useEffect(() => {
    if (lives <= 0 && !showSadAnimation && !gameOver) {
      endGame("lives");
    }
  }, [lives, showSadAnimation, gameOver]); // Removed endGame from deps

  // Pause background music during animations
  useEffect(() => {
    if (showSadAnimation || showCelebration || showGameOverAnimation || showGameFinishAnimation) {
      document.body.style.pointerEvents = "none";
      pause();
    } else {
      document.body.style.pointerEvents = "auto";
      resume();
    }
  }, [showSadAnimation, showCelebration, showGameOverAnimation, showGameFinishAnimation, pause, resume]);
  const loadQuestions = useCallback(async () => {
    try {
      let data: any[] = [];
      let rawData: any;

      if (isGuestMode) {
        data = isOddEven
          ? shuffleArray(guestQuestions).slice(0, 20)
          : shuffleArray(yesNoGuestQuestions).slice(0, 20);
      } else {
        let allQuestions: any[] = [];
        if (isOddEven) {
          const response = await questionsApi.getAll();
          allQuestions = Array.isArray(response) ? response : (response.data || response.questions || []);
        } else {
          const response = await yesNoQuestions.getAll(undefined, 500, 0); // Increased limit to find more levels
          allQuestions = Array.isArray(response) ? response : (response.data || response.questions || []);
        }

        // Get questions played from localStorage
        const playedIds = JSON.parse(localStorage.getItem("played_questions") || "[]");

        // Strategy: 
        // 1. Try to get 1 question for each level (1-20)
        // 2. If we have < 20 questions, fill the remaining slots with ANY unplayed questions
        // 3. Finally, if still < 20, fill with ANY questions (even played ones)

        const selectedQuestions: any[] = [];
        const usedIds = new Set<string>();

        // Step 1: One per level
        for (let l = 1; l <= 20; l++) {
          let levelQuestions = allQuestions.filter((q: any) =>
            (Number(q.level) === l || Number(q.level_number) === l) && !usedIds.has(String(q.id))
          );

          if (levelQuestions.length > 0) {
            let unplayed = levelQuestions.filter((q: any) => !playedIds.includes(String(q.id)));
            const picked = unplayed.length > 0 ? shuffleArray(unplayed)[0] : shuffleArray(levelQuestions)[0];

            if (picked) {
              selectedQuestions.push(picked);
              usedIds.add(String(picked.id));
            }
          }
        }

        // Step 2: Fill remaining slots from unplayed pool
        if (selectedQuestions.length < 20) {
          const remainingPool = allQuestions.filter(q => !usedIds.has(String(q.id)) && !playedIds.includes(String(q.id)));
          const shuffledRemaining = shuffleArray(remainingPool);

          while (selectedQuestions.length < 20 && shuffledRemaining.length > 0) {
            const picked = shuffledRemaining.pop();
            if (picked) {
              selectedQuestions.push(picked);
              usedIds.add(String(picked.id));
            }
          }
        }

        // Step 3: Last resort - fill with ANY questions from the pool
        if (selectedQuestions.length < 20) {
          const pool = allQuestions.filter(q => !usedIds.has(String(q.id)));
          const shuffledPool = shuffleArray(pool);

          while (selectedQuestions.length < 20 && shuffledPool.length > 0) {
            const picked = shuffledPool.pop();
            if (picked) {
              selectedQuestions.push(picked);
              usedIds.add(String(picked.id));
            }
          }
        }

        data = selectedQuestions;
      }

      const shuffledQuestions = data.map((q: any, index: number) => {
        let options: { option: string; value: string }[] = [];

        // Normalize question text
        const questionText = q.question_text || q.question;

        if (isOddEven || (isGuestMode && isOddEven)) {
          // MCQ style
          options = shuffleArray([
            { option: "option1", value: q.option1 },
            { option: "option2", value: q.option2 },
            { option: "option3", value: q.option3 },
            { option: "option4", value: q.option4 },
          ]);
        } else {
          // Yes/No style
          options = [
            { option: "option1", value: q.option1 || (q.options ? q.options[0] : "Yes") },
            { option: "option2", value: q.option2 || (q.options ? q.options[1] : "No") },
          ];
        }

        // Normalize correct answer key
        let correctAnswer: string;
        if (!isGuestMode) {
          // Priority: correct_option (new) -> correctAnswer/answer (legacy)
          correctAnswer = q.correct_option || q.correctOption || q.answer || q.correctAnswer || "option4";
        } else {
          // Handle guest mode naming conventions
          correctAnswer = q.correct_option || q.correctOption || q.answer || q.correctAnswer;
        }

        return {
          ...q,
          question_text: questionText,
          level: index + 1,
          correctAnswer: correctAnswer,
          options,
          hint: q.hint,
        };
      });

      setQuestions(shuffledQuestions);
      setCurrentQuestion(shuffledQuestions[0]);
    } catch (error) {
      toast.error("Failed to load questions");
      console.error(error);
    }
  }, [isGuestMode, isOddEven]);

  const startGame = useCallback(async () => {
    // Refresh duration from storage in case it changed
    const savedDuration = localStorage.getItem("gameDuration");
    const duration = savedDuration ? Number(savedDuration) : 60;
    setGameDuration(duration);
    setTimeRemaining(duration);

    await loadQuestions();
    setGameStarted(true);
  }, [loadQuestions]);

  const saveGameSession = useCallback(async (finalScore: number, finalTimeTaken: number, finalQuestionsAnswered: number, finalQuestionsCorrect: number) => {
    console.log('[SAVE-GAME] saveGameSession called');
    console.log('[SAVE-GAME] isGuestMode:', isGuestMode, 'user:', user);
    console.log('[SAVE-GAME] Data:', { finalScore, finalTimeTaken, finalQuestionsAnswered, finalQuestionsCorrect });

    if (!isGuestMode && user) {
      try {
        console.log('[SAVE-GAME] Calling gameSessions.create...');
        const result = await gameSessions.create({
          score: finalScore,
          questionsAnswered: finalQuestionsAnswered,
          correctAnswers: finalQuestionsCorrect,
          timeTaken: finalTimeTaken,
          livesUsed: MAX_LIVES - lives,
        });
        console.log('[SAVE-GAME] Success:', result);
      } catch (error) {
        console.error("[SAVE-GAME] Error saving game:", error);
      }
    } else {
      console.log('[SAVE-GAME] Skipped - Guest mode or no user');
    }
  }, [isGuestMode, user, lives]);

  const endGame = useCallback(async (reason: "time" | "lives") => {
    if (gameOver) return;
    // setGameOver(true); // Removed to allow animation to show first
    setShowGameOverAnimation(true);
    setIsPaused(true);
    setEndReason(reason);

    // Different sounds for different reasons
    if (reason === "time") {
      playSound("gamewon"); // Play a "better" sound for time over as they played good
    } else {
      playSound("gameover");
    }

    saveGameSession(score, gameDuration - timeRemaining, questionsAnswered, questionsCorrect);
  }, [score, timeRemaining, questionsAnswered, questionsCorrect, playSound, saveGameSession, gameOver, gameDuration]);

  const finishGame = useCallback(async () => {
    setShowGameFinishAnimation(true);
    setIsPaused(true);
    setEndReason("win");
    playSound("gamewon");
    saveGameSession(score, gameDuration - timeRemaining, questionsAnswered, questionsCorrect);
  }, [score, timeRemaining, questionsAnswered, questionsCorrect, playSound, saveGameSession, gameDuration]);


  const handleAnswer = useCallback(
    async (selectedOption: string) => {
      if (!currentQuestion) return;

      setIsPaused(true);

      const level = currentQuestion.level;
      const isCorrect = currentQuestion.correctAnswer === selectedOption;

      if (isOddEven || isGuestMode) {
        // console.log(`MCQ: selected=${selectedOption}, correct=${currentQuestion.correctAnswer}`);
        console.log(`MCQ: selected=${selectedOption}, correct=${currentQuestion.correctAnswer}`);
      } else {
        console.log(`Yes/No: selected=${selectedOption}, correct=${currentQuestion.correctAnswer}`);
      }

      if (isCorrect) {
        const questionScore = calculateScore(level, wrongAttempts);
        const newScore = score + questionScore;

        // Special celebration for 1000+ points
        if (score < 1000 && newScore >= 1000) {
          playSound("gamewon");
          toast.success("AMAZING! You reached 1000 points! 🎉", {
            duration: 5000,
          });
        }

        setScore(newScore);
        setQuestionsAnswered(prev => prev + 1);
        setQuestionsCorrect(prev => prev + 1);
        setWrongAttempts(0);

        // Mark as played locally
        if (!isGuestMode) {
          const playedIds = JSON.parse(localStorage.getItem("played_questions") || "[]");
          if (!playedIds.includes(currentQuestion.id)) {
            playedIds.push(currentQuestion.id);
            localStorage.setItem("played_questions", JSON.stringify(playedIds));
          }
        }

        setCelebrationIndex(Math.floor(Math.random() * 5));
        setShowCelebration(true);
        playSound("correct");
        return;
      }

      // ❌ Wrong
      setWrongAttempts(prev => {
        const nextAttempt = prev + 1;
        if (nextAttempt <= 3) {
          setLives(l => l - 1);
        }
        return nextAttempt;
      });

      setSadAnimationIndex(Math.floor(Math.random() * 3));
      setShowSadAnimation(true);
      playSound("wrong");

      setTimeout(() => setIsPaused(false), 2000);
    },
    [currentQuestion, wrongAttempts, playSound, isOddEven]
  );



  const handleNext = useCallback(() => {
    setIsPaused(false);

    if (currentQuestionIndex >= questions.length - 1) {
      finishGame();
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex]);

      setWrongAttempts(0); // ✅ reset for new question
    }
  }, [currentQuestionIndex, questions, finishGame]);


  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const handleSadAnimationComplete = useCallback(() => {
    setShowSadAnimation(false);
  }, []);

  const handleGameOverAnimationComplete = useCallback(() => {
    setShowGameOverAnimation(false);
    setGameOver(true);
    setGameWon(false);
  }, []);

  const handleGameComplete = useCallback(() => {
    setShowGameFinishAnimation(false);
    setGameOver(true);
    setGameWon(true);
  }, []);

  if (!gameStarted) {
    return (
      <StartScreen
        isGuestMode={isGuestMode}
        maxLives={MAX_LIVES}
        onStart={startGame}
        onBack={() => navigate("/")}
      />
    );
  }

  if (gameOver) {
    return (
      <GameOver
        score={score}
        gameWon={gameWon}
        endReason={endReason}
        questionsAnswered={questionsAnswered}
        questionsCorrect={questionsCorrect}
        timePlayed={gameDuration - timeRemaining}
        isGuestMode={isGuestMode}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <p className="text-xl text-primary-foreground">Loading questions...</p>
      </div>
    );
  }

  if (isOddEven) {
    return (
      <>
        <AnimationOverlay
          showCelebration={showCelebration}
          celebrationIndex={celebrationIndex}
          onCelebrationComplete={handleCelebrationComplete}
          showSadAnimation={showSadAnimation}
          sadAnimationIndex={sadAnimationIndex}
          onSadAnimationComplete={handleSadAnimationComplete}
          showGameOverAnimation={showGameOverAnimation}
          onGameOverAnimationComplete={handleGameOverAnimationComplete}
          showGameFinishAnimation={showGameFinishAnimation}
          onGameFinishComplete={handleGameComplete}
        />

        <GamePlay
          score={score}
          timeRemaining={timeRemaining}
          totalTime={gameDuration}
          isPaused={isPaused}
          lives={lives}
          maxLives={MAX_LIVES}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onExit={() => navigate("/")}
        />
      </>
    );
  }

  if (!isOddEven) {
    return (
      <>
        <AnimationOverlay
          showCelebration={showCelebration}
          celebrationIndex={celebrationIndex}
          onCelebrationComplete={handleCelebrationComplete}
          showSadAnimation={showSadAnimation}
          sadAnimationIndex={sadAnimationIndex}
          onSadAnimationComplete={handleSadAnimationComplete}
          showGameOverAnimation={showGameOverAnimation}
          onGameOverAnimationComplete={handleGameOverAnimationComplete}
          showGameFinishAnimation={showGameFinishAnimation}
          onGameFinishComplete={handleGameComplete}
        />

        <YesNoGamePlay
          score={score}
          timeRemaining={timeRemaining}
          totalTime={gameDuration}
          isPaused={isPaused}
          lives={lives}
          maxLives={MAX_LIVES}
          currentQuestion={currentQuestion}
          currentQuestionIndex={currentQuestionIndex}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onExit={() => navigate("/")}
        />
      </>
    );
  }
};

export default Game;
