import React, { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { ImagePlus, X } from 'lucide-react';
import { AdvancedSettings } from './image-generator/AdvancedSettings';
import { ImagePreview } from './image-generator/ImagePreview';
import { Header } from './image-generator/Header';
import { GenerationControls } from './image-generator/GenerationControls';
import { HelpModal } from './image-generator/modals/HelpModal';
import { HistoryModal } from './image-generator/modals/HistoryModal';
import { GenerationLoadingState } from './image-generator/GenerationLoadingState';
import { useImageGeneration } from '@/hooks/useImageGeneration';
import { useGenerationSettings } from '@/hooks/useGenerationSettings';
import { useGenerationProgress } from '@/hooks/useGenerationProgress';
import { Button } from './ui/button';
import type { GenerationSettings } from '@/types/replicate';

export const ImageGenerator = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { settings, updateSettings } = useGenerationSettings();
  const { status, generatedImages, generate } = useImageGeneration();
  const { progress } = useGenerationProgress(status === 'loading');

  const handleGenerate = () => {
    generate(settings);
  };

  const handleTweak = (imageSettings: GenerationSettings) => {
    console.log('Tweaking settings:', imageSettings);
    updateSettings(imageSettings);
    setShowSettings(true);
  };

  const handleDownload = (imageUrl: string) => {
    console.log('Downloading image:', imageUrl);
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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const historyImages = generatedImages.map(url => ({
    url,
    settings: { ...settings }
  }));

  return (
    <>
      <div className="min-h-screen p-4 md:p-6">
        <div className="max-w-2xl mx-auto">
          <Header
            onHistoryClick={() => setShowHistory(true)}
            onSettingsClick={() => setShowSettings(!showSettings)}
            onHelpClick={() => setShowHelp(true)}
          />

          <Card className="border-none glass-card shadow-xl">
            <div className="p-6 space-y-6">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                {referenceImage ? (
                  <div className="relative group">
                    <img
                      src={referenceImage}
                      alt="Image de référence"
                      className="w-full h-auto rounded-xl object-contain"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={removeReferenceImage}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary-hover rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <button
                    onClick={handleImageClick}
                    className="w-full p-6 border-2 border-dashed border-primary/30 rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    <div className="flex flex-col items-center gap-2 text-primary/70">
                      <ImagePlus className="h-6 w-6" />
                      <span>Ajouter une image de référence</span>
                    </div>
                  </button>
                )}
              </div>

              <GenerationControls
                settings={settings}
                onSettingsChange={updateSettings}
                onGenerate={handleGenerate}
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
            </div>
          </Card>

          <HelpModal
            open={showHelp}
            onOpenChange={setShowHelp}
          />

          <HistoryModal
            open={showHistory}
            onOpenChange={setShowHistory}
            images={historyImages}
            onDownload={handleDownload}
            onTweak={handleTweak}
          />
        </div>
      </div>

      <GenerationLoadingState 
        isGenerating={status === 'loading'} 
        progress={progress}
      />
    </>
  );
};