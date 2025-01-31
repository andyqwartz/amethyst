import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { GenerationSettings } from '@/types/replicate';

interface GenerationParameters extends GenerationSettings {
  prompt: string;
  negativePrompt?: string;
  seed?: number;
  steps?: number;
  referenceImage?: File | null;
}

interface UseImageGenerationReturn {
  parameters: GenerationParameters;
  setParameters: (params: Partial<GenerationParameters>) => void;
  saveParameters: () => Promise<void>;
  restoreParameters: () => Promise<void>;
  uploadReferenceImage: (file: File) => Promise<string>;
  error: string | null;
  isLoading: boolean;
  generatedImages: string[];
  addGeneratedImage: (imageUrl: string) => void;
  clearGeneratedImages: () => void;
}

export function useImageGeneration(): UseImageGenerationReturn {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [parameters, setParametersState] = useState<GenerationParameters>({
    prompt: '',
    negativePrompt: '',
    seed: undefined,
    steps: 20,
    referenceImage: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setParameters = useCallback((params: Partial<GenerationParameters>) => {
    setParametersState((prev) => ({ ...prev, ...params }));
  }, []);

  const { toast } = useToast();

  const uploadReferenceImage = async (file: File): Promise<string> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to upload images");
      }
      const fileName = `reference-${Date.now()}-${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from('reference-images')
        .upload(fileName, file);

      if (uploadError) {
        throw new Error(`Failed to upload reference image: ${uploadError.message}`);
      }

      if (!data?.path) {
        throw new Error('Failed to get upload path');
      }

      return data.path;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload reference image';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const saveParameters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const sessionKey = 'lastGenerationParameters';
      const parametersToSave = { ...parameters };
      
      if (parameters.referenceImage) {
        const imagePath = await uploadReferenceImage(parameters.referenceImage);
        parametersToSave.referenceImage = null; // Don't store the File object
        localStorage.setItem('lastReferenceImagePath', imagePath);
      }

      localStorage.setItem(sessionKey, JSON.stringify(parametersToSave));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save parameters';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const restoreParameters = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const sessionKey = 'lastGenerationParameters';
      const savedParameters = localStorage.getItem(sessionKey);
      const imagePath = localStorage.getItem('lastReferenceImagePath');

      if (savedParameters) {
        const parsedParameters = JSON.parse(savedParameters) as GenerationParameters;

        if (imagePath) {
          try {
            const { data, error: downloadError } = await supabase.storage
              .from('reference-images')
              .download(imagePath);

            if (downloadError) {
              throw new Error(`Failed to download reference image: ${downloadError.message}`);
            }

            if (data) {
              const file = new File([data], 'reference-image', { type: data.type });
              parsedParameters.referenceImage = file;
            }
          } catch (imageError) {
            console.error('Failed to restore reference image:', imageError);
            // Continue with other parameters even if image restoration fails
          }
        }

        setParametersState(parsedParameters);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to restore parameters';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    restoreParameters();
  }, []);

  const addGeneratedImage = useCallback(async (imageUrl: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to save generated images",
          variant: "destructive"
        });
        return;
      }

      // Save to local state
      setGeneratedImages(prev => [...prev, imageUrl]);

      // Save to database
      const { error } = await supabase
        .from('images')
        .insert([
          {
            url: imageUrl,
            settings: parameters,
            user_id: session.session.user.id,
          },
        ]);

      if (error) throw error;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save generated image';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [parameters, toast]);

  const clearGeneratedImages = useCallback(() => {
    setGeneratedImages([]);
  }, []);

  return {
    parameters,
    setParameters,
    saveParameters,
    restoreParameters,
    uploadReferenceImage,
    error,
    isLoading,
    generatedImages,
    addGeneratedImage,
    clearGeneratedImages,
  };
}
