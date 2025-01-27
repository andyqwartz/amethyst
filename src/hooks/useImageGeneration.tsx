import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateImage } from '@/services/replicate';
import type { GenerationSettings, GenerationStatus } from '@/types/replicate';
import { useImageHistory } from './useImageHistory';

const POLL_INTERVAL = 2000; // 2 seconds
const GENERATION_KEY = 'ongoing_generation';

interface GenerationState {
  predictionId: string;
  settings: GenerationSettings;
  timestamp: number;
}

export const useImageGeneration = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { addToHistory } = useImageHistory();
  const [predictionId, setPredictionId] = useState<string | null>(null);

  // Restore generation state on mount
  useEffect(() => {
    const savedState = localStorage.getItem(GENERATION_KEY);
    if (savedState) {
      const state: GenerationState = JSON.parse(savedState);
      const timePassed = Date.now() - state.timestamp;
      
      // If less than 5 minutes have passed, resume the generation
      if (timePassed < 5 * 60 * 1000) {
        setStatus('loading');
        setPredictionId(state.predictionId);
        toast({
          title: "Reprise de la génération",
          description: "La génération précédente a été interrompue, reprise en cours..."
        });
      } else {
        // Clear stale generation state
        localStorage.removeItem(GENERATION_KEY);
      }
    }
  }, []);

  // Poll for generation status
  useEffect(() => {
    if (!predictionId || status !== 'loading') return;

    const pollInterval = setInterval(async () => {
      try {
        const response = await generateImage({ predictionId });
        
        if (response.status === 'success') {
          setGeneratedImages(response.output);
          setStatus('success');
          localStorage.removeItem(GENERATION_KEY);
          setPredictionId(null);
          
          // Add generated images to history
          for (const url of response.output) {
            await addToHistory(url, response.settings);
          }
          
          toast({
            title: "Images générées avec succès",
            description: `${response.output.length} image(s) générée(s)`,
          });
        } else if (response.status === 'error') {
          throw new Error(response.error);
        }
        // Continue polling if still processing
      } catch (error) {
        console.error('Error checking generation status:', error);
        setStatus('error');
        localStorage.removeItem(GENERATION_KEY);
        setPredictionId(null);
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
          duration: 10000,
        });
      }
    }, POLL_INTERVAL);

    return () => clearInterval(pollInterval);
  }, [predictionId, status]);

  const generate = async (settings: GenerationSettings) => {
    if (!settings.prompt.trim()) {
      toast({
        title: "Veuillez entrer un prompt",
        description: "Le prompt ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    // Check if there's already an ongoing generation
    if (status === 'loading') {
      toast({
        title: "Génération en cours",
        description: "Veuillez attendre la fin de la génération en cours",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting generation with settings:', settings);
    setStatus('loading');
    
    try {
      const response = await generateImage({ input: settings });
      
      if (response.status === 'started') {
        setPredictionId(response.predictionId);
        
        // Save generation state
        const generationState: GenerationState = {
          predictionId: response.predictionId,
          settings,
          timestamp: Date.now()
        };
        localStorage.setItem(GENERATION_KEY, JSON.stringify(generationState));
      } else {
        throw new Error('Failed to start generation');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setStatus('error');
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
        duration: 10000,
      });
    }
  };

  return {
    status,
    generatedImages,
    generate
  };
};