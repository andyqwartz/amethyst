import React from 'react';
import { Header } from '../Header';
import { HelpModal } from '../modals/HelpModal';
import { DeleteHistoryModal } from '../modals/DeleteHistoryModal';
import { GenerationLoadingState } from '../GenerationLoadingState';

interface ImageGeneratorLayoutProps {
  children: React.ReactNode;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  isGenerating: boolean;
  currentLogs?: string;
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  onHelpClick: () => void;
  onSettingsClick: () => void;
  onConfirmDelete: () => Promise<void>;
}

export const ImageGeneratorLayout = ({
  children,
  showHelp,
  setShowHelp,
  isGenerating,
  currentLogs,
  showDeleteModal,
  setShowDeleteModal,
  onHelpClick,
  onSettingsClick,
  onConfirmDelete
}: ImageGeneratorLayoutProps) => {
  return (
    <div className="min-h-screen p-4 md:p-6 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <Header
          onHelpClick={onHelpClick}
          onSettingsClick={onSettingsClick}
        />
        {children}
      </div>

      <HelpModal open={showHelp} onOpenChange={setShowHelp} />
      
      <DeleteHistoryModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={onConfirmDelete}
      />

      <GenerationLoadingState 
        isGenerating={isGenerating}
        currentLogs={currentLogs}
      />
    </div>
  );
};