export const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const calculateScore = (level: number, wrongAttempts: number): number => {
  const baseScore = level * 4;

  if (wrongAttempts === 0) return baseScore;
  if (wrongAttempts === 1) return baseScore - baseScore / 4;
  if (wrongAttempts === 2) return baseScore - baseScore / 2;
  if (wrongAttempts >= 3) return baseScore - baseScore / 2;
};


