import { Trophy } from "lucide-react";

interface GameScoreProps {
  score: number;
}

const GameScore = ({ score }: GameScoreProps) => {
  return (
    <div className="flex items-center gap-2 sm:gap-3 bg-white/40 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-primary/20 shadow-inner group hover:scale-105 transition-all duration-300">
      <div className="flex flex-col items-start leading-none gap-0.5">
        <Trophy className="w-4 h-4 text-secondary group-hover:scale-110 transition-transform" />
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Score</p>
      </div>
      <p className="text-xl sm:text-2xl font-black text-primary font-mono">{score}</p>
    </div>
  );
};

export default GameScore;
