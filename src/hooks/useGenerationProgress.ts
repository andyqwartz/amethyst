import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import type { GenerationStatus, GenerationSettings } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();

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
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      return;
    }
  }, [isGenerating]);

  // Handle generation retry
  useEffect(() => {
    if (shouldRetry && savedSettings && onRetry && !hasNotifiedRetry) {
      console.log('Reprising generation with saved settings:', savedSettings);
      setHasNotifiedRetry(true);
      toast({
        title: "Reprise de la génération",
        description: "Une génération précédente a été interrompue, reprise en cours...",
      });
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

    return progress;
  };

  // Update progress based on real generation status
  useEffect(() => {
    if (!isGenerating) return;

    const generationId = localStorage.getItem('generation_id');
    if (!generationId) return;

    const checkProgress = async () => {
      try {
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
          setProgress(100);
          setStatus('success');
          localStorage.removeItem('generation_id');
        } else if (prediction.status === 'failed') {
          setProgress(0);
          setStatus('error');
          localStorage.removeItem('generation_id');
          toast({
            title: "Erreur de génération",
            description: prediction.error || "La génération a échoué",
            variant: "destructive"
          });
        } else if (prediction.status === 'processing' && prediction.logs) {
          setCurrentLogs(prediction.logs);
          const calculatedProgress = calculateProgressFromLogs(prediction.logs);
          setProgress(calculatedProgress);
        }
      } catch (error) {
        console.error('Error checking progress:', error);
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
  }, [isGenerating]);

  return { 
    progress, 
    setProgress,
    status,
    savedFile,
    savedSettings,
    currentLogs
  };
};