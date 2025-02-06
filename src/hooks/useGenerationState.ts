import { useState, useRef } from 'react';
import type { GenerationStatus } from '@/types/replicate';

export const useGenerationState = () => {
  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Generated images
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [predictionId, setPredictionId] = useState<string | null>(null);
  
  // Control references
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

    // Image states
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
