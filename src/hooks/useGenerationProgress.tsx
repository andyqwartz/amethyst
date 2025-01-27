import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import { GenerationStatus } from '@/types/replicate';

export const useGenerationProgress = (isGenerating: boolean) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>('idle');

  useGenerationPersistence(
    isGenerating ? 'loading' : 'idle',
    progress,
    (newStatus) => {
      if (newStatus === 'loading') setStatus('loading');
    },
    setProgress
  );

  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      return;
    }

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

  return { progress, completeProgress, status };
};