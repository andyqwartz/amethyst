<<<<<<< HEAD
import { useState, useRef } from 'react';
import type { GenerationStatus } from '@/types/replicate';

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
=======
import { useState } from 'react';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
>>>>>>> a945a29ba778c4116754a03171a654de675e5402

  return {
    isGenerating,
    setIsGenerating,
<<<<<<< HEAD
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
=======
    progress,
    setProgress,
    error,
    setError
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
  };
};