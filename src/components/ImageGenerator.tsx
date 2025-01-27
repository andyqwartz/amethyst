import React, { useState, useRef, useEffect } from 'react';
import { MainContent } from './image-generator/MainContent';
import { Header } from './image-generator/Header';
import { HelpModal } from './image-generator/modals/HelpModal';
import { HistoryModal } from './image-generator/modals/HistoryModal';
import { GenerationLoadingState } from './image-generator/GenerationLoadingState';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useGenerationSettings } from '@/hooks/useGenerationSettings';
import { useGenerationProgress } from '@/hooks/useGenerationProgress';
import { useImageHistory } from '@/hooks/useImageHistory';
import { useToast } from './ui/use-toast';
import type { GenerationSettings } from '@/types/replicate';

const REFERENCE_IMAGE_KEY = 'reference_image';

export const ImageGenerator = () => {
  const { toast } = useToast();
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(() => {
    return localStorage.getItem(REFERENCE_IMAGE_KEY);
  });
  
  const { settings, updateSettings, resetSettings } = useGenerationSettings();
  const { status, generatedImages, generate } = useImageGeneration();
  const { progress, status: persistedStatus, savedFile, savedSettings } = useGenerationProgress(
    status === 'loading',
    referenceImage,
    settings,
    (savedSettings: GenerationSettings) => {
      toast({
        title: "Reprise de la génération",
        description: "La génération précédente a été interrompue, reprise en cours..."
      });
      handleGenerate(savedSettings);
    }
  );
  const { history, allHistory, isLoading } = useImageHistory();

  useEffect(() => {
    localStorage.clear();
    resetSettings();
  }, []);

  useEffect(() => {
    if (referenceImage) {
      localStorage.setItem(REFERENCE_IMAGE_KEY, referenceImage);
    } else {
      localStorage.removeItem(REFERENCE_IMAGE_KEY);
    }
  }, [referenceImage]);

  useEffect(() => {
    if (savedFile && !referenceImage) {
      setReferenceImage(savedFile);
    }
  }, [savedFile]);

  const handleGenerate = async (settingsToUse = settings) => {
    if (isGenerating) {
      toast({
        title: "Génération en cours",
        description: "Veuillez attendre la fin de la génération en cours",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      await generate(settingsToUse);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setIsGenerating(false);
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
      resetSettings();
    }
  }, [status]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => handleImageUpload(e as React.ChangeEvent<HTMLInputElement>);
    fileInput.click();
  };

  const handleTweak = (imageSettings: GenerationSettings) => {
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