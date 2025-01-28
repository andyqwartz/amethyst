import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateImage } from '@/services/replicate';
import type { GenerationSettings, GenerationStatus } from '@/types/replicate';
import { useImageHistory } from './useImageHistory';

const POLL_INTERVAL = 2000; // 2 seconds

export const useImageGeneration = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { addToHistory } = useImageHistory();
  const [predictionId, setPredictionId] = useState<string | null>(null);

  const generate = async (settings: GenerationSettings) => {
    if (status === 'loading') {
      throw new Error('Une génération est déjà en cours');
    }

    if (!settings.prompt.trim()) {
      throw new Error('Le prompt ne peut pas être vide');
    }

    console.log('Starting generation with settings:', settings);
    setStatus('loading');
    
    try {
      const response = await generateImage({
        input: {
          prompt: settings.prompt,
          negative_prompt: settings.negativePrompt,
          guidance_scale: settings.guidanceScale,
          num_inference_steps: settings.steps,
          num_outputs: settings.numOutputs,
          aspect_ratio: settings.aspectRatio,
          output_format: settings.outputFormat,
          output_quality: settings.outputQuality,
          prompt_strength: settings.promptStrength,
          hf_loras: settings.hfLoras,
          lora_scales: settings.loraScales,
          disable_safety_checker: settings.disableSafetyChecker,
          seed: settings.seed
        }
      });
      
      if (response.status === 'started') {
        setPredictionId(response.predictionId);
        
        const pollInterval = setInterval(async () => {
          try {
            const pollResponse = await generateImage({ predictionId: response.predictionId });
            
            if (pollResponse.status === 'success') {
              setGeneratedImages(pollResponse.output);
              setStatus('success');
              clearInterval(pollInterval);
              setPredictionId(null);
              
              for (const url of pollResponse.output) {
                await addToHistory(url, pollResponse.settings);
              }
              
              toast({
                title: "Images générées avec succès",
                description: `${pollResponse.output.length} image(s) générée(s)`,
              });
            } else if (pollResponse.status === 'error') {
              throw new Error(pollResponse.error);
            }
          } catch (error) {
            console.error('Error checking generation status:', error);
            setStatus('error');
            clearInterval(pollInterval);
            setPredictionId(null);
            throw error;
          }
        }, POLL_INTERVAL);
      } else {
        throw new Error('Failed to start generation');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setStatus('error');
      throw error;
    }
  };

  return {
    status,
    generatedImages,
    generate
  };
};