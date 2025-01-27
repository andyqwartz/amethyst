import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import { GenerationStatus } from '@/types/replicate';

export const useGenerationProgress = (isGenerating: boolean, referenceImage?: string | null) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>('idle');

  // Use the persistence hook to save/restore state
  const { savedFile } = useGenerationPersistence(
    isGenerating ? 'loading' : 'idle',
    progress,
    setStatus,
    setProgress,
    referenceImage
  );

  useEffect(() => {
    if (!isGenerating) {
      return;
    }

    // If we're restoring a generation in progress, start from the saved progress
    if (progress === 0) {
      setProgress(5);
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

  return { 
    progress, 
    setProgress,
    status,
    savedFile 
  };
};