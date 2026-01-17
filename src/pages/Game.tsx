  import { useState, useEffect, useCallback } from "react";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { auth, questions as questionsApi, gameSessions, monthlyScores, userStats , yesNoQuestions} from "@/lib/api";
  import { toast } from "sonner";
  import guestQuestions from "../lib/guest-questions.json";
  import { useGameAudio } from "@/hooks/useGameAudio";
  import StartScreen from "@/components/game/StartScreen";
  import GamePlay from "@/components/game/GamePlay";
  import AnimationOverlay, {
    preloadCelebration,
    preloadSadAnimation,
    preloadGameOverAnimation,
    preloadLevelChangeAnimation,
    CELEBRATION_COMPONENTS,
    SAD_ANIMATION_COMPONENTS
  } from "@/components/game/AnimationOverlay";
  import { calculateScore, shuffleArray } from "@/lib/gameUtils";
  import { Question } from "@/types/game";
  import GameOver from "@/components/game/GameOver";
  import { useBGMusicStore } from "@/store/useBGMusicStore";
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
    const [showLevelChange, setShowLevelChange] = useState(false);
    const [previousLevel, setPreviousLevel] = useState(1);
    const [gameWon, setGameWon] = useState(false);

    // Preload animations on game start
    useEffect(() => {
      if (gameStarted) {
        preloadCelebration(0);
        preloadSadAnimation(0);
        setTimeout(() => {
          preloadGameOverAnimation();
          preloadLevelChangeAnimation();
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
      if (!gameStarted || isPaused || gameOver) return;

      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 0) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [gameStarted, isPaused, gameOver]);

    // Handle timer expiration separately to access fresh state
    useEffect(() => {
      if (timeRemaining <= 0 && gameStarted && !gameOver) {
        endGame();
      }
    }, [timeRemaining, gameStarted, gameOver]); // Removed endGame from deps

    // Check lives
    useEffect(() => {
      if (lives <= 0 && !showSadAnimation && !gameOver) {
        endGame();
      }
    }, [lives, showSadAnimation, gameOver]); // Removed endGame from deps

    // Pause background music during animations
    useEffect(() => {
      if (showSadAnimation || showCelebration || showGameOverAnimation || showLevelChange || showGameFinishAnimation) {
        document.body.style.pointerEvents = "none";
        pause();
      } else {
        document.body.style.pointerEvents = "auto";
        resume();
      }
    }, [showSadAnimation, showCelebration, showGameOverAnimation, showLevelChange, showGameFinishAnimation, pause, resume]);
const loadQuestions = useCallback(async () => {
  try {
    let data: any[] = [];

      if (isGuestMode) {
        data = shuffleArray(guestQuestions).slice(0, 5);
      }
          else {
      if (isOddEven) {
        data = await questionsApi.getAll();
      } else {
        // ✅ Fetch Yes/No questions from API
        data = await yesNoQuestions.getAll();
      }
    }
  

    const shuffledQuestions = shuffleArray(data).map((q: any, index: number) => {
      let options: { option: string; value: string }[] = [];

      if (isOddEven || isGuestMode) {
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
          { option: "option1", value: q.option1 }, // always first
          { option: "option2", value: q.option2 },
        ];
      }

      return {
        ...q,
        level: index + 1,           // ONE LEVEL = ONE QUESTION
         correctAnswer: isGuestMode ? q.answer : q.correct_option,
        options,
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
      if (!isGuestMode && user) {
        try {
          await gameSessions.create({
            user_id: user.id,
            score: finalScore,
            questions_answered: finalQuestionsAnswered,
            correct_answers: finalQuestionsCorrect,
            time_taken: finalTimeTaken,
          });

          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();

          const existingScores = await monthlyScores.get(currentYear, currentMonth);
          const existingScore = existingScores?.[0];

          if (existingScore) {
            await monthlyScores.upsert({
              year: currentYear,
              month: currentMonth,
              total_score: existingScore.total_score + finalScore,
              games_played: existingScore.games_played + 1,
            });
          } else {
            await monthlyScores.upsert({
              year: currentYear,
              month: currentMonth,
              total_score: finalScore,
              games_played: 1,
            });
          }

          const stats = await userStats.get();

          if (stats) {
            await userStats.update({
              total_games_played: stats.total_games_played + 1,
              total_time_played: stats.total_time_played + finalTimeTaken,
              total_questions_answered: stats.total_questions_answered + finalQuestionsAnswered,
              total_questions_correct: stats.total_questions_correct + finalQuestionsCorrect,
              total_score: stats.total_score + finalScore,
              highest_score: Math.max(stats.highest_score, finalScore),
            });
          }
        } catch (error) {
          console.error("Error saving game:", error);
        }
      }
    }, [isGuestMode, user]);

    const endGame = useCallback(async () => {
      if (gameOver) return;
      // setGameOver(true); // Removed to allow animation to show first
      setShowGameOverAnimation(true);
      setIsPaused(true);
      playSound("gameover");
      saveGameSession(score, gameDuration - timeRemaining, questionsAnswered, questionsCorrect);
    }, [score, timeRemaining, questionsAnswered, questionsCorrect, playSound, saveGameSession, gameOver, gameDuration]);

    const finishGame = useCallback(async () => {
      setShowGameFinishAnimation(true);
      setIsPaused(true);
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

      setScore(prev => prev + questionScore);
      setQuestionsAnswered(prev => prev + 1);
      setQuestionsCorrect(prev => prev + 1);
      setWrongAttempts(0);

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

    const newLevel = questions[nextIndex].level;
    if (newLevel > previousLevel) {
      setPreviousLevel(newLevel);
      setShowLevelChange(true);
      playSound("levelup");
    }
  }
}, [currentQuestionIndex, questions, previousLevel, finishGame, playSound]);


    const handleCelebrationComplete = useCallback(() => {
      setShowCelebration(false);
    }, []);

    const handleSadAnimationComplete = useCallback(() => {
      setShowSadAnimation(false);
    }, []);

    const handleLevelChangeComplete = useCallback(() => {
      setShowLevelChange(false);
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

    if(isOddEven) {
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
          showLevelChange={showLevelChange}
          previousLevel={previousLevel}
          onLevelChangeComplete={handleLevelChangeComplete}
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

    if(!isOddEven) {
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
          showLevelChange={showLevelChange}
          previousLevel={previousLevel}
          onLevelChangeComplete={handleLevelChangeComplete}
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
