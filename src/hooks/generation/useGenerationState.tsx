import { useState, useRef } from 'react';
import type { GenerationStatus } from '@/types/replicate';

export const useGenerationState = () => {
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const generationInProgressRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanupGeneration = () => {
    console.log('Cleaning up generation...');
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    localStorage.removeItem('generation_id');
    setPredictionId(null);
    generationInProgressRef.current = false;
  };

  return {
    status,
    setStatus,
    generatedImages,
    setGeneratedImages,
    predictionId,
    setPredictionId,
    pollIntervalRef,
    generationInProgressRef,
    abortControllerRef,
    cleanupGeneration
  };
};