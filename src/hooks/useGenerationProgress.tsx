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
            title: "Erreur",
            description: "Une erreur est survenue lors de la vérification de la progression",
            variant: "destructive"
          });
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
          toast({
            title: "Génération terminée",
            description: "Les images ont été générées avec succès",
          });
        } else if (prediction.status === 'failed') {
          console.error('Generation failed:', prediction.error);
          localStorage.removeItem('generation_id');
          setStatus('error');
          toast({
            title: "Erreur",
            description: prediction.error || "La génération a échoué",
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
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de la progression",
          variant: "destructive"
        });
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
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