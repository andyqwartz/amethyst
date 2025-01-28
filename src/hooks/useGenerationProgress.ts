import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import type { GenerationStatus, GenerationSettings } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';

export interface GenerationProgressProps {
  isGenerating: boolean;
  currentLogs: string;
  progress: number;
  setProgress: (progress: number) => void;
  status: GenerationStatus;
  savedFile: string | null;
  savedSettings: GenerationSettings | null;
}

export const useGenerationProgress = (
  isGenerating: boolean, 
  referenceImage?: string | null,
  settings?: GenerationSettings,
  onRetry?: (settings: GenerationSettings) => void
): GenerationProgressProps => {
  const [currentLogs, setCurrentLogs] = useState<string>('');
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
      console.log('Resuming generation with saved settings:', savedSettings);
      onRetry(savedSettings);
    }
  }, [shouldRetry, savedSettings, onRetry]);

  useEffect(() => {
    // Clear logs and reset status when generation is stopped
    if (!isGenerating) {
      setCurrentLogs('');
      setStatus('idle');
      return;
    }

    const generationId = localStorage.getItem('generation_id');
    if (!generationId) {
      console.log('No generation ID found');
      return;
    }

    console.log('Checking progress for generation:', generationId);

    const checkProgress = async () => {
      try {
        const { data: prediction, error } = await supabase.functions.invoke('check-progress', {
          body: { predictionId: generationId }
        });

        if (error) {
          console.error('Error checking progress:', error);
          setStatus('error');
          localStorage.removeItem('generation_id');
          return;
        }

        if (!prediction) {
          console.warn('No prediction data received');
          return;
        }

        console.log('Generation progress update:', prediction);

        if (prediction.status === 'succeeded') {
          console.log('Generation succeeded:', prediction.output);
          localStorage.removeItem('generation_id');
          setStatus('success');
          setCurrentLogs('');
        } else if (prediction.status === 'failed') {
          console.error('Generation failed:', prediction.error);
          localStorage.removeItem('generation_id');
          setStatus('error');
          setCurrentLogs('');
        } else if (prediction.status === 'processing' && prediction.logs) {
          console.log('Generation processing:', prediction.logs);
          setCurrentLogs(prediction.logs);
          setStatus('loading');
        }
      } catch (error) {
        console.error('Error checking progress:', error);
        setStatus('error');
        setCurrentLogs('');
        localStorage.removeItem('generation_id');
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => {
      clearInterval(interval);
      if (!isGenerating) {
        setCurrentLogs('');
        setStatus('idle');
      }
    };
  }, [isGenerating]);

  return { 
    isGenerating,
    currentLogs,
    progress,
    setProgress,
    status,
    savedFile,
    savedSettings
  };
};