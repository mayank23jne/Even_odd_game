import React, { useEffect } from 'react';
import './CSS/Animations.css';

interface SimpleCelebrationProps {
  onComplete: () => void;
  title: string | null;
}

const COLORS = ['#FFD700', '#FF6347', '#4169E1', '#32CD32', '#FF69B4'];

const SimpleCelebration: React.FC<SimpleCelebrationProps> = ({ onComplete, title }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Only 15 confetti pieces
  const confetti = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    left: `${(i * 7) + 5}%`,
    color: COLORS[i % COLORS.length],
    delay: i * 0.1,
    duration: 2 + (i % 3) * 0.5,
  }));

  return (
    <div className="simple-celebration">
      {/* Simple title */}
      <h1 className="simple-title">
        {title || "BRILLIANT! 🎉"}
      </h1>

      {/* Simple confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="simple-confetti"
          style={{
            left: c.left,
            backgroundColor: c.color,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SimpleCelebration;
