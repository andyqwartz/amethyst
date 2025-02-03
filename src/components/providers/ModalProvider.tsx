import React, { useState } from 'react';
import { DeleteImageModal } from '@/components/image-generator/modals/DeleteImageModal';
import { HelpModal } from '@/components/image-generator/modals/HelpModal';

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState('');

  const handleConfirmDelete = async () => {
    // Implement delete logic here
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      {children}
      <DeleteImageModal 
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        imageUrl={selectedImageUrl}
      />
      <HelpModal 
        open={isHelpModalOpen}
        onOpenChange={setIsHelpModalOpen}
      />
    </>
  );
};