import React, { useEffect } from 'react';
import './CSS/SimpleCelebration.css';

interface CelebrationProps {
  onComplete: () => void;
  title: string | null;
}

const Celebration5: React.FC<CelebrationProps> = ({ onComplete, title }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate exact same fireworks as original
  const fireworks = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    x: 20 + Math.random() * 60,
    y: 20 + Math.random() * 60,
    delay: Math.random() * 2,
    color: ['#FF6B9D', '#FFD93D', '#6BCF7F', '#4ECDC4', '#A78BFA', '#F472B6'][i % 6],
  }));

  return (
    <div className="exact-celebration" aria-hidden="true">
      {/* Background */}
      <div className="exact-bg" />

      {/* Title - exact same gradient animation */}
      <div className="exact-title-wrapper">
        <h1 className="exact-title">
          {title || "BRILLIANT!"}
        </h1>
      </div>

      {/* Fireworks - exact same burst pattern */}
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="exact-firework"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
          }}
        >
          {/* 12 particles in a circle - exact same as original */}
          {Array.from({ length: 12 }).map((_, i) => {
            // Calculate exact angle for each particle (same as original)
            const angle = (i * 30) * (Math.PI / 180); // 30 degrees * i
            const distance = 80; // Same distance as original
            const exactX = Math.cos(angle) * distance;
            const exactY = Math.sin(angle) * distance;

            return (
              <div
                key={i}
                className="exact-particle"
                style={{
                  ['--exactX' as any]: exactX,
                  ['--exactY' as any]: exactY,
                  animationDelay: `${firework.delay}s`,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={firework.color}>
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Celebration5;
