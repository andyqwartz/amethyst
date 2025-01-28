import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import type { GenerationStatus, GenerationSettings } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';

const GENERATION_STATUS_KEY = 'generation_status';
const GENERATION_PROGRESS_KEY = 'generation_progress';
const GENERATION_ID_KEY = 'generation_id';

export const useGenerationProgress = (
  isGenerating: boolean, 
  referenceImage?: string | null,
  settings?: GenerationSettings,
  onRetry?: (settings: GenerationSettings) => void
) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [hasNotifiedRetry, setHasNotifiedRetry] = useState(false);
  const [currentLogs, setCurrentLogs] = useState<string>('');

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
      setCurrentLogs('');
      localStorage.removeItem(GENERATION_STATUS_KEY);
      localStorage.removeItem(GENERATION_PROGRESS_KEY);
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

  const calculateProgressFromLogs = (logs: string): number => {
    if (!logs) return 0;

    const lines = logs.split('\n').filter(Boolean);
    const lastLine = lines[lines.length - 1]?.toLowerCase() || '';

    if (lastLine.includes('finalizing') || lastLine.includes('saving')) {
      return 95;
    } else if (lastLine.includes('processing output')) {
      return 85;
    } else if (lastLine.includes('step') && lastLine.includes('/')) {
      // Extract step numbers, e.g., "Step 20/30"
      const match = lastLine.match(/step (\d+)\/(\d+)/i);
      if (match) {
        const [, current, total] = match;
        return Math.min(80, (Number(current) / Number(total)) * 80);
      }
    } else if (lastLine.includes('starting')) {
      return 10;
    } else if (lastLine.includes('preparing')) {
      return 5;
    }

    return progress; // Keep current progress if no relevant log found
  };

  // Update progress based on real generation status
  useEffect(() => {
    if (!isGenerating) return;

    const generationId = localStorage.getItem(GENERATION_ID_KEY);
    if (!generationId) return;

    const checkProgress = async () => {
      try {
        const { data: prediction, error } = await supabase.functions.invoke('check-progress', {
          body: { predictionId: generationId }
        });

        if (error) throw error;

        if (prediction.status === 'succeeded') {
          setProgress(100);
          setStatus('success');
          localStorage.removeItem(GENERATION_ID_KEY);
        } else if (prediction.status === 'failed') {
          setProgress(0);
          setStatus('error');
          localStorage.removeItem(GENERATION_ID_KEY);
        } else if (prediction.status === 'processing' && prediction.logs) {
          setCurrentLogs(prediction.logs);
          const calculatedProgress = calculateProgressFromLogs(prediction.logs);
          setProgress(calculatedProgress);
        }

        console.log('Generation progress:', {
          status: prediction.status,
          progress: progress,
          logs: prediction.logs
        });
      } catch (error) {
        console.error('Error checking progress:', error);
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
  }, [isGenerating, progress]);

  return { 
    progress, 
    setProgress,
    status,
    savedFile,
    savedSettings,
    currentLogs
  };
};