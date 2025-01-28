import React from 'react';
import { Card } from "@/components/ui/card";
import { ReferenceImageUpload } from './ReferenceImageUpload';
import { GenerationControls } from './GenerationControls';
import { AdvancedSettings } from './AdvancedSettings';
import { ImageSection } from './content/ImageSection';
import { DeleteHistoryButton } from './content/DeleteHistoryButton';
import type { GenerationSettings } from '@/types/replicate';

interface MainContentProps {
  referenceImage: string | null;
  showSettings: boolean;
  settings: GenerationSettings;
  isGenerating: boolean;
  generatedImages: string[];
  history: { url: string; settings: GenerationSettings }[];
  isLoading: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick: () => void;
  onRemoveImage: () => void;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  onToggleSettings: () => void;
  onTweak: (settings: GenerationSettings) => void;
  onDownload: (imageUrl: string) => void;
  onDeleteHistory: () => void;
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
  onDeleteHistory
}: MainContentProps) => {
  // Combine generated images and history into a single array
  const allImages = [...generatedImages, ...history.map(h => h.url)];
  const uniqueImages = Array.from(new Set(allImages));

  return (
    <Card className="border-none glass-card shadow-xl relative">
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

        {!isLoading && uniqueImages.length > 0 && (
          <ImageSection
            title="Images générées"
            images={uniqueImages}
            onTweak={onTweak}
            onDownload={onDownload}
            settings={settings}
          />
        )}

        <DeleteHistoryButton onDelete={onDeleteHistory} />
      </div>
    </Card>
  );
};