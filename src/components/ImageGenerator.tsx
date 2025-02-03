import React from 'react';
import { ImageGeneratorContainer } from '@/components/image-generator/containers/ImageGeneratorContainer';
import { useImageHandling } from '@/hooks/useImageHandling';
import { useHistoryManagement } from '@/hooks/useHistoryManagement';
import { useUIState } from '@/hooks/useUIState';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';
import type { GenerationSettings } from '@/types/replicate';

export const ImageGenerator = React.memo(() => {
  const {
    generateImage,
    setGeneratedImage,
    handleError,
    checkAuthStatus
  } = useImageHandling();
  
  const {
    fetchHistory,
    addToHistory,
    removeFromHistory,
    clearHistory
  } = useHistoryManagement();

  const {
    currentImage,
    error,
    generatedImages,
    settings,
    updateSettings
  } = useImageGeneratorStore();

  const {
    isSettingsOpen: showSettings,
    setSettingsOpen: setShowSettings,
    isHelpModalOpen: showHelp,
    setHelpModalOpen: setShowHelp,
    isGenerating,
    progress,
    logs: currentLogs,
    setGenerating,
    setProgress
  } = useUIState();

  // Transform history data to match expected format
  const formattedHistory = generatedImages.map(img => ({
    url: img.url,
    settings: {
      negative_prompt: img.settings.negativePrompt || '',
      guidance_scale: img.settings.guidanceScale || 7.5,
      num_inference_steps: img.settings.steps || 20,
      num_outputs: 1,
      aspect_ratio: '1:1',
      output_format: 'png',
      output_quality: 75,
      prompt_strength: 0.8,
      hf_loras: [],
      lora_scales: [],
      disable_safety_checker: false,
      seed: img.settings.seed || -1,
      prompt: img.settings.prompt || ''
    } as GenerationSettings
  }));

  const handleImageClick = () => {
    // TODO: Implement image click handler
  };

  const baseSettings: GenerationSettings = {
    negative_prompt: settings.negativePrompt || '',
    guidance_scale: settings.guidanceScale || 7.5,
    num_inference_steps: settings.steps || 20,
    num_outputs: 1,
    aspect_ratio: '1:1',
    output_format: 'png',
    output_quality: 75,
    prompt_strength: 0.8,
    hf_loras: [],
    lora_scales: [],
    disable_safety_checker: false,
    seed: settings.seed || -1,
    prompt: settings.prompt || ''
  };

  const handleClearHistory = async () => {
    await clearHistory();
  };

  return (
    <ImageGeneratorContainer
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      showHelp={showHelp}
      setShowHelp={setShowHelp}
      isGenerating={isGenerating}
      referenceImage={null}
      settings={baseSettings}
      generatedImages={generatedImages.map(img => img.url)}
      history={formattedHistory}
      isLoading={isGenerating}
      progress={progress}
      currentLogs={currentLogs.join('\n')}
      handleImageUpload={() => {}}
      handleImageClick={handleImageClick}
      handleGenerate={generateImage}
      handleTweak={(newSettings: GenerationSettings) => {
        updateSettings({
          negativePrompt: newSettings.negative_prompt,
          guidanceScale: newSettings.guidance_scale,
          steps: newSettings.num_inference_steps
        });
      }}
      handleDownload={async (url: string, format: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-image.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }}
      handleDeleteImage={removeFromHistory}
      updateSettings={(newSettings: Partial<GenerationSettings>) => {
        updateSettings({
          negativePrompt: newSettings.negative_prompt,
          guidanceScale: newSettings.guidance_scale,
          steps: newSettings.num_inference_steps
        });
      }}
      setReferenceImage={() => {}}
      handleRemoveReferenceImage={() => {}}
      handleDeleteHistory={handleClearHistory}
    />
  );
});

ImageGenerator.displayName = 'ImageGenerator';
