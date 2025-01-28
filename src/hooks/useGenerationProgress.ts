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

  // Reset progress when generation stops
  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setStatus('idle');
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
      return;
    }
  }, [isGenerating]);

  // Handle generation retry
  useEffect(() => {
    if (shouldRetry && savedSettings && onRetry) {
      console.log('Reprising generation with saved settings:', savedSettings);
      onRetry(savedSettings);
    }
  }, [shouldRetry, savedSettings, onRetry]);

  // Update progress based on generation status
  useEffect(() => {
    if (!isGenerating) return;

    const interval = setInterval(() => {
      setProgress(current => {
        // If we're at 100%, clear the interval
        if (current >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Calculate the next progress value based on current progress
        const remaining = 100 - current;
        const increment = Math.max(0.5, remaining * 0.05);
        return Math.min(99, current + increment);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isGenerating]);

  return { 
    progress, 
    setProgress,
    status,
    savedFile,
    savedSettings
  };
};