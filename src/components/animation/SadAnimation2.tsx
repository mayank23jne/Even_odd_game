import React, { useEffect } from 'react';

interface SadAnimationProps {
  onComplete: () => void;
}

const ANIMATION_DURATION = 2000;
const CLOUD_COUNT = 8;

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const Cloud: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div className="absolute opacity-60 animate-float" style={style}>
    <svg width="80" height="40" viewBox="0 0 80 40" fill="gray" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="20" cy="25" rx="15" ry="12"/>
      <ellipse cx="35" cy="20" rx="18" ry="15"/>
      <ellipse cx="50" cy="22" rx="16" ry="13"/>
      <ellipse cx="65" cy="26" rx="12" ry="10"/>
    </svg>
  </div>
);

const SadAnimation2: React.FC<SadAnimationProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const clouds = Array.from({ length: CLOUD_COUNT }).map((_, i) => ({
    id: `cloud-${i}`,
    left: `${getRandom(-10, 90)}%`,
    top: `${getRandom(10, 60)}%`,
    animationDelay: `${getRandom(0, 2)}s`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-gray-300/20" aria-hidden="true">
      {clouds.map(c => <Cloud key={c.id} style={{ left: c.left, top: c.top, animationDelay: c.animationDelay }} />)}

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-8xl mb-4 animate-bounce">😢</div>
        <h2 className="text-3xl font-bold text-gray-500 animate-fade-in">
          ohhh nooo!
        </h2>
      </div>
    </div>
  );
};

export default SadAnimation2;
