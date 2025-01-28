import { useToast } from "@/hooks/use-toast";
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationHandler = (
  generationStatus: string,
  setIsGenerating: (isGenerating: boolean) => void,
  resetSettings: () => void
) => {
  const { toast } = useToast();

  const handleGenerate = async (
    generate: (settings: GenerationSettings) => Promise<void>,
    settings: GenerationSettings,
    isGenerating: boolean
  ) => {
    if (isGenerating) {
      console.log('Generation already in progress, skipping');
      return;
    }

    if (!settings.prompt?.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Starting generation with settings:', settings);
      setIsGenerating(true);
      await generate(settings);
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred during generation",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  return {
    handleGenerate,
  };
};