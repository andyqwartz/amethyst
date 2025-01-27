import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { AdvancedSettings } from './image-generator/AdvancedSettings';
import { ImagePreview } from './image-generator/ImagePreview';
import { Header } from './image-generator/Header';
import { GenerationControls } from './image-generator/GenerationControls';
import { HelpModal } from './image-generator/modals/HelpModal';
import { HistoryModal } from './image-generator/modals/HistoryModal';
import { GenerationLoadingState } from './image-generator/GenerationLoadingState';
import { ReferenceImageUpload } from './image-generator/ReferenceImageUpload';
import { HistorySection } from './image-generator/HistorySection';
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
  const [referenceImage, setReferenceImage] = useState<string | null>(() => {
    return localStorage.getItem(REFERENCE_IMAGE_KEY);
  });

  const { settings, updateSettings } = useGenerationSettings();
  const { status, generatedImages, generate, cancelGeneration } = useImageGeneration();
  const { progress, status: persistedStatus, savedFile, savedSettings } = useGenerationProgress(
    status === 'loading',
    referenceImage,
    settings,
    (savedSettings: GenerationSettings) => {
      toast({
        title: "Reprise de la génération",
        description: "La génération précédente a été interrompue, reprise en cours..."
      });
      generate(savedSettings);
    }
  );
  const { history, allHistory, isLoading } = useImageHistory();

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

  useEffect(() => {
    if (savedSettings && status === 'idle') {
      updateSettings(savedSettings);
    }
  }, [savedSettings, status]);

  const handleGenerate = () => {
    generate(settings);
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

  const removeReferenceImage = () => {
    setReferenceImage(null);
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
    }
  }, [status]);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        <Header
          onHistoryClick={() => setShowHistory(true)}
          onSettingsClick={() => setShowSettings(!showSettings)}
          onHelpClick={() => setShowHelp(true)}
        />

        <Card className="border-none glass-card shadow-xl">
          <div className="p-6 space-y-8">
            <ReferenceImageUpload
              referenceImage={referenceImage}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeReferenceImage}
            />

            <GenerationControls
              settings={settings}
              onSettingsChange={updateSettings}
              onGenerate={handleGenerate}
              onCancel={cancelGeneration}
              onToggleSettings={() => setShowSettings(!showSettings)}
              isGenerating={status === 'loading'}
            />

            {showSettings && (
              <AdvancedSettings
                settings={settings}
                onSettingsChange={updateSettings}
              />
            )}

            <ImagePreview
              images={generatedImages}
              onTweak={handleTweak}
              onDownload={handleDownload}
              settings={settings}
              className="mt-8"
            />

            <HistorySection
              history={history.map(h => h.url)}
              onTweak={handleTweak}
              onDownload={handleDownload}
              settings={settings}
              isLoading={isLoading}
            />
          </div>
        </Card>

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
      </div>

      <GenerationLoadingState 
        isGenerating={status === 'loading' || persistedStatus === 'loading'} 
        progress={progress}
      />
    </div>
  );
};