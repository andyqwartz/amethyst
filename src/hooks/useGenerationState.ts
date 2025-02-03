import { useState } from 'react';
import type { GenerationStatus } from '@/types/replicate';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<GenerationStatus>('idle');

  return {
    isGenerating,
    setIsGenerating,
    status,
    setStatus
  };
};