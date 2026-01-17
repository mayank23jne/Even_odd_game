import React, { useEffect } from 'react';
import './CSS/BalloonCelebration.css';

interface CelebrationProps {
  onComplete: () => void;
  title: string | null;
}

const ANIMATION_DURATION = 4000;

const BalloonCelebration: React.FC<CelebrationProps> = ({ onComplete, title }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate balloons
  const balloons = Array.from({ length: 15 }).map((_, i) => {
    const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF6B6B', '#A8E6CF', '#FF8B94', '#C7CEEA'];
    const x = 10 + Math.random() * 80;
    const delay = Math.random() * 1.5;
    const duration = 3 + Math.random() * 2;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 40 + Math.random() * 30;
    const sway = 20 + Math.random() * 40;
    const targetY = -(typeof window !== 'undefined' ? window.innerHeight : 800) - 150;
    
    return { id: i, x, delay, duration, color, size, sway, targetY };
  });

  // Generate confetti
  const confetti = Array.from({ length: 60 }).map((_, i) => {
    const shapes = ['rect', 'circle', 'triangle'];
    const colors = ['#FF6B9D', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF6B6B', '#A8E6CF', '#FF8B94'];
    return {
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 2.5 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 720,
    };
  });

  return (
    <div className="balloon-celebration" aria-hidden="true">
      {/* Background */}
      <div className="balloon-bg" />

      {/* Title */}
      <div className="balloon-title-wrapper">
        <div className="balloon-title-inner">
          <h1 className="balloon-title">
            {title || "AMAZING!"}
          </h1>
        </div>
      </div>

      {/* Balloons */}
      {balloons.map((balloon) => (
        <div
          key={`balloon-${balloon.id}`}
          className="balloon"
          style={{
            left: `${balloon.x}%`,
            bottom: '-10%',
            ['--targetY' as any]: balloon.targetY,
            ['--sway' as any]: balloon.sway,
            ['--swayAngle' as any]: balloon.id,
            animationDuration: `${balloon.duration}s`,
            animationDelay: `${balloon.delay}s`,
          }}
        >
          <svg width={balloon.size} height={balloon.size * 1.2} viewBox="0 0 100 120">
            <ellipse 
              cx="50" 
              cy="45" 
              rx="35" 
              ry="42" 
              fill={balloon.color}
              stroke="#000"
              strokeWidth="2"
              style={{ filter: 'drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.2))' }}
            />
            <ellipse 
              cx="40" 
              cy="30" 
              rx="12" 
              ry="18" 
              fill="white"
              opacity="0.4"
            />
            <line 
              x1="50" 
              y1="87" 
              x2="50" 
              y2="110" 
              stroke="#666"
              strokeWidth="2"
            />
            <circle cx="50" cy="87" r="3" fill="#666" />
          </svg>
        </div>
      ))}


      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={`confetti-${piece.id}`}
          className="confetti-piece"
          style={{
            left: `${piece.x}%`,
            top: '-5%',
            ['--rotation' as any]: `${piece.rotation}deg`,
            animationDuration: `${piece.duration}s`,
            animationDelay: `${piece.delay}s`,
          }}
        >
          {piece.shape === 'rect' && (
            <div 
              style={{ 
                width: piece.size, 
                height: piece.size * 1.5, 
                backgroundColor: piece.color,
                borderRadius: '2px',
              }} 
            />
          )}
          {piece.shape === 'circle' && (
            <div 
              style={{ 
                width: piece.size, 
                height: piece.size, 
                backgroundColor: piece.color,
                borderRadius: '50%',
              }} 
            />
          )}
          {piece.shape === 'triangle' && (
            <svg width={piece.size} height={piece.size} viewBox="0 0 20 20">
              <polygon points="10,0 20,20 0,20" fill={piece.color} />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default BalloonCelebration;
