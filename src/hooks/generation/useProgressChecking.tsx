import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import type { GenerationStatus } from '@/types/replicate';

export const useProgressChecking = (isGenerating: boolean) => {
  const { toast } = useToast();
  const [currentLogs, setCurrentLogs] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<GenerationStatus>('idle');

  useEffect(() => {
    if (!isGenerating) {
      setCurrentLogs('');
      setStatus('idle');
      setProgress(0);
      localStorage.removeItem('generation_id');
      return;
    }

    const generationId = localStorage.getItem('generation_id');
    if (!generationId) return;

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

        if (!prediction) return;

        console.log('Progress update received:', prediction);

        if (prediction.status === 'succeeded') {
          console.log('Generation completed successfully');
          localStorage.removeItem('generation_id');
          setStatus('success');
          setCurrentLogs('');
          toast({
            title: "Success",
            description: "Images generated successfully",
          });
          // Force isGenerating to false after success
          window.dispatchEvent(new CustomEvent('generation-complete'));
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
          // Force isGenerating to false after failure
          window.dispatchEvent(new CustomEvent('generation-complete'));
        } else if (prediction.status === 'processing' && prediction.logs) {
          console.log('Generation in progress:', prediction.logs);
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
        // Force isGenerating to false after error
        window.dispatchEvent(new CustomEvent('generation-complete'));
      }
    };

    const interval = setInterval(checkProgress, 1000);
    return () => clearInterval(interval);
  }, [isGenerating, toast]);

  return { currentLogs, progress, setProgress, status };
};