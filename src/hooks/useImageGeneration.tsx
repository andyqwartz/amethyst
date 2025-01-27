import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateImage } from '@/services/replicate';
import type { GenerationSettings, GenerationStatus } from '@/types/replicate';
import { useImageHistory } from './useImageHistory';

export const useImageGeneration = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { addToHistory } = useImageHistory();

  const generate = async (settings: GenerationSettings) => {
    if (!settings.prompt.trim()) {
      toast({
        title: "Veuillez entrer un prompt",
        description: "Le prompt ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting generation with settings:', settings);
    setStatus('loading');
    
    try {
      const images = await generateImage({
        prompt: settings.prompt,
        negative_prompt: settings.negativePrompt,
        guidance_scale: settings.guidanceScale,
        num_inference_steps: settings.steps,
        num_outputs: settings.numOutputs,
        seed: settings.seed,
        aspect_ratio: settings.aspectRatio,
        output_format: settings.outputFormat,
        output_quality: settings.outputQuality,
        prompt_strength: settings.promptStrength,
        hf_loras: settings.hfLoras,
        lora_scales: settings.loraScales,
        disable_safety_checker: settings.disableSafetyChecker,
      });
      
      console.log('Generation successful:', images);
      setGeneratedImages(images);
      
      // Add each generated image to history
      for (const url of images) {
        await addToHistory(url, settings);
      }
      
      setStatus('success');
      
      toast({
        title: "Images générées avec succès",
        description: `${images.length} image(s) générée(s)`,
      });
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