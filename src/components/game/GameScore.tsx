import { Trophy } from "lucide-react";

interface GameScoreProps {
                                  score: number;
}

const GameScore = ({ score }: GameScoreProps) => {
  return (
    <div className="flex items-center gap-3 bg-gradient-card px-4 py-1 rounded-lg border border-border shadow-card">
      <div>
      <Trophy className="w-5 h-5 text-secondary" />
      <p className="text-[10px] text-muted-foreground">Score</p>
      </div>
        <p className="text-2xl font-bold text-primary">{score}</p>
    </div>
  );
};

export default GameScore;
