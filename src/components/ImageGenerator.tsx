import React from 'react';
import { ImageGeneratorContainer } from '@/components/image-generator/containers/ImageGeneratorContainer';
import { useImageHandling } from '@/hooks/useImageHandling';
import { useHistoryManagement } from '@/hooks/useHistoryManagement';
import { useUIState } from '@/hooks/useUIState';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';
import type { GenerationSettings } from '@/types/generation';

export const ImageGenerator: React.FC = () => {
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

  const formattedHistory = generatedImages.map(img => ({
    url: img.url,
    settings: img.settings
  }));

  const handleImageClick = () => {
    // TODO: Implement image click handler
  };

  const handleClearHistory = async () => {
    await clearHistory();
  };

  const handleUpdateSettings = (newSettings: Partial<GenerationSettings>) => {
    updateSettings({
      ...newSettings,
      negative_prompt: newSettings.negative_prompt,
      guidance_scale: newSettings.guidance_scale
    });
  };

  return (
    <ImageGeneratorContainer
      showSettings={showSettings}
      setShowSettings={(show) => updateSettings({ showSettings: show })}
      showHelp={showHelp}
      setShowHelp={setShowHelp}
      isGenerating={isGenerating}
      referenceImage={null}
      settings={settings}
      generatedImages={generatedImages.map(img => img.url)}
      history={formattedHistory}
      isLoading={isGenerating}
      progress={progress}
      currentLogs={currentLogs.join('\n')}
      handleImageUpload={() => {}}
      handleImageClick={handleImageClick}
      handleGenerate={generateImage}
      handleTweak={handleUpdateSettings}
      handleDownload={async (url: string, format: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `generated-image.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }}
      handleDeleteImage={removeFromHistory}
      updateSettings={handleUpdateSettings}
      setReferenceImage={() => {}}
      handleRemoveReferenceImage={() => {}}
      handleDeleteHistory={handleClearHistory}
    />
  );
};

ImageGenerator.displayName = 'ImageGenerator';
