import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { generateImage } from '@/services/replicate';
import type { GenerationSettings, GenerationStatus } from '@/types/replicate';
import { useImageHistory } from './useImageHistory';

const POLL_INTERVAL = 2000;
const GENERATION_ID_KEY = 'generation_id';

export const useImageGeneration = () => {
  const { toast } = useToast();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const { addToHistory } = useImageHistory();
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isGeneratingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      localStorage.removeItem(GENERATION_ID_KEY);
      isGeneratingRef.current = false;
    };
  }, []);

  const cleanupGeneration = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    localStorage.removeItem(GENERATION_ID_KEY);
    setPredictionId(null);
    isGeneratingRef.current = false;
  };

  const handleGenerationSuccess = async (images: string[], settings: GenerationSettings) => {
    setGeneratedImages(images);
    setStatus('success');
    cleanupGeneration();
    
    // Ensure history is updated
    try {
      for (const url of images) {
        await addToHistory(url, settings);
      }
      console.log('Successfully added images to history:', images);
    } catch (error) {
      console.error('Failed to add images to history:', error);
      toast({
        title: "Erreur",
        description: "Les images ont été générées mais n'ont pas pu être sauvegardées dans l'historique",
        variant: "destructive"
      });
    }
  };

  const generate = async (settings: GenerationSettings) => {
    // Protection contre les appels multiples
    if (isGeneratingRef.current) {
      console.warn('Generation already in progress, skipping');
      toast({
        title: "Génération en cours",
        description: "Une génération est déjà en cours, veuillez patienter",
        variant: "destructive"
      });
      return;
    }

    if (!settings.prompt.trim()) {
      throw new Error('Le prompt ne peut pas être vide');
    }

    console.log('Starting generation with settings:', settings);
    setStatus('loading');
    isGeneratingRef.current = true;
    abortControllerRef.current = new AbortController();
    
    try {
      cleanupGeneration();

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
        localStorage.setItem(GENERATION_ID_KEY, response.predictionId);
        
        pollIntervalRef.current = setInterval(async () => {
          if (abortControllerRef.current?.signal.aborted) {
            cleanupGeneration();
            return;
          }

          try {
            const pollResponse = await generateImage({ predictionId: response.predictionId });
            
            if (pollResponse.status === 'success') {
              await handleGenerationSuccess(pollResponse.output, settings);
              
              toast({
                title: "Images générées avec succès",
                description: `${pollResponse.output.length} image(s) générée(s)`,
                className: "animate-fade-in"
              });
            } else if (pollResponse.status === 'error') {
              throw new Error(pollResponse.error);
            }
          } catch (error) {
            console.error('Error checking generation status:', error);
            setStatus('error');
            cleanupGeneration();
            throw error;
          }
        }, POLL_INTERVAL);
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

  return {
    status,
    generatedImages,
    generate,
    predictionId
  };
};