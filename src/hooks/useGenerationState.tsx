import { useState, useRef, type MutableRefObject } from 'react';

type GenerationStatus = 'idle' | 'loading' | 'success' | 'error';

export const useGenerationState = () => {
  // State for tracking generation status and results
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [predictionId, setPredictionId] = useState<string | null>(null);

  // Refs for managing ongoing processes
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const generationInProgressRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const cleanupGeneration = () => {
    // Clear polling interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    // Reset abort controller
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Reset generation progress flag
    generationInProgressRef.current = false;

    // Reset state variables
    setStatus('idle');
    setPredictionId(null);

    // Clear local storage
    localStorage.removeItem('generation_id');
  };

  return {
    // State getters and setters
    status,
    setStatus,
    generatedImages,
    setGeneratedImages,
    predictionId,
    setPredictionId,

    // Refs
    pollIntervalRef,
    generationInProgressRef,
    abortControllerRef,

    // Cleanup function
    cleanupGeneration,
  };
};