import { useState } from 'react';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  return {
    isGenerating,
    setIsGenerating,
    progress,
    setProgress
  };
};