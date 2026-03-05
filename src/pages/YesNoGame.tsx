import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, yesNoQuestions } from "@/lib/api";
import { toast } from "sonner";
import { useGameAudio } from "@/hooks/useGameAudio";
import StartScreen from "@/components/game/StartScreen";
import GamePlay from "@/components/game/GamePlay";
import AnimationOverlay from "@/components/game/AnimationOverlay";
import { calculateScore, shuffleArray } from "@/lib/gameUtils";
import GameOver from "@/components/game/GameOver";
import { useBGMusicStore } from "@/store/useBGMusicStore";

import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import YesNoGamePlay from "@/components/game/YesNoGamePlay";

const MAX_LIVES = 3;

interface YesNoQuestion {
  id: string;
  level: number;
  question_text: string;
  correctAnswer: "yes" | "no";
  explanation: string;
}

const YesNoGame = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuestMode = searchParams.get("mode") === "guest";

  const { playSound } = useGameAudio();
  const pause = useBGMusicStore(s => s.pause);
  const resume = useBGMusicStore(s => s.resume);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [appIsActive, setAppIsActive] = useState(true);

  // appStateChange listener (background/foreground) to pause timer
  useEffect(() => {
    let appStateListener: any;
    let pauseListener: any;
    let resumeListener: any;

    const handleVisibilityChange = () => {
      const isActive = document.visibilityState === 'visible';
      console.log('👁️ YesNoGame.tsx: Visibility changed:', isActive ? 'VISIBLE' : 'HIDDEN');
      setAppIsActive(isActive);
    };

    // 1. Web Visibility API (Instant response for WebView)
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 2. Capacitor App State (Native platform specific)
    if (Capacitor.isNativePlatform()) {
      // Get initial state immediately
      CapacitorApp.getState().then(({ isActive }) => {
        console.log('📱 YesNoGame.tsx: Initial Capacitor state:', isActive ? 'FOREGROUND' : 'BACKGROUND');
        setAppIsActive(isActive);
      });

      // Primary state listener
      CapacitorApp.addListener('appStateChange', ({ isActive }) => {
        console.log('📱 YesNoGame.tsx: appStateChange:', isActive ? 'FOREGROUND' : 'BACKGROUND');
        setAppIsActive(isActive);
      }).then(l => appStateListener = l);

      // Backup listeners for older Android / edge cases
      CapacitorApp.addListener('pause', () => {
        console.log('📱 YesNoGame.tsx: App PAUSED');
        setAppIsActive(false);
      }).then(l => pauseListener = l);

      CapacitorApp.addListener('resume', () => {
        console.log('📱 YesNoGame.tsx: App RESUMED');
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

  const [gameDuration] = useState(60);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [isPaused, setIsPaused] = useState(false);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [questions, setQuestions] = useState<YesNoQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<YesNoQuestion>();

  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);

  /** LOAD YES / NO QUESTIONS */
  const loadQuestions = useCallback(async () => {
    try {
      const response = await yesNoQuestions.getAll();
      const data = Array.isArray(response) ? response : (response.data || []);
      const shuffled = shuffleArray(data).map((q: any, i: number) => ({
        id: String(q.id),
        level: i + 1,
        question_text: q.question_text || q.question,
        correctAnswer: ((q.answer === true || q.answer === "yes" || q.correct_option === "option1") ? "yes" : "no") as "yes" | "no",
        explanation: q.explanation || "",
      }));

      setQuestions(shuffled);
      setCurrentQuestion(shuffled[0]);
    } catch {
      toast.error("Failed to load Yes/No questions");
    }
  }, []);

  const startGame = async () => {
    await loadQuestions();
    setGameStarted(true);
  };

  /** TIMER */
  useEffect(() => {
    if (!gameStarted || isPaused || gameOver || !appIsActive) return;

    const timer = setInterval(() => {
      // Direct verification: If document is hidden, BAIL OUT immediately
      if (document.hidden) {
        console.log('🛑 [FORCE-STOP] YesNoGame Timer tick skipped - document.hidden is true');
        return;
      }

      setTimeRemaining(t => (t <= 0 ? 0 : t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isPaused, gameOver, appIsActive]);

  /** ANSWER HANDLER */
  const handleAnswer = useCallback(
    (answer: "yes" | "no") => {
      if (!currentQuestion) return;

      setIsPaused(true);
      const isCorrect = answer === currentQuestion.correctAnswer;

      if (isCorrect) {
        const questionScore = calculateScore(currentQuestion.level, wrongAttempts);
        setScore(s => s + questionScore);
        setQuestionsAnswered(q => q + 1);
        setQuestionsCorrect(q => q + 1);
        setWrongAttempts(0);
        playSound("correct");
        return;
      }

      setLives(l => l - 1);
      setWrongAttempts(w => w + 1);
      playSound("wrong");
      setTimeout(() => setIsPaused(false), 1500);
    },
    [currentQuestion, wrongAttempts, playSound]
  );

  const handleNext = () => {
    setIsPaused(false);

    if (currentQuestionIndex >= questions.length - 1) {
      setGameOver(true);
      setGameWon(true);
      return;
    }

    const next = currentQuestionIndex + 1;
    setCurrentQuestionIndex(next);
    setCurrentQuestion(questions[next]);
    setWrongAttempts(0);
  };

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
        questionsAnswered={questionsAnswered}
        questionsCorrect={questionsCorrect}
        timePlayed={gameDuration - timeRemaining}
        isGuestMode={isGuestMode}
      />
    );
  }

  if (!currentQuestion) return null;

  return (
    <GamePlay
      score={score}
      timeRemaining={timeRemaining}
      totalTime={gameDuration}
      isPaused={isPaused}
      lives={lives}
      maxLives={MAX_LIVES}
      currentQuestion={currentQuestion as any}
      currentQuestionIndex={currentQuestionIndex}
      onAnswer={handleAnswer}
      onNext={handleNext}
      onExit={() => navigate("/")}
    />
  );
};

export default YesNoGame;
