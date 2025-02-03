import { useState } from 'react';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  return {
    isGenerating,
    setIsGenerating,
    progress,
    setProgress,
    error,
    setError
  };
};