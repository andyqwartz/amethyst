import { useEffect } from 'react';
import { useGenerationState } from './generation/useGenerationState';
import { useGenerationProcess } from './generation/useGenerationProcess';
import { useToast } from "@/hooks/use-toast";

export const useImageGeneration = () => {
  const { toast } = useToast();
  const generationState = useGenerationState();
  const { generate } = useGenerationProcess(generationState);
  const { status, generatedImages, predictionId, cleanupGeneration } = generationState;

  useEffect(() => {
    return () => {
      cleanupGeneration();
    };
  }, []);

  useEffect(() => {
    if (status === 'error') {
      toast({
        title: "Erreur de génération",
        description: "Une erreur est survenue lors de la génération des images",
        variant: "destructive"
      });
    }
  }, [status, toast]);

  return {
    status,
    generatedImages,
    generate,
    predictionId
  };
};