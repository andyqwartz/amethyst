import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
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

  // Clear state when generation stops
  useEffect(() => {
    if (!isGenerating) {
      console.log('Generation stopped, clearing state');
      setCurrentLogs('');
      setStatus('idle');
      setProgress(0);
      localStorage.removeItem('generation_id');
    }
  }, [isGenerating]);

  useEffect(() => {
    if (shouldRetry && savedSettings && onRetry) {
      console.log('Resuming generation with saved settings:', savedSettings);
      onRetry(savedSettings);
    }
  }, [shouldRetry, savedSettings, onRetry]);

  useEffect(() => {
    if (!isGenerating) {
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
          toast({
            title: "Error",
            description: "Failed to check generation progress",
            variant: "destructive"
          });
          setStatus('error');
          setCurrentLogs('');
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
          toast({
            title: "Success",
            description: "Images generated successfully",
          });
        } else if (prediction.status === 'failed') {
          console.error('Generation failed:', prediction.error);
          localStorage.removeItem('generation_id');
          setStatus('error');
          setCurrentLogs('');
          toast({
            title: "Error",
            description: prediction.error || "Generation failed",
            variant: "destructive"
          });
        } else if (prediction.status === 'processing' && prediction.logs) {
          console.log('Generation processing:', prediction.logs);
          setCurrentLogs(prediction.logs);
          setStatus('loading');
        }
      } catch (error) {
        console.error('Error checking progress:', error);
        toast({
          title: "Error",
          description: "Failed to check generation progress",
          variant: "destructive"
        });
        setStatus('error');
        setCurrentLogs('');
        localStorage.removeItem('generation_id');
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [isGenerating, toast]);

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