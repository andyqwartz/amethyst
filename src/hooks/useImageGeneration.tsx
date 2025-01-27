import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateImage } from '@/services/replicate';
import type { GenerationSettings, GenerationStatus } from '@/types/replicate';
import { useImageHistory } from './useImageHistory';

const POLL_INTERVAL = 2000;
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
          
          // Add generated images to history with all settings
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

  const cancelGeneration = async () => {
    if (predictionId) {
      try {
        await generateImage({ predictionId, action: 'cancel' });
        setStatus('idle');
        setPredictionId(null);
        localStorage.removeItem(GENERATION_KEY);
        toast({
          title: "Génération annulée",
          description: "La génération a été annulée avec succès",
        });
      } catch (error) {
        console.error('Error cancelling generation:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'annuler la génération",
          variant: "destructive",
        });
      }
    }
  };

  const generate = async (settings: GenerationSettings) => {
    if (!settings.prompt.trim()) {
      toast({
        title: "Veuillez entrer un prompt",
        description: "Le prompt ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    if (status === 'loading') {
      toast({
        title: "Génération en cours",
        description: "Veuillez attendre la fin de la génération en cours",
        variant: "destructive"
      });
      return;
    }

    setStatus('loading');
    
    try {
      const replicateInput = {
        prompt: settings.prompt,
        negative_prompt: settings.negativePrompt,
        guidance_scale: settings.guidanceScale,
        num_inference_steps: settings.steps,
        seed: settings.seed,
        num_outputs: settings.numOutputs,
        aspect_ratio: settings.aspectRatio,
        output_format: settings.outputFormat,
        output_quality: settings.outputQuality,
        prompt_strength: settings.promptStrength,
        hf_loras: settings.hfLoras,
        lora_scales: settings.loraScales,
        disable_safety_checker: settings.disableSafetyChecker
      };

      const response = await generateImage(replicateInput);
      
      if (response.status === 'started') {
        setPredictionId(response.predictionId);
        
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
    generate,
    cancelGeneration
  };
};
