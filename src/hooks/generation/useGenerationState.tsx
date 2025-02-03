import { useState, useRef } from 'react';
import type { GenerationStatus } from '@/types/replicate';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  return {
    isGenerating,
    setIsGenerating,
    status,
    setStatus,
    abortControllerRef
  };
};