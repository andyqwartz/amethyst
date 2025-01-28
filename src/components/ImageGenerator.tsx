import React, { useEffect } from 'react';
import { MainContent } from './image-generator/MainContent';
import { Header } from './image-generator/Header';
import { HelpModal } from './image-generator/modals/HelpModal';
import { HistoryModal } from './image-generator/modals/HistoryModal';
import { GenerationLoadingState } from './image-generator/GenerationLoadingState';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useGenerationSettings } from '@/hooks/useGenerationSettings';
import { useGenerationProgress } from '@/hooks/useGenerationProgress';
import { useImageHistory } from '@/hooks/useImageHistory';
import { useImageGeneratorState } from './image-generator/hooks/useImageGeneratorState';
import { useImageUpload } from './image-generator/hooks/useImageUpload';
import { useGenerationHandler } from './image-generator/hooks/useGenerationHandler';

export const ImageGenerator = () => {
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
  const { progress, status: persistedStatus, savedFile, savedSettings } = useGenerationProgress(
    status === 'loading',
    referenceImage,
    settings,
    (savedSettings) => {
      toast({
        title: "Reprise de la génération",
        description: "La génération précédente a été interrompue, reprise en cours..."
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

  useEffect(() => {
    localStorage.clear();
    resetSettings();
  }, []);

  useEffect(() => {
    if (savedFile && !referenceImage) {
      setReferenceImage(savedFile);
    }
  }, [savedFile]);

  const handleGenerate = (settingsToUse = settings) => {
    handleGenerateBase(generate, settingsToUse, isGenerating);
  };

  const handleTweak = (imageSettings: typeof settings) => {
    updateSettings(imageSettings);
    setShowSettings(true);
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.${settings.outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Header
            onHistoryClick={() => setShowHistory(true)}
            onSettingsClick={() => setShowSettings(!showSettings)}
            onHelpClick={() => setShowHelp(true)}
          />

          <MainContent
            referenceImage={referenceImage}
            showSettings={showSettings}
            settings={settings}
            isGenerating={isGenerating}
            generatedImages={generatedImages}
            history={history}
            isLoading={isLoading}
            onImageUpload={handleImageUpload}
            onImageClick={handleImageClick}
            onRemoveImage={() => setReferenceImage(null)}
            onSettingsChange={updateSettings}
            onGenerate={() => handleGenerate()}
            onToggleSettings={() => setShowSettings(!showSettings)}
            onTweak={handleTweak}
            onDownload={handleDownload}
          />
        </div>
      </div>

      <HelpModal
        open={showHelp}
        onOpenChange={setShowHelp}
      />

      <HistoryModal
        open={showHistory}
        onOpenChange={setShowHistory}
        images={allHistory.map(h => ({ url: h.url, settings: h.settings }))}
        onDownload={handleDownload}
        onTweak={handleTweak}
      />

      <GenerationLoadingState 
        isGenerating={isGenerating} 
        progress={progress}
      />
    </>
  );
};