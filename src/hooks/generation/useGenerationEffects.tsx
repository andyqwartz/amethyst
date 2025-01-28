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
    if (generationStatus === 'success' && generatedImages.length > 0) {
      console.log('Generation completed successfully, adding to history:', generatedImages);
      generatedImages.forEach(async (url) => {
        try {
          await addToHistory(url, settings);
        } catch (error) {
          console.error('Failed to add image to history:', error);
        }
      });
      setIsGenerating(false);
    } else if (generationStatus === 'error') {
      console.log('Generation failed');
      setIsGenerating(false);
    }
  }, [generationStatus, generatedImages, settings, addToHistory, setIsGenerating]);
};