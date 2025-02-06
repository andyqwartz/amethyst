import React from 'react';
import { GenerationControls } from './GenerationControls';
import { ImagePreview } from './ImagePreview';
import { ReferenceImageUpload } from './ReferenceImageUpload';
import type { ImageSettings } from '@/types/generation';

interface MainContentProps {
  referenceImage: string | null;
  showSettings: boolean;
  settings: ImageSettings;
  isGenerating: boolean;
  generatedImages: string[];
  history: Array<{ url: string; settings: ImageSettings }>;
  isLoading: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageClick: () => void;
  onRemoveImage: () => void;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  onGenerate: () => void;
  onToggleSettings: () => void;
  onTweak: (settings: Partial<ImageSettings>) => void;
  onDownload: (imageUrl: string, outputFormat: string) => Promise<void>;
  onDeleteImage: (imageUrl: string) => void;
  onDeleteHistory: () => void;
}

export const MainContent: React.FC<MainContentProps> = ({
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
  onDeleteImage,
  onDeleteHistory
}) => {
  return (
    <div className="space-y-6">
      {/* Reference Image Upload */}
      <ReferenceImageUpload
        referenceImage={referenceImage}
        onImageUpload={onImageUpload}
        onImageClick={onImageClick}
        onRemoveImage={onRemoveImage}
      />

      {/* Generation Controls */}
      <GenerationControls
        settings={settings}
        onSettingsChange={onSettingsChange}
        onGenerate={onGenerate}
        onToggleSettings={onToggleSettings}
        isGenerating={isGenerating}
        showSettings={showSettings}
      />

      {/* Image Preview */}
      <ImagePreview
        generatedImages={generatedImages}
        history={history}
        isLoading={isLoading}
        onTweak={onTweak}
        onDownload={onDownload}
        onDeleteImage={onDeleteImage}
        onDeleteHistory={onDeleteHistory}
      />
    </div>
  );
};
