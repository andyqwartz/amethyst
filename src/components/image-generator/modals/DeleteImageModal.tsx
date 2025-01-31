import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useModalStore from '@/state/modalStore';

interface DeleteImageModalData {
  imageUrl?: string;
  onConfirm: () => void;
}

export const DeleteImageModal = () => {
  const { getModalState, getModalData, closeModal } = useModalStore();
  const isOpen = getModalState('delete-image');
  const modalData = getModalData('delete-image') as DeleteImageModalData;

  const handleClose = () => closeModal('delete-image');
  const handleConfirm = () => {
    modalData?.onConfirm();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        {modalData?.imageUrl && (
          <div className="mt-4">
            <img 
              src={modalData.imageUrl} 
              alt="Image to delete" 
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
