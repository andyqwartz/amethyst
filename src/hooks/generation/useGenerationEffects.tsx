import { useEffect } from 'react';
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationEffects = (
  referenceImage: string | null,
  updateSettings: (settings: Partial<GenerationSettings>) => void,
  generationStatus: string,
  generatedImages: string[],
  settings: GenerationSettings,
  setIsGenerating: (isGenerating: boolean) => void,
  addToHistory: (url: string, settings: GenerationSettings) => void
) => {
  // Effet pour mettre à jour l'image de référence dans les paramètres
  useEffect(() => {
    updateSettings({ reference_image_url: referenceImage });
  }, [referenceImage, updateSettings]);

  // Effet pour gérer le statut de génération et l'historique
  useEffect(() => {
    if (generationStatus === 'success' && generatedImages.length > 0) {
      console.log('Generation successful, processing images:', generatedImages);
      setIsGenerating(false);
      
      // Ajouter chaque image à l'historique de manière séquentielle
      const addImages = async () => {
        for (const url of generatedImages) {
          await addToHistory(url, settings);
        }
      };
      
      addImages();
    } else if (generationStatus === 'error') {
      setIsGenerating(false);
    }
  }, [generationStatus, generatedImages, settings, setIsGenerating, addToHistory]);
};