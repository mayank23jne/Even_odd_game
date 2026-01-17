import React, { useEffect } from 'react';

interface SadAnimationProps {
  onComplete: () => void;
}

const ANIMATION_DURATION = 2000;
const SWIRL_COUNT = 20;

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const Swirl: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div 
    className="absolute rounded-full border-2 border-purple-400 opacity-40 animate-spin" 
    style={{
      ...style,
      animationDuration: '2s',
    }}
  />
);

const SadAnimation5: React.FC<SadAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const swirls = Array.from({ length: SWIRL_COUNT }).map((_, i) => ({
    id: `swirl-${i}`,
    left: `${getRandom(20, 80)}%`,
    top: `${getRandom(20, 80)}%`,
    width: `${getRandom(30, 80)}px`,
    height: `${getRandom(30, 80)}px`,
    animationDelay: `${getRandom(0, 1)}s`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-purple-100/10" aria-hidden="true">
      {swirls.map(s => (
        <Swirl 
          key={s.id} 
          style={{ 
            left: s.left, 
            top: s.top, 
            width: s.width, 
            height: s.height,
            animationDelay: s.animationDelay 
          }} 
        />
      ))}

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-9xl animate-head-shake">😵</div>
        <h2 className="text-5xl font-bold text-purple-400 mt-6 animate-fade-in">
          Keep Going!
        </h2>
      </div>
    </div>
  );
};

export default SadAnimation5;
