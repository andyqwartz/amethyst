<<<<<<< HEAD
import { useState } from 'react';
import { ImageSettings } from '@/types/generation';

export const useGenerationState = () => {
  const [settings, setSettings] = useState<ImageSettings>({
    negative_prompt: '',
    guidance_scale: 7.5,
    num_inference_steps: 50,
    aspect_ratio: '1:1'
  });

  const updateSettings = (newSettings: Partial<ImageSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  return {
    settings,
    updateSettings
  };
}; 
=======
import { useState, useRef } from 'react';
import type { GenerationStatus, ImageSettings } from '@/types/generation';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const generationInProgressRef = useRef(false);

  const cleanupGeneration = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    generationInProgressRef.current = false;
    setIsGenerating(false);
  };

  return {
    isGenerating,
    setIsGenerating,
    status,
    setStatus,
    generatedImages,
    setGeneratedImages,
    predictionId,
    setPredictionId,
    abortControllerRef,
    pollIntervalRef,
    generationInProgressRef,
    cleanupGeneration
  };
};
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
