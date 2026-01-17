import GameTimer from "@/components/game/GameTimer";
import GameLives from "@/components/game/GameLives";
import GameScore from "@/components/game/GameScore";
import YesNoQuestionCard from "@/components/game/YesNoQuestionCard";
import { Question } from "@/types/game";
import { memo } from "react";
import GamePlay from "./GamePlay";

interface YesNoGamePlayProps {
  score: number;
  timeRemaining: number;
  totalTime: number;
  isPaused: boolean;
  // question_type: string;
  lives: number;
  maxLives: number;
  currentQuestion: Question;
  currentQuestionIndex: number;
  onAnswer: (answer: "yes" | "no") => void;
  onNext: () => void;
  onExit: () => void;
}

const YesNoGamePlay = memo(
  ({
    score,
    timeRemaining,
    totalTime,
    isPaused,
    lives,
    maxLives,
    currentQuestion,
    currentQuestionIndex,
    onAnswer,
    onNext,
  }: YesNoGamePlayProps) => {
    return (
      <div className="min-h-screen p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 via-transparent to-primary/5" />

        <div className="max-w-4xl mx-auto py-1 sm:py-8 space-y-4 sm:space-y-6 relative z-10">
          {/* Top Stats */}
          <div className="glass rounded-xl p-2 sm:p-4 shadow-card border border-primary/20 min-h-[10vh]">
            <div className="flex items-center justify-between gap-3 sm:gap-4">
              <GameTimer
                timeRemaining={timeRemaining}
                totalTime={totalTime}
                isPaused={isPaused}
              />
              <GameScore score={score} />
              <GameLives lives={lives} maxLives={maxLives} />
            </div>
          </div>

          {/* YES / NO Question */}
          <YesNoQuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            onAnswer={onAnswer}
            onNext={onNext}
          />
        </div>
      </div>
    );
  }
);

YesNoGamePlay.displayName = "YesNoGamePlay";
export default YesNoGamePlay;
