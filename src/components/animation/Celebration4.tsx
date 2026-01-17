import React, { useEffect } from 'react';

interface CelebrationProps {
  onComplete: () => void;
  title: string | null;
}

const ANIMATION_DURATION = 4000;
const BUBBLE_COUNT = 50;
const COLORS = ['#00CED1', '#1E90FF', '#87CEEB', '#4682B4', '#5F9EA0'];

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const Bubble: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div 
    className="absolute rounded-full animate-float opacity-70" 
    style={{
      ...style,
      boxShadow: 'inset 0 0 10px rgba(255,255,255,0.5)',
    }}
  />
);

const Celebration4: React.FC<CelebrationProps> = ({ onComplete, title }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const bubbles = Array.from({ length: BUBBLE_COUNT }).map((_, i) => ({
    id: `bubble-${i}`,
    left: `${getRandom(0, 100)}%`,
    bottom: `${getRandom(-10, 0)}%`,
    animationDelay: `${getRandom(0, 2)}s`,
    animationDuration: `${getRandom(4, 8)}s`,
    backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    width: `${getRandom(20, 60)}px`,
    height: `${getRandom(20, 60)}px`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-gradient-to-t from-blue-200/20 to-transparent" aria-hidden="true">
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-black text-cyan-500 animate-scale-in" style={{ textShadow: '0 0 20px #00CED1, 0 0 40px #1E90FF' }}>
          {title ? title : "FANTASTIC!"}
        </h1>
      </div>
      
      {bubbles.map(b => (
        <Bubble 
          key={b.id} 
          style={{ 
            left: b.left, 
            bottom: b.bottom,
            animationDelay: b.animationDelay,
            animationDuration: b.animationDuration,
            backgroundColor: b.backgroundColor,
            width: b.width,
            height: b.height,
          }} 
        />
      ))}
    </div>
  );
};

export default Celebration4;
