import { useState, useEffect } from 'react';

export const useGenerationProgress = (isGenerating: boolean) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      return;
    }

    // Simulate progress based on typical generation time
    const interval = setInterval(() => {
      setProgress(current => {
        if (current >= 95) {
          clearInterval(interval);
          return current;
        }
        return current + (95 - current) * 0.1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isGenerating]);

  const completeProgress = () => {
    setProgress(100);
    setTimeout(() => setProgress(0), 1000);
  };

  return { progress, completeProgress };
};