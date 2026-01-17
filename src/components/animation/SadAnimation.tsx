import React, { useEffect } from 'react';

interface SadAnimationProps {
  onComplete: () => void;
}

const RAINDROP_COUNT = 50;
const ANIMATION_DURATION = 2000; // 2 seconds

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const SadCharacter: React.FC = () => (
    <div className="animate-head-shake">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="60" cy="60" r="55" fill="#a0aec0"/>
            <circle cx="45" cy="55" r="8" fill="white"/>
            <circle cx="75" cy="55" r="8" fill="white"/>
            <path d="M40 85 Q 60 70, 80 85" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round"/>
        </svg>
    </div>
);

const Raindrop: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute top-[-30px] w-1 h-4 bg-blue-300 rounded-full animate-rain-fall" style={style}></div>
);

const SadAnimation: React.FC<SadAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const raindrops = Array.from({ length: RAINDROP_COUNT }).map((_, i) => ({
    id: `rain-${i}`,
    left: `${getRandom(0, 100)}%`,
    animationDelay: `${getRandom(0, 2)}s`,
    animationDuration: `${getRandom(0.5, 1.5)}s`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-black/5" aria-hidden="true">
      {/* Raindrops */}
      {raindrops.map(r => <Raindrop key={r.id} style={{ left: r.left, animationDelay: r.animationDelay, animationDuration: r.animationDuration }} />)}

      {/* Central Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
        <SadCharacter />
        <h2 className="text-5xl font-bold text-gray-400 opacity-0 animate-fade-in-slow" style={{ animationDelay: '0.3s' }}>
          Oops...
        </h2>
      </div>
    </div>
  );
};

export default SadAnimation;