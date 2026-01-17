import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, questions as questionsApi } from "@/lib/api";
import { toast } from "sonner";
import { useGameAudio } from "@/hooks/useGameAudio";
import StartScreen from "@/components/game/StartScreen";
import GamePlay from "@/components/game/GamePlay";
import AnimationOverlay from "@/components/game/AnimationOverlay";
import { calculateScore, shuffleArray } from "@/lib/gameUtils";
import GameOver from "@/components/game/GameOver";
import { useBGMusicStore } from "@/store/useBGMusicStore";

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
      const data = await questionsApi.getYesNo(); // 🔴 API for yes/no
      const shuffled = shuffleArray(data).map((q: any, i: number) => ({
        id: q.id,
        level: i + 1,
        question_text: q.question,
        correctAnswer: q.answer === true ? "yes" : "no",
        explanation: q.explanation,
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
    if (!gameStarted || isPaused || gameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining(t => (t <= 0 ? 0 : t - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStarted, isPaused, gameOver]);

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
