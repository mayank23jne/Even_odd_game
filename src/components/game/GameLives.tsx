import { Heart } from "lucide-react";

interface GameLivesProps {
    lives: number;
    maxLives: number;
}

const GameLives = ({ lives, maxLives }: GameLivesProps) => {
    return (
        <div className="flex items-center gap-1 sm:gap-2 bg-white/30 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-xl border border-primary/10">
            <div className="flex gap-0.5 sm:gap-1">
                {Array.from({ length: maxLives }).map((_, index) => (
                    <Heart
                        key={index}
                        className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-500 ${index < lives
                            ? "fill-destructive text-destructive drop-shadow-[0_0_5px_rgba(239,68,68,0.4)]"
                            : "fill-muted/30 text-muted/30 scale-90"
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameLives;
