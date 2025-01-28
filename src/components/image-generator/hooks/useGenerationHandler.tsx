import { useState, useEffect } from 'react';
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationHandler = (
  status: string,
  setIsGenerating: (isGenerating: boolean) => void,
  resetSettings: () => void,
  toast: any
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async (
    generate: (settings: GenerationSettings) => Promise<void>,
    settings: GenerationSettings,
    isGenerating: boolean
  ) => {
    // Prevent multiple generations
    if (isGenerating || isProcessing) {
      console.log('Generation already in progress, skipping');
      return;
    }

    // Ne vérifier le prompt vide que si une génération est réellement tentée
    if (settings.prompt && !settings.prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Le prompt ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsProcessing(true);
      setIsGenerating(true);
      await generate(settings);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
      // Make sure to reset states on error
      setIsProcessing(false);
      setIsGenerating(false);
    }
  };

  // Reset states when generation completes or fails
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setIsGenerating(false);
      setIsProcessing(false);
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
      resetSettings();
    }
  }, [status, setIsGenerating, resetSettings]);

  return { handleGenerate };
};