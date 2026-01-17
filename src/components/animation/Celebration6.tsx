import React, { useEffect } from 'react';
import './CSS/ConfettiCelebration.css';

interface CelebrationProps {
  onComplete: () => void;
  title: string | null;
}

const Celebration6: React.FC<CelebrationProps> = ({ onComplete, title }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate exact same confetti as original
  const confetti = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 720,
    color: ['#FF6B9D', '#FFD93D', '#6BCF7F', '#4ECDC4', '#A78BFA', '#F97316'][i % 6],
    shape: ['rect', 'circle', 'triangle'][i % 3],
  }));

  return (
    <div className="confetti-celebration" aria-hidden="true">
      {/* Background */}
      <div className="confetti-bg" />

      {/* Title with exact same bounce animation */}
      <div className="confetti-title-wrapper">
        <h1 className="confetti-title">
          {title || "AWESOME!"}
        </h1>
      </div>

      {/* Confetti pieces - exact same as original */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            ['--rotation' as any]: `${piece.rotation}deg`,
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          {piece.shape === 'rect' && (
            <div 
              className="confetti-rect"
              style={{ backgroundColor: piece.color }}
            />
          )}
          {piece.shape === 'circle' && (
            <div 
              className="confetti-circle"
              style={{ backgroundColor: piece.color }}
            />
          )}
          {piece.shape === 'triangle' && (
            <svg width="12" height="12" viewBox="0 0 20 20">
              <polygon points="10,0 20,20 0,20" fill={piece.color} />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default Celebration6;
