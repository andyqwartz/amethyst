import { useEffect, useCallback } from 'react';
import { useGenerationState } from './generation/useGenerationState';
import { useGenerationProcess } from './generation/useGenerationProcess';
import { useToast } from "@/hooks/use-toast";
import type { GenerationSettings } from '@/types/replicate';
import { checkSession } from '@/integrations/supabase/client';

interface GenerationError extends Error {
  code?: string;
  details?: unknown;
}

export const useImageGeneration = () => {
  const toast = useToast();
  const generationState = useGenerationState();
  const { generate: baseGenerate } = useGenerationProcess(generationState);
  const { status, generatedImages, predictionId, cleanupGeneration, parameters, abortControllerRef } = generationState;

  const validateParameters = useCallback((params: GenerationSettings): boolean => {
    if (!params.prompt?.trim()) {
      toast.error("Le prompt ne peut pas être vide");
      return false;
    }

    if (params.guidance_scale && (params.guidance_scale < 1 || params.guidance_scale > 20)) {
      toast.error("Le guidance scale doit être entre 1 et 20");
      return false;
    }

    if (params.num_inference_steps && (params.num_inference_steps < 1 || params.num_inference_steps > 100)) {
      toast.error("Le nombre d'étapes doit être entre 1 et 100");
      return false;
    }

    return true;
  }, [toast]);

  const generate = useCallback(async (params?: Partial<GenerationSettings>): Promise<void> => {
    try {
      // Check authentication status
      await checkSession();

      if (status === 'loading') {
        console.warn('Generation already in progress');
        return;
      }

      const mergedParams = {
        ...parameters,
        ...params,
      } as GenerationSettings;

      if (!validateParameters(mergedParams)) {
        return;
      }

      await baseGenerate(mergedParams);
    } catch (error) {
      console.error('Image generation error:', error);
      
      const generationError = error as GenerationError;
      
      if (generationError.code === 'UNAUTHENTICATED') {
        toast.error("Veuillez vous connecter pour générer des images");
      } else if (generationError.code === 'RATE_LIMITED') {
        toast.error("Limite de génération atteinte. Veuillez réessayer plus tard");
      } else {
        toast.error(generationError.message || "Une erreur inattendue est survenue");
      }

      if (status === 'loading') {
        cleanupGeneration();
      }
      
      throw generationError;
    }
  }, [status, parameters, baseGenerate, toast, cleanupGeneration, validateParameters]);

  useEffect(() => {
    const cleanup = () => {
      if (status === 'loading') {
        console.log('Cleaning up ongoing generation');
        abortControllerRef.current?.abort();
        cleanupGeneration();
      }
    };

    // Clean up on unmount or when status changes from loading
    return cleanup;
  }, [status, cleanupGeneration, abortControllerRef]);

  useEffect(() => {
    if (status === 'error' && generationState.error) {
      const errorMessage = typeof generationState.error === 'string' 
        ? generationState.error 
        : "Une erreur est survenue lors de la génération";
      toast.error(errorMessage);
    }
  }, [status, generationState.error, toast]);

  return {
    status,
    generatedImages,
    generate,
    predictionId,
    currentParameters: parameters,
    cleanupGeneration
  };
};
