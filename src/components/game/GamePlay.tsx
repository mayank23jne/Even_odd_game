import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import GameTimer from "@/components/game/GameTimer";
import GameLives from "../game/GameLives";
import GameScore from "@/components/game/GameScore";
import QuestionCard from "@/components/game/QuestionCard";
import { Question } from "@/types/game";
import { memo, useState } from "react";
import { X } from "lucide-react";
import QuitGameModal from "./QuitGameModal";

interface GamePlayProps {
    score: number;
    timeRemaining: number;
    totalTime: number;
    isPaused: boolean;
    lives: number;
    maxLives: number;
    currentQuestion: Question;
    currentQuestionIndex: number;
    onAnswer: (selectedOption: string) => void;
    onNext: () => void;
    onExit: () => void;
}

const GamePlay = memo(({
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
    onExit
}: GamePlayProps) => {
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    return (
        <div className="min-h-screen p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
            <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 via-transparent to-primary/5" />

            {/* Quit Button
            <button
                onClick={() => setIsQuitModalOpen(true)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full
                          bg-white/80 hover:bg-white shadow-md
                          text-destructive transition hover:scale-110"
                aria-label="Quit Game"
            >
                <X className="w-5 h-5" />
            </button> */}

            <QuitGameModal
                open={isQuitModalOpen}
                onOpenChange={setIsQuitModalOpen}
                onConfirm={onExit}
            />

            <div className="max-w-4xl mx-auto py-8 sm:py-8 space-y-4 sm:space-y-6 relative z-10">
                {/* <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4 min-h-[10vh]">
                    <Button
                        variant="ghost"
                        onClick={onExit}
                        className="hover:bg-primary/10 transition-smooth"
                        size="sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Exit
                    </Button>
                </div> */}

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

                <QuestionCard
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    onAnswer={onAnswer}
                    onNext={onNext}
                />
            </div>
        </div>
    );
});

GamePlay.displayName = "GamePlay";

export default GamePlay;
