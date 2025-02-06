import { useToast } from "@/components/ui/use-toast";
import { generateImage } from '@/services/replicate';
import type { GenerationSettings } from '@/types/replicate';
import { useImageHistory } from '../useImageHistory';
import { useGenerationState } from './useGenerationState';

const formatLoraPath = (lora: string): string => {
  // If it's already in the correct format (folder/model), return as is
  if (lora.split('/').length === 2 && !lora.includes('http')) {
    return lora;
  }
  
  // If it's a URL, extract the last two parts
  if (lora.includes('http')) {
    const urlParts = lora.split('/');
    return `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
  }
  
  // For any other format, try to extract folder/model
  const parts = lora.split('/');
  if (parts.length >= 2) {
    return `${parts[parts.length - 2]}/${parts[parts.length - 1]}`;
  }
  return lora;
};

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

    console.log('Starting generation with original settings:', settings);
    setStatus('loading');
    generationInProgressRef.current = true;
    abortControllerRef.current = new AbortController();

    // Format LoRA paths before sending
    const formattedSettings = {
      ...settings,
      hf_loras: settings.hf_loras.map(formatLoraPath),
    };
    
    console.log('Sending formatted settings to API:', {
      ...formattedSettings,
      reference_image_url: formattedSettings.reference_image_url ? 'Present' : 'Not present'
    });
    
    try {
      const response = await generateImage({
        input: {
          prompt: formattedSettings.prompt,
          negative_prompt: formattedSettings.negative_prompt,
          guidance_scale: formattedSettings.guidance_scale,
          num_inference_steps: formattedSettings.num_inference_steps,
          num_outputs: formattedSettings.num_outputs,
          aspect_ratio: formattedSettings.aspect_ratio,
          output_format: formattedSettings.output_format,
          output_quality: formattedSettings.output_quality,
          prompt_strength: formattedSettings.prompt_strength,
          hf_loras: formattedSettings.hf_loras,
          lora_scales: formattedSettings.lora_scales,
          disable_safety_checker: formattedSettings.disable_safety_checker,
          seed: formattedSettings.seed,
          image: formattedSettings.reference_image_url
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
              await handleGenerationSuccess(pollResponse.output, formattedSettings);
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