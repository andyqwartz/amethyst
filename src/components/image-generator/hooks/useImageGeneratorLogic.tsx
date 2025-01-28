import { useEffect } from 'react';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useGenerationSettings } from '@/hooks/useGenerationSettings';
import { useGenerationProgress } from '@/hooks/useGenerationProgress';
import { useImageHistory } from '@/hooks/useImageHistory';
import { useImageGeneratorState } from './useImageGeneratorState';
import { useImageUpload } from './useImageUpload';
import { useGenerationHandler } from './useGenerationHandler';
import { toast } from "@/hooks/use-toast";
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
    savedFile,
    savedSettings,
    currentLogs 
  } = useGenerationProgress(
    generationStatus === 'loading',
    referenceImage,
    settings,
    (savedSettings) => {
      // Only show the toast if we're actually resuming a generation
      if (!isGenerating && savedSettings) {
        toast({
          title: "Reprise de la génération",
          description: "La génération précédente a été interrompue, reprise en cours...",
          className: "animate-fade-in"
        });
        handleGenerate(savedSettings);
      }
    }
  );
  const { history, allHistory, isLoading } = useImageHistory();

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
    if (savedFile && !referenceImage) {
      setReferenceImage(savedFile);
    }
  }, [savedFile]);

  useEffect(() => {
    if (referenceImage) {
      updateSettings({ reference_image_url: referenceImage });
    } else {
      updateSettings({ reference_image_url: null });
    }
  }, [referenceImage]);

  const handleGenerate = (settingsToUse = settings) => {
    if (!isGenerating) {
      const settingsWithImage = {
        ...settingsToUse,
        reference_image_url: referenceImage,
        hf_loras: settingsToUse.hf_loras || [],
        lora_scales: settingsToUse.lora_scales || []
      };
      handleGenerateBase(generate, settingsWithImage, isGenerating);
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