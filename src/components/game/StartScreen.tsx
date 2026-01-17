import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { memo, useState } from "react";
import GameSettings from "./GameSettings";

interface StartScreenProps {
    isGuestMode: boolean;
    maxLives: number;
    onStart: () => void;
    onBack: () => void;
}

const StartScreen = memo(({ isGuestMode, maxLives, onStart, onBack }: StartScreenProps) => {
    const [duration, setDuration] = useState(60);
    return (
        <div className="min-h-screen p-4 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
            <div className="absolute inset-0 bg-gradient-to-tl from-secondary/5 via-transparent to-primary/5 animate-pulse" />

            <div className="max-w-2xl w-full space-y-4 sm:space-y-6 relative z-10">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="hover:bg-primary/10 transition-smooth animate-fade-in"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Button>

                <div className="glass rounded-2xl p-6 sm:p-8 md:p-10 shadow-glow border-2 border-primary/20 animate-scale-in">
                    <div className="text-center space-y-4 sm:space-y-6">
                        <div className="space-y-2 sm:space-y-3">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
                                Ready to Play?
                            </h1>
                            <GameSettings onChange={setDuration} />
                            <p className="text-base sm:text-lg text-muted-foreground px-4">
                                {isGuestMode
                                    ? "You'll get 5 questions as a guest. Sign up to play more!"
                                    : "Answer 20 questions in 1 minute. Choose the odd one out!"}
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6">
                            <div className="text-center p-3 sm:p-4 bg-gradient-card rounded-xl border border-border transition-bounce hover:scale-105">
                                <p className="text-2xl sm:text-3xl font-bold text-primary">
                                    {isGuestMode ? "5" : "20"}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Questions</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-gradient-card rounded-xl border border-border transition-bounce hover:scale-105">
                                <p className="text-2xl sm:text-3xl font-bold text-secondary">{duration}s</p>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Time Limit</p>
                            </div>
                            <div className="text-center p-3 sm:p-4 bg-gradient-card rounded-xl border border-border transition-bounce hover:scale-105">
                                <p className="text-2xl sm:text-3xl font-bold text-accent">{maxLives}</p>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">Lives</p>
                            </div>
                        </div>

                        <Button
                            onClick={onStart}
                            className="w-full h-12 sm:h-14 text-lg sm:text-xl font-semibold shadow-glow transition-bounce hover:scale-105"
                            size="lg"
                        >
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                            Start Game
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
});

StartScreen.displayName = "StartScreen";

export default StartScreen;
