import { useToast } from "@/components/ui/use-toast";
import type { GenerationSettings } from '@/types/replicate';

export const useGenerationHandlers = (
  setIsGenerating: (isGenerating: boolean) => void,
  generate: (settings: GenerationSettings) => Promise<void>,
  updateSettings: (settings: Partial<GenerationSettings>) => void,
  setShowSettings: (show: boolean) => void,
  setReferenceImage: (image: string | null) => void
) => {
  const { toast } = useToast();

  const handleGenerate = async (settings: GenerationSettings, isGenerating: boolean) => {
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
      console.error('Generation failed:', error);
      setIsGenerating(false);
      throw error;
    }
  };

  const handleTweak = (imageSettings: GenerationSettings) => {
    updateSettings(imageSettings);
    setShowSettings(true);
  };

  const handleDownload = (imageUrl: string, outputFormat: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    handleGenerate,
    handleTweak,
    handleDownload
  };
};