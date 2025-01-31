import React from 'react';
import { DeleteImageModal } from '@/components/image-generator/modals/DeleteImageModal';
import { HelpModal } from '@/components/image-generator/modals/HelpModal';

interface ModalProviderProps {
  children: React.ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  return (
    <>
      {children}
      <DeleteImageModal />
      <HelpModal />
    </>
  );
};
