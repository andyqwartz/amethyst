import { useState, useRef } from 'react';
import type { GenerationStatus, ImageSettings } from '@/types/generation';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const generationInProgressRef = useRef(false);

  const cleanupGeneration = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    generationInProgressRef.current = false;
    setIsGenerating(false);
    setProgress(0);
    setError(null);
  };

  return {
    // Status states
    isGenerating,
    setIsGenerating,
    status,
    setStatus,
    progress,
    setProgress,
    error,
    setError,

    // Generation states
    generatedImages,
    setGeneratedImages,
    predictionId,
    setPredictionId,

    // Control refs
    abortControllerRef,
    pollIntervalRef,
    generationInProgressRef,
    
    // Cleanup function
    cleanupGeneration
  };
};
