import { useState, useEffect } from 'react';
import { useGenerationPersistence } from './useGenerationPersistence';
import type { GenerationStatus, GenerationSettings } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface GenerationProgressProps {
  isGenerating: boolean;
  currentLogs: string;
}

export const useGenerationProgress = (
  isGenerating: boolean, 
  referenceImage?: string | null,
  settings?: GenerationSettings,
  onRetry?: (settings: GenerationSettings) => void
): GenerationProgressProps => {
  const [currentLogs, setCurrentLogs] = useState<string>('');
  const { toast } = useToast();

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
        } else if (prediction.status === 'failed') {
          console.error('Generation failed:', prediction.error);
          localStorage.removeItem('generation_id');
          toast({
            title: "Erreur de génération",
            description: prediction.error || "La génération a échoué",
            variant: "destructive"
          });
        } else if (prediction.status === 'processing' && prediction.logs) {
          console.log('Generation processing:', prediction.logs);
          setCurrentLogs(prediction.logs);
        }
      } catch (error) {
        console.error('Error checking progress:', error);
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
  }, [isGenerating, toast]);

  return { 
    isGenerating,
    currentLogs
  };
};