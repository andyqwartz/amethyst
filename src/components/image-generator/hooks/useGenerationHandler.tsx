import { useToast } from "@/hooks/use-toast";
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationHandler = (
  generationStatus: string,
  setIsGenerating: (isGenerating: boolean) => void,
  resetSettings: () => void,
  toast: ReturnType<typeof useToast>['toast']
) => {
  const handleGenerate = async (
    generate: (settings: GenerationSettings) => Promise<void>,
    settings: GenerationSettings,
    isGenerating: boolean
  ) => {
    if (isGenerating) {
      console.log('Generation already in progress');
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
      setIsGenerating(true);
      console.log('Starting generation with settings:', settings);
      await generate(settings);
      
      toast({
        title: "Génération réussie",
        description: "Les images ont été générées avec succès"
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Erreur de génération",
        description: error.message || "Une erreur est survenue lors de la génération",
        variant: "destructive"
      });
      resetSettings();
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate };
};