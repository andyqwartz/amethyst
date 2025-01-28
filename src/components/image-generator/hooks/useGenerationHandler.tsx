import { useState, useEffect } from 'react';
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationHandler = (
  status: string,
  setIsGenerating: (isGenerating: boolean) => void,
  resetSettings: () => void,
  toast: any
) => {
  const handleGenerate = async (
    generate: (settings: GenerationSettings) => Promise<void>,
    settings: GenerationSettings,
    isGenerating: boolean
  ) => {
    if (isGenerating) {
      toast({
        title: "Génération en cours",
        description: "Veuillez attendre la fin de la génération en cours",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generate(settings);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setIsGenerating(false);
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
      resetSettings();
    }
  }, [status, setIsGenerating, resetSettings]);

  return { handleGenerate };
};