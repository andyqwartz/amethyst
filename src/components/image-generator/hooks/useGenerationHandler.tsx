import { toast } from "@/components/ui/use-toast";
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationHandler = (
  generationStatus: string,
  setIsGenerating: (isGenerating: boolean) => void,
  resetSettings: () => void
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

    try {
      setIsGenerating(true);
      console.log('Starting generation with settings:', {
        ...settings,
        reference_image_url: settings.reference_image_url || 'No reference image',
        hf_loras: settings.hf_loras || [],
        lora_scales: settings.lora_scales || []
      });
      
      await generate({
        ...settings,
        reference_image_url: settings.reference_image_url,
        hf_loras: settings.hf_loras || [],
        lora_scales: settings.lora_scales || []
      });
      
      toast({
        title: "Génération lancée",
        description: "Les images sont en cours de génération...",
      });
    } catch (error) {
      console.error('Error in handleGenerate:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive"
      });
      resetSettings();
    }
  };

  return { handleGenerate };
};