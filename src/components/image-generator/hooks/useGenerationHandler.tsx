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
    if (isGenerating || isProcessing) {
      toast({
        title: "Génération en cours",
        description: "Veuillez attendre la fin de la génération en cours",
        variant: "destructive"
      });
      return;
    }

    if (!settings.prompt.trim()) {
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
        description: error.message || "Une erreur est survenue lors de la génération",
        variant: "destructive"
      });
      setIsGenerating(false);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setIsGenerating(false);
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
      if (status === 'success') {
        resetSettings();
      }
    }
  }, [status, setIsGenerating, resetSettings]);

  return { handleGenerate };
};