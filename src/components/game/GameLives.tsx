import { Heart } from "lucide-react";

interface GameLivesProps {
  lives: number;
  maxLives: number;
}

const GameLives = ({ lives, maxLives }: GameLivesProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* <span className="text-sm font-medium text-muted-foreground">Lives:</span> */}
      <div className="flex gap-1">
        {Array.from({ length: maxLives }).map((_, index) => (
          <Heart
            key={index}
            className={`w-6 h-6 ${
              index < lives
                ? "fill-destructive text-destructive"
                : "fill-muted text-muted"
            } transition-all`}
          />
        ))}
      </div>
    </div>
  );
};

export default GameLives;
