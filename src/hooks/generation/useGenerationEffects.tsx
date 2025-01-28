import { useEffect } from 'react';
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationEffects = (
  referenceImage: string | null,
  updateSettings: (settings: Partial<GenerationSettings>) => void,
  generationStatus: string,
  generatedImages: string[],
  settings: GenerationSettings,
  setIsGenerating: (isGenerating: boolean) => void,
  addToHistory: (url: string, settings: GenerationSettings) => Promise<void>
) => {
  // Effect for handling reference image updates
  useEffect(() => {
    if (referenceImage) {
      updateSettings({ reference_image_url: referenceImage });
    } else {
      updateSettings({ reference_image_url: null });
    }
  }, [referenceImage, updateSettings]);

  // Effect for handling generation completion
  useEffect(() => {
    let isAddingToHistory = false;

    const addImagesToHistory = async () => {
      if (generationStatus === 'success' && generatedImages.length > 0 && !isAddingToHistory) {
        isAddingToHistory = true;
        console.log('Adding generated images to history:', generatedImages);
        
        try {
          // Process each image sequentially to avoid race conditions
          for (const url of generatedImages) {
            await addToHistory(url, settings);
          }
        } catch (error) {
          console.error('Failed to add images to history:', error);
        } finally {
          isAddingToHistory = false;
          setIsGenerating(false);
        }
      } else if (generationStatus === 'error') {
        console.log('Generation failed');
        setIsGenerating(false);
      }
    };

    addImagesToHistory();
  }, [generationStatus, generatedImages, settings, addToHistory, setIsGenerating]);
};