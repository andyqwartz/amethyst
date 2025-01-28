import { useToast } from "@/components/ui/use-toast";
import { generateImage } from '@/services/replicate';
import type { GenerationSettings } from '@/types/replicate';
import { useImageHistory } from '../useImageHistory';
import { useGenerationState } from './useGenerationState';

export const useGenerationProcess = (
  generationState: ReturnType<typeof useGenerationState>
) => {
  const { toast } = useToast();
  const { addToHistory } = useImageHistory();
  const {
    setStatus,
    setGeneratedImages,
    setPredictionId,
    pollIntervalRef,
    generationInProgressRef,
    abortControllerRef,
    cleanupGeneration
  } = generationState;

  const handleGenerationSuccess = async (images: string[], settings: GenerationSettings) => {
    console.log('Generation successful, saving images:', images);
    setGeneratedImages(images);
    setStatus('success');
    
    try {
      for (const url of images) {
        await addToHistory(url, settings);
      }
      console.log('Successfully added images to history');
    } catch (error) {
      console.error('Failed to add images to history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder les images dans l'historique",
        variant: "destructive"
      });
    } finally {
      cleanupGeneration();
    }
  };

  const generate = async (settings: GenerationSettings) => {
    if (generationInProgressRef.current) {
      console.warn('Generation already in progress, skipping');
      return;
    }

    if (!settings.prompt.trim()) {
      throw new Error('Le prompt ne peut pas être vide');
    }

    console.log('Starting generation with settings:', settings);
    setStatus('loading');
    generationInProgressRef.current = true;
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await generateImage({
        input: {
          prompt: settings.prompt,
          negative_prompt: settings.negative_prompt,
          guidance_scale: settings.guidance_scale,
          num_inference_steps: settings.num_inference_steps,
          num_outputs: settings.num_outputs,
          aspect_ratio: settings.aspect_ratio,
          output_format: settings.output_format,
          output_quality: settings.output_quality,
          prompt_strength: settings.prompt_strength,
          hf_loras: settings.hf_loras,
          lora_scales: settings.lora_scales,
          disable_safety_checker: settings.disable_safety_checker,
          seed: settings.seed
        }
      });
      
      if (response.status === 'started') {
        console.log('Generation started with prediction ID:', response.predictionId);
        setPredictionId(response.predictionId);
        localStorage.setItem('generation_id', response.predictionId);
        
        pollIntervalRef.current = setInterval(async () => {
          if (abortControllerRef.current?.signal.aborted) {
            cleanupGeneration();
            return;
          }

          try {
            const pollResponse = await generateImage({ predictionId: response.predictionId });
            console.log('Poll response:', pollResponse);
            
            if (pollResponse.status === 'succeeded' && pollResponse.output) {
              clearInterval(pollIntervalRef.current!);
              await handleGenerationSuccess(pollResponse.output, settings);
            } else if (pollResponse.status === 'failed') {
              clearInterval(pollIntervalRef.current!);
              throw new Error(pollResponse.error || 'La génération a échoué');
            }
          } catch (error) {
            console.error('Error checking generation status:', error);
            clearInterval(pollIntervalRef.current!);
            throw error;
          }
        }, 1000);
      } else {
        throw new Error('Failed to start generation');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      setStatus('error');
      cleanupGeneration();
      throw error;
    }
  };

  return { generate };
};