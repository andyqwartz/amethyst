import React from 'react';
import { ImageGeneratorContainer } from '@/components/image-generator/containers/ImageGeneratorContainer';
import { useImageHandling } from '@/hooks/useImageHandling';
import { useHistoryManagement } from '@/hooks/useHistoryManagement';
import { useUIState } from '@/hooks/useUIState';

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
    removeFromHistory
  } = useHistoryManagement();

  const {
    isSettingsOpen: showSettings,
    setSettingsOpen: setShowSettings,
    isHelpModalOpen: showHelp,
    setHelpModalOpen: setShowHelp,
    progress,
    logs: currentLogs,
    setGenerating,
    setProgress
  } = useUIState();

  return (
    <ImageGeneratorContainer
      showSettings={showSettings}
      setShowSettings={setShowSettings}
      showHelp={showHelp}
      setShowHelp={setShowHelp}
      isGenerating={isGenerating}
      currentImage={currentImage}
      history={history}
      isLoading={isLoading}
      progress={progress}
      currentLogs={currentLogs}
      error={error || historyError}
      generateImage={generateImage}
      handleDeleteImage={removeFromHistory}
      setCurrentImage={setGeneratedImage}
      clearError={() => handleError('')}
      reset={() => {
        setProgress(0);
        setGenerating(false);
      }}
    />
  );
});

ImageGenerator.displayName = 'ImageGenerator';
