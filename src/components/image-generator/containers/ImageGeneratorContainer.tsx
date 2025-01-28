import React from 'react';
import { MainContent } from '../MainContent';
import { Header } from '../Header';
import { HelpModal } from '../modals/HelpModal';
import { GenerationLoadingState } from '../GenerationLoadingState';
import { DeleteHistoryModal } from '../modals/DeleteHistoryModal';
import type { GenerationSettings } from '@/types/replicate';

interface ImageGeneratorContainerProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
  isGenerating: boolean;
  referenceImage: string | null;
  settings: GenerationSettings;
  generatedImages: string[];
  history: { url: string; settings: GenerationSettings }[];
  allHistory: any[];
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
  handleDeleteHistory: () => Promise<void>;
}

export const ImageGeneratorContainer = ({
  showSettings,
  setShowSettings,
  showHelp,
  setShowHelp,
  showHistory,
  setShowHistory,
  isGenerating,
  referenceImage,
  settings,
  generatedImages,
  history,
  allHistory,
  isLoading,
  progress,
  currentLogs,
  handleImageUpload,
  handleImageClick,
  handleGenerate,
  handleTweak,
  handleDownload,
  updateSettings,
  setReferenceImage,
  handleDeleteHistory
}: ImageGeneratorContainerProps) => {
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  return (
    <div className="min-h-screen p-4 md:p-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Header
          onHelpClick={() => setShowHelp(true)}
          onSettingsClick={() => setShowSettings(!showSettings)}
        />

        <MainContent
          referenceImage={referenceImage}
          showSettings={showSettings}
          settings={settings}
          isGenerating={isGenerating}
          generatedImages={generatedImages}
          history={allHistory}
          isLoading={isLoading}
          onImageUpload={handleImageUpload}
          onImageClick={handleImageClick}
          onRemoveImage={() => setReferenceImage(null)}
          onSettingsChange={updateSettings}
          onGenerate={handleGenerate}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onTweak={handleTweak}
          onDownload={handleDownload}
          onDeleteHistory={() => setShowDeleteModal(true)}
        />
      </div>

      <HelpModal open={showHelp} onOpenChange={setShowHelp} />
      
      <DeleteHistoryModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteHistory}
      />

      <GenerationLoadingState 
        isGenerating={isGenerating}
        currentLogs={currentLogs}
      />
    </div>
  );
};