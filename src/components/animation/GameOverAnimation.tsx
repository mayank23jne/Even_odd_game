import React, { useEffect } from 'react';
import './CSS/GameOverAnimation.css';

interface GameOverAnimationProps {
  onComplete: () => void;
}

const ANIMATION_DURATION = 3000;
const PARTICLE_COUNT = 40;

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const GameOverAnimation: React.FC<GameOverAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate particles with positions
  const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const radius = getRandom(200, 350);
    const endX = Math.cos(angle) * radius;
    const endY = Math.sin(angle) * radius;
    const size = getRandom(6, 12);
    const color = i % 2 === 0 ? '#667eea' : '#a78bfa';
    const delay = i * 0.015;

    return {
      id: `particle-${i}`,
      endX,
      endY,
      size,
      color,
      delay,
    };
  });

  return (
    <div className="game-over-container" aria-hidden="true">
      {/* Central glow effect */}
      <div className="central-glow" />

      {/* Shockwave ring */}
      <div className="shockwave-ring" />

      {/* Particles */}
      <div className="particles-container">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              animationDelay: `${p.delay}s`,
              ['--endX' as any]: p.endX,
              ['--endY' as any]: p.endY,
            }}
          />
        ))}
      </div>

      {/* Text content */}
      <div className="text-content">
        {/* Game Over text with individual letters */}
        <div className="game-over-text">
          {"GAME OVER".split("").map((char, i) => (
            <span key={i} className="letter">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <div className="subtitle-text subtitle-glow">
          {"Nice Try!".split("").map((char, i) => (
            <span key={i} className="letter">
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameOverAnimation;
