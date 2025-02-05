import { useState } from 'react';
import type { GenerationStatus } from '@/types/replicate';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [predictionId, setPredictionId] = useState<string | null>(null);

  return {
    isGenerating,
    setIsGenerating,
    status,
    setStatus,
    generatedImages,
    setGeneratedImages,
    predictionId,
    setPredictionId
  };
};