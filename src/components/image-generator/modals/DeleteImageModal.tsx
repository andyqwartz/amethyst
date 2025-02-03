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
import { X } from 'lucide-react';
import useModalStore, { ModalId } from '@/state/modalStore';

interface DeleteImageModalData {
  imageUrl?: string;
  onConfirm: () => void;
}

export const DeleteImageModal = () => {
  const { getModalState, getModalData, closeModal } = useModalStore();
  const isOpen = getModalState(ModalId.DELETE_IMAGE);
  const modalData = getModalData(ModalId.DELETE_IMAGE);
  const deleteData = modalData?.type === ModalId.DELETE_IMAGE ? modalData.data : undefined;

  const handleClose = () => closeModal(ModalId.DELETE_IMAGE);
  const handleConfirm = () => {
    deleteData?.onConfirm();
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className="w-screen h-screen max-w-none m-0 p-6 backdrop-blur-xl bg-black/30"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <div className="max-w-lg mx-auto h-full flex flex-col bg-background rounded-xl p-6 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full opacity-70 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </Button>

          <DialogHeader>
            <DialogTitle id="delete-modal-title" className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription id="delete-modal-description">
              Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          
          {deleteData?.imageUrl && (
            <div className="flex-grow flex items-center justify-center p-8">
              <img 
                src={deleteData.imageUrl} 
                alt="Image à supprimer" 
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          )}

          <DialogFooter className="gap-2 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              className="rounded-full"
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              className="rounded-full"
            >
              Supprimer
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
