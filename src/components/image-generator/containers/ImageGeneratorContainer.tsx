import React from 'react';
import { MainContent } from '../MainContent';
import { ImageGeneratorLayout } from './ImageGeneratorLayout';
import type { GenerationSettings } from '@/types/replicate';

interface ImageGeneratorContainerProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  isGenerating: boolean;
  referenceImage: string | null;
  settings: GenerationSettings;
  generatedImages: string[];
  history: { url: string; settings: GenerationSettings }[];
  isLoading: boolean;
  progress: number;
  currentLogs?: string;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
  handleGenerate: () => void;
  handleTweak: (settings: GenerationSettings) => void;
  handleDownload: (imageUrl: string) => void;
  updateSettings: (settings: Partial<GenerationSettings>) => void;
  setReferenceImage: (image: string | null) => void;
  handleRemoveReferenceImage: () => void;
  handleDeleteHistory: () => Promise<void>;
}

export const ImageGeneratorContainer = ({
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
  currentLogs,
  handleImageUpload,
  handleImageClick,
  handleGenerate,
  handleTweak,
  handleDownload,
  updateSettings,
  handleRemoveReferenceImage,
  handleDeleteHistory
}: ImageGeneratorContainerProps) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDeleteClick = () => setShowDeleteModal(true);
  const handleConfirmDelete = async () => {
    await handleDeleteHistory();
    setShowDeleteModal(false);
  };

  return (
    <ImageGeneratorLayout
      showHelp={showHelp}
      setShowHelp={setShowHelp}
      isGenerating={isGenerating}
      currentLogs={currentLogs}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
      onHelpClick={() => setShowHelp(true)}
      onSettingsClick={() => setShowSettings(!showSettings)}
      onConfirmDelete={handleConfirmDelete}
    >
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
        onDeleteHistory={handleDeleteClick}
      />
    </ImageGeneratorLayout>
  );
};