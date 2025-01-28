import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import { GenerationStatus, GenerationSettings } from '@/types/replicate';

export const useGenerationProgress = (
  isGenerating: boolean, 
  referenceImage?: string | null,
  settings?: GenerationSettings,
  onRetry?: (settings: GenerationSettings) => void
) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>('idle');

  const { shouldRetry, savedFile, savedSettings } = useGenerationPersistence(
    isGenerating ? 'loading' : status,
    progress,
    setStatus,
    setProgress,
    referenceImage,
    settings
  );

  useEffect(() => {
    if (shouldRetry && savedSettings && onRetry) {
      console.log('Reprising generation with saved settings:', savedSettings);
      onRetry(savedSettings);
    }
  }, [shouldRetry, savedSettings, onRetry]);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout | null = null;

    if (isGenerating) {
      // Démarrer à 5% pour indiquer que la génération a commencé
      setProgress(5);

      progressInterval = setInterval(() => {
        setProgress(current => {
          if (current >= 95) {
            if (progressInterval) {
              clearInterval(progressInterval);
            }
            return current;
          }
          // Progression plus lente et plus naturelle
          const increment = Math.max(0.5, (95 - current) * 0.05);
          return Math.min(95, current + increment);
        });
      }, 1000);
    } else {
      // Réinitialiser le progrès quand la génération est terminée
      setProgress(0);
    }

    return () => {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    };
  }, [isGenerating]);

  return { 
    progress, 
    setProgress,
    status,
    savedFile,
    savedSettings
  };
};