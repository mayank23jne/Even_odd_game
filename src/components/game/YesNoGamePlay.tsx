import GameTimer from "@/components/game/GameTimer";
import GameLives from "@/components/game/GameLives";
import GameScore from "@/components/game/GameScore";
import YesNoQuestionCard from "@/components/game/YesNoQuestionCard";
import { Question } from "@/types/game";
import { memo, useState } from "react";
import { X } from "lucide-react";
import QuitGameModal from "./QuitGameModal";
import { Button } from "@/components/ui/button";

interface YesNoGamePlayProps {
  score: number;
  timeRemaining: number;
  totalTime: number;
  isPaused: boolean;
  lives: number;
  maxLives: number;
  currentQuestion: Question;
  currentQuestionIndex: number;
  onAnswer: (answer: "option1" | "option2") => void;
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
    onExit,
  }: YesNoGamePlayProps) => {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    return (
      <div className="min-h-screen p-4 sm:p-6 relative overflow-hidden bg-[#fafafa]">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-background to-secondary/15" />
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/5 via-transparent to-secondary/5" />


        <div className="max-w-4xl mx-auto py-8 sm:py-8 space-y-4 sm:space-y-8 relative z-10">
          {/* Top Stats Header */}
          <div className="glass rounded-xl p-2 sm:p-4 shadow-card border border-primary/20 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center justify-between  sm:gap-4 flex-1">
                <GameTimer
                  timeRemaining={timeRemaining}
                  totalTime={totalTime}
                  isPaused={isPaused}
                />
                <GameScore score={score} />
                <GameLives lives={lives} maxLives={maxLives} />
              </div>


            </div>
          </div>

          {/* YES / NO Question Context */}
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
