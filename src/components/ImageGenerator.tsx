import React from 'react';
import { ImageGeneratorContainer } from './image-generator/containers/ImageGeneratorContainer';
import { useImageHandling } from './image-generator/hooks/useImageHandling';
import { useHistoryManagement } from './image-generator/hooks/useHistoryManagement';
import { useUIState } from './image-generator/hooks/useUIState';
import { useGenerationState } from './image-generator/hooks/useGenerationState';
import { useGenerationSettings } from './image-generator/hooks/useGenerationSettings';
import type { GenerationSettings } from '@/types/replicate';

export const defaultSettings: GenerationSettings = {
  prompt: '',
  negative_prompt: '',
  guidance_scale: 7.5,
  num_inference_steps: 28,
  num_outputs: 1,
  aspect_ratio: '1:1',
  output_format: 'webp',
  output_quality: 90,
  prompt_strength: 0.8,
  hf_loras: [],
  lora_scales: [],
  disable_safety_checker: false
};

export const ImageGenerator = React.memo(() => {
  const generationState = useGenerationState();
  const { settings, updateSettings } = useGenerationSettings();
  const {
    referenceImage,
    generatedImages,
    handleImageUpload,
    handleImageClick,
    handleDownload,
    handleRemoveReferenceImage,
    setReferenceImage
  } = useImageHandling();
  
  const {
    history,
    deleteImage,
    handleDeleteHistory
  } = useHistoryManagement();

  const {
    showSettings,
    setShowSettings,
    showHelp,
    setShowHelp,
    isGenerating,
    progress,
    currentLogs,
    handleGenerate,
    handleTweak
  } = useUIState(updateSettings);

  // Ensure settings is never undefined by using defaultSettings as fallback
  const currentSettings: GenerationSettings = {
    ...defaultSettings,
    ...settings
  };

  return (
    <ImageGeneratorContainer
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      showHelp={showHelp}
      setShowHelp={setShowHelp}
      isGenerating={isGenerating}
      referenceImage={referenceImage}
      settings={currentSettings}
      generatedImages={generatedImages}
      history={history}
      isLoading={false}
      progress={progress}
      currentLogs={currentLogs}
      handleImageUpload={handleImageUpload}
      handleImageClick={handleImageClick}
      handleGenerate={handleGenerate}
      handleTweak={handleTweak}
      handleDownload={handleDownload}
      handleDeleteImage={deleteImage}
      updateSettings={updateSettings}
      setReferenceImage={setReferenceImage}
      handleRemoveReferenceImage={handleRemoveReferenceImage}
      handleDeleteHistory={handleDeleteHistory}
    />
  );
});

ImageGenerator.displayName = 'ImageGenerator';