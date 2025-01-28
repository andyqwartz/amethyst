import React from 'react';
import { Card } from "@/components/ui/card";
import { ReferenceImageUpload } from './ReferenceImageUpload';
import { GenerationControls } from './GenerationControls';
import { AdvancedSettings } from './AdvancedSettings';
import { ImagePreview } from './ImagePreview';
import type { GenerationSettings } from '@/types/replicate';

interface MainContentProps {
  referenceImage: string | null;
  showSettings: boolean;
  settings: GenerationSettings;
  isGenerating: boolean;
  generatedImages: string[];
  history: { url: string }[];
  isLoading: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick: () => void;
  onRemoveImage: () => void;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  onToggleSettings: () => void;
  onTweak: (settings: GenerationSettings) => void;
  onDownload: (imageUrl: string) => void;
}

export const MainContent = ({
  referenceImage,
  showSettings,
  settings,
  isGenerating,
  generatedImages,
  history,
  isLoading,
  onImageUpload,
  onImageClick,
  onRemoveImage,
  onSettingsChange,
  onGenerate,
  onToggleSettings,
  onTweak,
  onDownload,
}: MainContentProps) => {
  console.log('MainContent - showSettings:', showSettings);
  console.log('MainContent - settings:', settings);

  return (
    <Card className="border-none glass-card shadow-xl">
      <div className="p-6 space-y-8">
        <ReferenceImageUpload
          referenceImage={referenceImage}
          onImageUpload={onImageUpload}
          onImageClick={onImageClick}
          onRemoveImage={onRemoveImage}
        />

        <GenerationControls
          settings={settings}
          onSettingsChange={onSettingsChange}
          onGenerate={onGenerate}
          onToggleSettings={onToggleSettings}
          isGenerating={isGenerating}
        />

        {showSettings && (
          <AdvancedSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        )}

        <ImagePreview
          images={generatedImages}
          onTweak={onTweak}
          onDownload={onDownload}
          settings={settings}
        />

        {!isLoading && history.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Dernières générations</h3>
            <ImagePreview
              images={history.map(h => h.url)}
              onTweak={onTweak}
              onDownload={onDownload}
              settings={settings}
            />
          </div>
        )}
      </div>
    </Card>
  );
};