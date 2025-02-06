import React from 'react';
import { MainContent } from '../MainContent';
import { HelpModal } from '../modals/HelpModal';
import { GenerationLoadingState } from '../GenerationLoadingState';
import { DeleteHistoryModal } from '../modals/DeleteHistoryModal';
import { AdvancedSettings } from '../AdvancedSettings';
import type { ImageSettings } from '@/types/generation';

interface ImageGeneratorContainerProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  isGenerating: boolean;
  referenceImage: string | null;
  settings: ImageSettings;
  generatedImages: string[];
  history: Array<{ url: string; settings: ImageSettings }>;
  isLoading: boolean;
  progress: number;
  currentLogs?: string;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
  handleGenerate: () => void;
  handleTweak: (settings: Partial<ImageSettings>) => void;
  handleDownload: (imageUrl: string, outputFormat: string) => Promise<void>;
  handleDeleteImage: (imageUrl: string) => void;
  updateSettings: (settings: Partial<ImageSettings>) => void;
  setReferenceImage: (image: string | null) => void;
  handleRemoveReferenceImage: () => void;
  handleDeleteHistory: () => Promise<void>;
}

export const ImageGeneratorContainer: React.FC<ImageGeneratorContainerProps> = ({
  showSettings,
  setShowSettings,
  showHelp,
  setShowHelp,
  isGenerating,
  referenceImage,
  settings,
  generatedImages,
  history,
  isLoading,
  progress,
  currentLogs,
  handleImageUpload,
  handleImageClick,
  handleGenerate,
  handleTweak,
  handleDownload,
  handleDeleteImage,
  updateSettings,
  setReferenceImage,
  handleRemoveReferenceImage,
  handleDeleteHistory
}) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteHistory();
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 animate-fade-in">
      <div className="max-w-2xl mx-auto space-y-6">
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
          onRemoveImage={handleRemoveReferenceImage}
          onSettingsChange={updateSettings}
          onGenerate={handleGenerate}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onTweak={handleTweak}
          onDownload={handleDownload}
          onDeleteImage={handleDeleteImage}
          onDeleteHistory={handleDeleteClick}
        />

        <AdvancedSettings
          settings={settings}
          onSettingsChange={updateSettings}
          isOpen={showSettings}
          onToggle={() => setShowSettings(!showSettings)}
        />
      </div>

      <HelpModal 
        open={showHelp}
        onOpenChange={setShowHelp}
      />
      
      <DeleteHistoryModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <GenerationLoadingState 
        isGenerating={isGenerating}
        currentLogs={currentLogs}
      />
    </div>
  );
};
