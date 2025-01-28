import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useGenerationSettings } from '@/hooks/useGenerationSettings';
import { useImageHistory } from '@/hooks/useImageHistory';
import { useImageGeneratorState } from './useImageGeneratorState';
import { useImageUpload } from './useImageUpload';
import { useGenerationEffects } from '@/hooks/generation/useGenerationEffects';
import { useProgressChecking } from '@/hooks/generation/useProgressChecking';
import { useGenerationHandlers } from '@/hooks/generation/useGenerationHandlers';
import type { GenerationSettings } from '@/types/replicate';

export const useImageGeneratorLogic = () => {
  const {
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    showHistory,
    setShowHistory,
    isGenerating,
    setIsGenerating,
    referenceImage,
    setReferenceImage
  } = useImageGeneratorState();

  const { settings, updateSettings, resetSettings } = useGenerationSettings();
  const { status: generationStatus, generatedImages, generate } = useImageGeneration();
  const { history, allHistory, isLoading, addToHistory } = useImageHistory();
  const { handleImageUpload, handleImageClick } = useImageUpload(setReferenceImage);

  const { currentLogs, progress, setProgress, status } = useProgressChecking(isGenerating);

  const { handleGenerate: baseHandleGenerate, handleTweak, handleDownload } = useGenerationHandlers(
    setIsGenerating,
    generate,
    updateSettings,
    setShowSettings,
    setReferenceImage
  );

  useGenerationEffects(
    referenceImage,
    updateSettings,
    generationStatus,
    generatedImages,
    settings,
    setIsGenerating,
    addToHistory
  );

  const handleGenerate = async () => {
    if (isGenerating) return;

    const settingsWithImage = {
      ...settings,
      reference_image_url: referenceImage,
      hf_loras: settings.hf_loras || [],
      lora_scales: settings.lora_scales || []
    };

    try {
      await baseHandleGenerate(settingsWithImage, isGenerating);
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
    }
  };

  return {
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    showHistory,
    setShowHistory,
    isGenerating,
    referenceImage,
    settings,
    generatedImages,
    history,
    allHistory,
    isLoading,
    progress,
    currentLogs,
    handleImageUpload,
    handleImageClick,
    handleGenerate,
    handleTweak,
    handleDownload: (imageUrl: string) => handleDownload(imageUrl, settings.output_format),
    updateSettings,
    setReferenceImage
  };
};