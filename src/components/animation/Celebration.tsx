import React, { useEffect } from 'react';

interface CelebrationProps {
  onComplete: () => void;
  title?: string | null;
}

const CHARACTER_COUNT = 3;
const STAR_COUNT = 40;
const CONFETTI_COUNT = 100;
const ANIMATION_DURATION = 4000; // 4 seconds

const COLORS = ['#ffc700', '#ff6b6b', '#54a0ff', '#5f27cd', '#2ecc71', '#ff9f43', '#f368e0'];

const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

const JumpingCharacter: React.FC<{ color: string; style: React.CSSProperties }> = ({ color, style }) => (
    <div className="animate-jump" style={style}>
        <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect y="40" width="80" height="60" rx="20" fill={color}/>
            <circle cx="25" cy="60" r="8" fill="white"/>
            <circle cx="28" cy="62" r="4" fill="black"/>
            <circle cx="55" cy="60" r="8" fill="white"/>
            <circle cx="58" cy="62" r="4" fill="black"/>
            <path d="M25 80 Q 40 95, 55 80" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round"/>
        </svg>
    </div>
);

const BurstingStar: React.FC<{ color: string; style: React.CSSProperties }> = ({ color, style }) => (
    <div className="absolute animate-star-burst" style={style}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
    </div>
);

const Celebration: React.FC<CelebrationProps> = ({ onComplete , title }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, ANIMATION_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);
  
  const characters = Array.from({ length: CHARACTER_COUNT }).map((_, i) => ({
    id: `char-${i}`,
    color: COLORS[i % COLORS.length],
    animationDelay: `${i * 0.15}s`,
  }));

  const stars = Array.from({ length: STAR_COUNT }).map((_, i) => ({
    id: `star-${i}`,
    left: `${getRandom(0, 100)}%`,
    top: `${getRandom(0, 100)}%`,
    animationDelay: `${getRandom(0, 1)}s`,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
  }));

  const confettis = Array.from({ length: CONFETTI_COUNT }).map((_, i) => ({
    id: `confetti-${i}`,
    left: `${getRandom(0, 100)}%`,
    animationDelay: `${getRandom(0, 3)}s`,
    animationDuration: `${getRandom(2, 4)}s`,
    backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    transform: `rotate(${getRandom(0, 360)}deg)`,
    width: `${getRandom(8, 16)}px`,
    height: `${getRandom(6, 12)}px`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden bg-black/5" aria-hidden="true">
        {/* Central Message */}
        <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-4xl md:text-6xl font-black text-white animate-pop-in" style={{ textShadow: '0 0 10px #ffc700, 0 0 20px #ff6b6b, 0 0 30px #54a0ff' }}>
               {title ? title : "AWESOME!"}
            </h1>
        </div>
      
      {/* Stars */}
      {stars.map(s => <BurstingStar key={s.id} color={s.color} style={{ top: s.top, left: s.left, animationDelay: s.animationDelay }} />)}

      {/* Confetti */}
      {confettis.map(c => <div key={c.id} className="absolute top-[-30px] animate-confetti-wiggle rounded-sm" style={{ ...c }} />)}
      
      {/* Jumping Characters at the bottom */}
      <div className="absolute bottom-[30px] left-0 right-0 h-32 flex justify-center items-end gap-4">
          {characters.map(char => <JumpingCharacter key={char.id} color={char.color} style={{ animationDelay: char.animationDelay }} />)}
      </div>
    </div>
  );
};

export default Celebration;