import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GameTimerProps {
  timeRemaining: number;
  totalTime: number;
  isPaused: boolean;
}

const GameTimer = ({ timeRemaining, totalTime, isPaused }: GameTimerProps) => {
  const [displayTime, setDisplayTime] = useState(timeRemaining);

  useEffect(() => {
    setDisplayTime(timeRemaining);
  }, [timeRemaining]);

  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const percentage = (displayTime / totalTime) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-game-timer">
        <Clock className="w-5 h-5" />
        <span className="text-2xl font-bold font-mono">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
        {/* {isPaused && (
          <span className="text-sm text-muted-foreground ml-2">(Paused)</span>
        )} */}
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

export default GameTimer;
