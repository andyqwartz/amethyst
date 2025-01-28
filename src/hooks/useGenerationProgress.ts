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
  const [hasNotifiedRetry, setHasNotifiedRetry] = useState(false);

  const { shouldRetry, savedFile, savedSettings } = useGenerationPersistence(
    isGenerating ? 'loading' : status,
    progress,
    setStatus,
    setProgress,
    referenceImage,
    settings
  );

  // Reset states when generation stops
  useEffect(() => {
    if (!isGenerating) {
      setProgress(0);
      setStatus('idle');
      setHasNotifiedRetry(false);
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
      return;
    }
  }, [isGenerating]);

  // Handle generation retry
  useEffect(() => {
    if (shouldRetry && savedSettings && onRetry && !hasNotifiedRetry) {
      console.log('Reprising generation with saved settings:', savedSettings);
      setHasNotifiedRetry(true);
      onRetry(savedSettings);
    }
  }, [shouldRetry, savedSettings, onRetry, hasNotifiedRetry]);

  // Update progress based on real generation status
  useEffect(() => {
    if (!isGenerating) return;

    const generationId = localStorage.getItem('generation_id');
    if (!generationId) return;

    const checkProgress = async () => {
      try {
        const response = await fetch(`/api/check-progress?id=${generationId}`);
        const data = await response.json();
        
        if (data.status === 'succeeded') {
          setProgress(100);
          setStatus('success');
        } else if (data.status === 'failed') {
          setProgress(0);
          setStatus('error');
        } else if (data.status === 'processing') {
          // Calculate progress based on logs
          const logProgress = calculateProgressFromLogs(data.logs);
          setProgress(logProgress);
        }
      } catch (error) {
        console.error('Error checking progress:', error);
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const calculateProgressFromLogs = (logs: string): number => {
    if (!logs) return 5;

    if (logs.includes('Finalizing generation')) {
      return 95;
    } else if (logs.includes('Processing image')) {
      return 75;
    } else if (logs.includes('Starting generation')) {
      return 25;
    } else if (logs.includes('Initializing')) {
      return 10;
    }

    return 5;
  };

  return { 
    progress, 
    setProgress,
    status,
    savedFile,
    savedSettings
  };
};