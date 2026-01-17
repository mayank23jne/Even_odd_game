import React, { useEffect, useMemo } from 'react';
import './CSS/LevelChangeAnimation.css';

interface LevelChangeAnimationProps {
  onComplete: () => void;
  level: number;
}

const ANIMATION_DURATION = 3000;
const PARTICLE_COUNT = 40;
const ROCKET_COUNT = 5;

const getRandom = (min: number, max: number) =>
  Math.random() * (max - min) + min;

const rocketColors = [
  { body: '#ef4444', window: '#fca5a5', wing: '#dc2626', flame1: '#fbbf24', flame2: '#f59e0b' },
  { body: '#3b82f6', window: '#93c5fd', wing: '#2563eb', flame1: '#60a5fa', flame2: '#3b82f6' },
  { body: '#10b981', window: '#6ee7b7', wing: '#059669', flame1: '#34d399', flame2: '#10b981' },
  { body: '#a855f7', window: '#d8b4fe', wing: '#9333ea', flame1: '#c084fc', flame2: '#a855f7' },
  { body: '#f59e0b', window: '#fcd34d', wing: '#d97706', flame1: '#fbbf24', flame2: '#f59e0b' },
];

const LevelChangeAnimation: React.FC<LevelChangeAnimationProps> = ({ onComplete, level }) => {
  useEffect(() => {
    const t = setTimeout(onComplete, ANIMATION_DURATION);
    return () => clearTimeout(t);
  }, [onComplete]);

  // rockets
  const rockets = useMemo(() => {
    const screenWidth =
      typeof window !== 'undefined' ? window.innerWidth : 1200;
    const spacing = screenWidth / (ROCKET_COUNT + 1);

    return Array.from({ length: ROCKET_COUNT }).map((_, i) => ({
      id: `rocket-${i}`,
      left: spacing * (i + 1),
      delay: i * 0.15,
      colors: rocketColors[i],
    }));
  }, []);

  // particles
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const startX = getRandom(-200, 200);
        const endX = startX + getRandom(-100, 100);
        const endY = getRandom(-200, -350);
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#a855f7', '#fbbf24'];
        const color = colors[i % colors.length];

        return {
          id: `particle-${i}`,
          startX,
          endX,
          endY,
          size: getRandom(4, 10),
          color,
          delay: 0.3 + i * 0.02,
        };
      }),
    []
  );

  const digits = level.toString().split('');

  return (
    <div className="level-change-overlay" aria-hidden="true">
      {/* Rings */}
      <div className="lca-rings">
        <div className="lca-ring lca-ring-0" />
        <div className="lca-ring lca-ring-1" />
        <div className="lca-ring lca-ring-2" />
      </div>

      {/* Rockets */}
      {rockets.map((rocket) => (
        <div
          key={rocket.id}
          className="lca-rocket"
          style={{
            left: rocket.left,
            animationDelay: `${rocket.delay}s`,
          }}
        >
          <svg
            className="lca-rocket-svg"
            width="60"
            height="60"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Body */}
            <path
              d="M32 8C32 8 24 16 24 32V48L32 52L40 48V32C40 16 32 8 32 8Z"
              fill={rocket.colors.body}
            />
            {/* Window */}
            <circle cx="32" cy="28" r="6" fill={rocket.colors.window} />
            {/* Wings */}
            <path
              d="M24 36L16 48L24 44V36Z"
              fill={rocket.colors.wing}
            />
            <path
              d="M40 36L48 48L40 44V36Z"
              fill={rocket.colors.wing}
            />
            {/* Flames */}
            <path
              className="lca-flame"
              d="M28 52L26 58L28 56L30 58L28 52Z"
              fill={rocket.colors.flame1}
            />
            <path
              className="lca-flame lca-flame-main"
              d="M32 52L30 60L32 57L34 60L32 52Z"
              fill={rocket.colors.flame2}
            />
            <path
              className="lca-flame"
              d="M36 52L34 58L36 56L38 58L36 52Z"
              fill={rocket.colors.flame1}
            />
          </svg>
        </div>
      ))}

      {/* Particles */}
      <div className="lca-particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="lca-particle"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              animationDelay: `${p.delay}s`,
              ['--start-x' as any]: `${p.startX}px`,
              ['--end-x' as any]: `${p.endX}px`,
              ['--end-y' as any]: `${p.endY}px`,
            }}
          />
        ))}
      </div>

      {/* Center glow */}
      <div className="lca-center-glow">
        <div
          style={{
            width: 384,
            height: 384,
            borderRadius: '999px',
            background:
              'radial-gradient(circle, rgba(249, 115, 22, 0.3) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Multicolor glow */}
      <div className="lca-multicolor-glow">
        <div
          style={{
            width: 500,
            height: 500,
            borderRadius: '999px',
            background:
              'conic-gradient(from 0deg, #ef4444, #3b82f6, #10b981, #f59e0b, #a855f7, #ef4444)',
            filter: 'blur(80px)',
            opacity: 0.3,
          }}
        />
      </div>

      {/* Text */}
      <div className="lca-text-wrapper">
        <div className="lca-title">LEVEL UP!</div>

        <div className="lca-level">
          {digits.map((d, i) => (
            <span
              key={i}
              className="lca-level-digit"
              style={{ animationDelay: `${1 + i * 0.1}s` }}
            >
              {d}
            </span>
          ))}
        </div>

        <div className="lca-subtitle">
          <span className="lca-subtitle-glow">Keep It Up!</span>
        </div>
      </div>
    </div>
  );
};

export default LevelChangeAnimation;
