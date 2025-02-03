import React from 'react';
import { DeleteImageModal } from '@/components/image-generator/modals/DeleteImageModal';
import { HelpModal } from '@/components/image-generator/modals/HelpModal';
import useModalStore, { ModalId } from '@/state/modalStore';

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const { isOpen, closeModal, modalData } = useModalStore();

  const handleModalClose = async () => {
    closeModal();
    return Promise.resolve();
  };

  return (
    <>
      {children}
      <DeleteImageModal 
        open={isOpen(ModalId.DELETE_IMAGE)}
        onOpenChange={(open) => !open && closeModal()}
        onConfirm={handleModalClose}
        imageUrl={modalData?.data?.imageUrl || ''}
      />
      <HelpModal 
        open={isOpen(ModalId.HELP)}
        onOpenChange={(open) => !open && closeModal()}
      />
    </>
  );
};