import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import type { GenerationStatus, GenerationSettings } from '@/types/replicate';

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

  const { savedFile, savedSettings } = useGenerationPersistence(
    status,
    progress,
    setStatus,
    setProgress,
    referenceImage || null,
    settings
  );

  // Reset states when generation stops
  useEffect(() => {
    if (!isGenerating) {
      setCurrentLogs('');
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_id');
      return;
    }
  }, [isGenerating]);

  // Update progress based on real generation status
  useEffect(() => {
    if (!isGenerating) return;

    const generationId = localStorage.getItem('generation_id');
    if (!generationId) return;

    const checkProgress = async () => {
      try {
        console.log('Checking progress for generation:', generationId);
        const { data: prediction, error } = await supabase.functions.invoke('check-progress', {
          body: { predictionId: generationId }
        });

        if (error) {
          console.error('Error checking progress:', error);
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
        } else if (prediction.status === 'failed') {
          console.error('Generation failed:', prediction.error);
          localStorage.removeItem('generation_id');
          setStatus('error');
        } else if (prediction.status === 'processing' && prediction.logs) {
          console.log('Generation processing:', prediction.logs);
          setCurrentLogs(prediction.logs);
          setStatus('loading');
        }
      } catch (error) {
        console.error('Error checking progress:', error);
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
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