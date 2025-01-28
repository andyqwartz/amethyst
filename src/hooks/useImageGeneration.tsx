import { useEffect } from 'react';
import { useGenerationState } from './generation/useGenerationState';
import { useGenerationProcess } from './generation/useGenerationProcess';

export const useImageGeneration = () => {
  const generationState = useGenerationState();
  const { generate } = useGenerationProcess(generationState);
  const { status, generatedImages, predictionId, cleanupGeneration } = generationState;

  useEffect(() => {
    return () => {
      cleanupGeneration();
    };
  }, []);

  return {
    status,
    generatedImages,
    generate,
    predictionId
  };
};