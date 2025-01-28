import type { GenerationSettings } from '@/types/replicate';

export const useGenerationHandler = (
  generationStatus: string,
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
      console.log('Generation already in progress');
      return;
    }

    if (!settings.prompt.trim()) {
      return;
    }

    try {
      setIsGenerating(true);
      console.log('Starting generation with settings:', settings);
      await generate(settings);
    } catch (error) {
      console.error('Generation error:', error);
      resetSettings();
    } finally {
      setIsGenerating(false);
    }
  };

  return { handleGenerate };
};