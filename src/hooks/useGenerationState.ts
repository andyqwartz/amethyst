import { useState } from 'react';

export const useGenerationState = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  return {
    isGenerating,
    setIsGenerating
  };
};