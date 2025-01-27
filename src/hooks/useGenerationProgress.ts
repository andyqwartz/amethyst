import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import { GenerationStatus } from '@/types/replicate';
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationProgress = (
  isGenerating: boolean, 
  referenceImage?: string | null,
  settings?: GenerationSettings,
  onRetry?: (settings: GenerationSettings) => void
) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>('idle');

  const persistenceResult = useGenerationPersistence(
    isGenerating ? 'loading' : status,
    progress,
    setStatus,
    setProgress,
    referenceImage,
    settings
  );

  useEffect(() => {
    if (persistenceResult.shouldRetry && persistenceResult.settings && onRetry) {
      onRetry(persistenceResult.settings);
    }
  }, [persistenceResult.shouldRetry, persistenceResult.settings, onRetry]);

  useEffect(() => {
    // Clear status and progress if not generating
    if (!isGenerating) {
      setStatus('idle');
      setProgress(0);
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
    savedFile: persistenceResult.savedFile,
    savedSettings: persistenceResult.savedSettings
  };
};