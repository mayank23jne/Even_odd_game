import React, { useEffect } from 'react';
import './CSS/SmileyCelebration.css';

interface CelebrationProps {
  onComplete: () => void;
  title: string | null;
}

const Celebration7: React.FC<CelebrationProps> = ({ onComplete, title }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Generate exact same smileys as original
  const smileys = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 90,
    y: Math.random() * 90,
    delay: Math.random() * 2,
    size: 40 + Math.random() * 40,
    color: ['#FFD93D', '#FF6B9D', '#4ECDC4', '#A78BFA', '#6BCF7F'][i % 5],
  }));

  return (
    <div className="smiley-celebration" aria-hidden="true">
      {/* Background */}
      <div className="smiley-bg" />

      {/* Title with exact bounce animation */}
      <div className="smiley-title-wrapper">
        <h1 className="smiley-title">
          {title || "PERFECT!"}
        </h1>
      </div>

      {/* Smiley faces - exact same animation */}
      {smileys.map((smiley) => (
        <div
          key={smiley.id}
          className="smiley-face"
          style={{
            left: `${smiley.x}%`,
            top: `${smiley.y}%`,
            animationDelay: `${smiley.delay}s`,
          }}
        >
          <svg width={smiley.size} height={smiley.size} viewBox="0 0 100 100">
            {/* Face circle with shadow */}
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill={smiley.color}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))' }}
            />
            
            {/* Left eye */}
            <circle cx="35" cy="40" r="5" fill="#000" />
            
            {/* Right eye */}
            <circle cx="65" cy="40" r="5" fill="#000" />
            
            {/* Smile */}
            <path 
              d="M 30 60 Q 50 75 70 60" 
              stroke="#000" 
              strokeWidth="4" 
              fill="none" 
              strokeLinecap="round"
            />
            
            {/* Shine effect */}
            <ellipse 
              cx="25" 
              cy="30" 
              rx="8" 
              ry="12" 
              fill="white" 
              opacity="0.4"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default Celebration7;
