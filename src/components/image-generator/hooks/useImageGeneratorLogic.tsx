import { useEffect } from 'react';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useGenerationSettings } from '@/hooks/useGenerationSettings';
import { useGenerationProgress } from '@/hooks/useGenerationProgress';
import { useImageHistory } from '@/hooks/useImageHistory';
import { useImageGeneratorState } from './useImageGeneratorState';
import { useImageUpload } from './useImageUpload';
import { useGenerationHandler } from './useGenerationHandler';
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
  const { 
    progress, 
    setProgress,
    status,
    currentLogs 
  } = useGenerationProgress(
    generationStatus === 'loading',
    settings
  );
  const { history, allHistory, isLoading, addToHistory } = useImageHistory();

  const { handleImageUpload, handleImageClick } = useImageUpload(setReferenceImage);
  const { handleGenerate: handleGenerateBase } = useGenerationHandler(
    generationStatus,
    setIsGenerating,
    resetSettings
  );

  useEffect(() => {
    localStorage.removeItem('generation_status');
    localStorage.removeItem('generation_progress');
    localStorage.removeItem('generation_timestamp');
    localStorage.removeItem('generation_id');
    resetSettings();
  }, []);

  useEffect(() => {
    if (referenceImage) {
      updateSettings({ reference_image_url: referenceImage });
    } else {
      updateSettings({ reference_image_url: null });
    }
  }, [referenceImage]);

  // Effet pour gérer la fin de la génération et l'ajout à l'historique
  useEffect(() => {
    if (generationStatus === 'success' && generatedImages.length > 0) {
      console.log('Generation completed successfully, adding to history:', generatedImages);
      generatedImages.forEach(async (url) => {
        try {
          await addToHistory(url, settings);
        } catch (error) {
          console.error('Failed to add image to history:', error);
        }
      });
      setIsGenerating(false);
    } else if (generationStatus === 'error') {
      console.log('Generation failed');
      setIsGenerating(false);
    }
  }, [generationStatus, generatedImages]);

  const handleGenerate = async () => {
    if (isGenerating) {
      console.log('Generation already in progress, skipping');
      return;
    }

    const settingsWithImage = {
      ...settings,
      reference_image_url: referenceImage,
      hf_loras: settings.hf_loras || [],
      lora_scales: settings.lora_scales || []
    };

    try {
      await handleGenerateBase(generate, settingsWithImage, isGenerating);
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
    }
  };

  const handleTweak = (imageSettings: GenerationSettings) => {
    updateSettings(imageSettings);
    setShowSettings(true);
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.${settings.output_format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    handleDownload,
    updateSettings,
    setReferenceImage
  };
};