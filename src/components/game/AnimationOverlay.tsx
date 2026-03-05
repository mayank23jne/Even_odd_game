import { lazy, Suspense, memo } from "react";
import ErrorBoundary from "@/components/ui/error-boundary";

// Lazy load all animation components
const Celebration1 = lazy(() => import("@/components/animation/Celebration1"));
const Celebration3 = lazy(() => import("@/components/animation/Celebration3"));
const Celebration5 = lazy(() => import("@/components/animation/Celebration5"));
const Celebration6 = lazy(() => import("@/components/animation/Celebration6"));
const Celebration7 = lazy(() => import("@/components/animation/Celebration7"));

const SadAnimation1 = lazy(() => import("@/components/animation/SadAnimation1"));
const SadAnimation2 = lazy(() => import("@/components/animation/SadAnimation2"));
const SadAnimation5 = lazy(() => import("@/components/animation/SadAnimation5"));

const GameOverAnimation = lazy(() => import("@/components/animation/GameOverAnimation"));
const LevelChangeAnimation = lazy(() => import("@/components/animation/LevelChangeAnimation"));

export const CELEBRATION_COMPONENTS = [
    Celebration1,
    Celebration3,
    Celebration5,
    Celebration6,
    Celebration7
];

export const SAD_ANIMATION_COMPONENTS = [
    SadAnimation1,
    SadAnimation2,
    SadAnimation5
];

export const CELEBRATION_TITLES = ["AWESOME!", "WOW!", "YOU ROCK!", "PERFECT!", "GREAT!", "AMAZING!"];

// Preload functions
export const preloadCelebration = (index: number) => {
    switch (index) {
        case 0: import("@/components/animation/Celebration1").catch(console.error); break;
        case 1: import("@/components/animation/Celebration3").catch(console.error); break;
        case 2: import("@/components/animation/Celebration5").catch(console.error); break;
        case 3: import("@/components/animation/Celebration6").catch(console.error); break;
        case 4: import("@/components/animation/Celebration7").catch(console.error); break;
    }
};

export const preloadSadAnimation = (index: number) => {
    switch (index) {
        case 0: import("@/components/animation/SadAnimation1").catch(console.error); break;
        case 1: import("@/components/animation/SadAnimation2").catch(console.error); break;
        case 2: import("@/components/animation/SadAnimation5").catch(console.error); break;
    }
};

export const preloadGameOverAnimation = () => {
    import("@/components/animation/GameOverAnimation").catch(console.error);
};

export const preloadLevelChangeAnimation = () => {
    import("@/components/animation/LevelChangeAnimation").catch(console.error);
};

interface AnimationOverlayProps {
    showCelebration: boolean;
    celebrationIndex: number;
    onCelebrationComplete: () => void;

    showSadAnimation: boolean;
    sadAnimationIndex: number;
    onSadAnimationComplete: () => void;

    showGameOverAnimation: boolean;
    onGameOverAnimationComplete: () => void;

    showLevelChange?: boolean;
    previousLevel?: number;
    onLevelChangeComplete?: () => void;

    showGameFinishAnimation: boolean;
    onGameFinishComplete: () => void;
}

const AnimationOverlay = memo(({
    showCelebration,
    celebrationIndex,
    onCelebrationComplete,
    showSadAnimation,
    sadAnimationIndex,
    onSadAnimationComplete,
    showGameOverAnimation,
    onGameOverAnimationComplete,
    showLevelChange,
    previousLevel,
    onLevelChangeComplete,
    showGameFinishAnimation,
    onGameFinishComplete
}: AnimationOverlayProps) => {

    const ActiveCelebration = CELEBRATION_COMPONENTS[celebrationIndex];
    const ActiveSadAnimation = SAD_ANIMATION_COMPONENTS[sadAnimationIndex];

    return (
        <>
            <ErrorBoundary>
                <Suspense fallback={null}>
                    {showCelebration && ActiveCelebration && (
                        <ActiveCelebration
                            onComplete={onCelebrationComplete}
                            title={CELEBRATION_TITLES[celebrationIndex]}
                        />
                    )}
                </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
                <Suspense fallback={null}>
                    {showSadAnimation && ActiveSadAnimation && (
                        <ActiveSadAnimation onComplete={onSadAnimationComplete} />
                    )}
                </Suspense>
            </ErrorBoundary>

            <ErrorBoundary>
                <Suspense fallback={null}>
                    {showGameOverAnimation && (
                        <GameOverAnimation
                            onComplete={onGameOverAnimationComplete}
                        />
                    )}
                </Suspense>
            </ErrorBoundary>

            {/* Level change animation removed as requested */}

            <ErrorBoundary>
                <Suspense fallback={null}>
                    {showGameFinishAnimation && (
                        <Celebration3
                            onComplete={onGameFinishComplete}
                            title="You Won!"
                        />
                    )}
                </Suspense>
            </ErrorBoundary>
        </>
    );
});

AnimationOverlay.displayName = "AnimationOverlay";

export default AnimationOverlay;
