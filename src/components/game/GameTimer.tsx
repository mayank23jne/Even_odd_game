import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

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

  // Determine timer color based on remaining time
  const timerColor = displayTime < 10 ? "text-destructive" : (displayTime < 30 ? "text-secondary" : "text-primary");
  const progressColor = displayTime < 10 ? "bg-destructive" : (displayTime < 30 ? "bg-secondary" : "bg-primary");

  return (
    <div className="flex flex-col gap-1 min-w-[70px] sm:min-w-[90px]">
      <div className={`flex items-center gap-1.5 sm:gap-2 ${timerColor} transition-colors duration-500`}>
        <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${displayTime < 10 ? "animate-pulse" : ""}`} />
        <span className="text-xl sm:text-2xl font-black font-mono tracking-tighter shadow-sm">
          {minutes}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <div className="h-1.5 sm:h-2 w-full bg-muted/30 rounded-full overflow-hidden border border-muted/20">
        <div
          className={`h-full ${progressColor} transition-all duration-1000 ease-linear rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default GameTimer;
