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
    setReferenceImage,
    toast
  } = useImageGeneratorState();

  const { settings, updateSettings, resetSettings } = useGenerationSettings();
  const { status, generatedImages, generate } = useImageGeneration();
  const { progress, status: persistedStatus, savedFile, savedSettings, currentLogs } = useGenerationProgress(
    status === 'loading',
    referenceImage,
    settings,
    (savedSettings) => {
      toast({
        title: "Reprise de la génération",
        description: "La génération précédente a été interrompue, reprise en cours...",
        className: "animate-fade-in"
      });
      handleGenerate(savedSettings);
    }
  );
  const { history, allHistory, isLoading } = useImageHistory();

  const { handleImageUpload, handleImageClick } = useImageUpload(setReferenceImage);
  const { handleGenerate: handleGenerateBase } = useGenerationHandler(
    status,
    setIsGenerating,
    resetSettings,
    toast
  );

  // Clear local storage on initial load to prevent stale state
  useEffect(() => {
    localStorage.removeItem('generation_status');
    localStorage.removeItem('generation_progress');
    localStorage.removeItem('generation_timestamp');
    localStorage.removeItem('generation_id');
    resetSettings();
  }, []);

  useEffect(() => {
    if (savedFile && !referenceImage) {
      setReferenceImage(savedFile);
    }
  }, [savedFile]);

  const handleGenerate = (settingsToUse = settings) => {
    if (!isGenerating) {
      handleGenerateBase(generate, settingsToUse, isGenerating);
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