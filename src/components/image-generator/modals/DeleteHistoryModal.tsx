import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export const DeleteHistoryModal = ({
  open,
  onOpenChange,
  onConfirm
}: DeleteHistoryModalProps) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none shadow-none">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold text-white">
            Supprimer l'historique
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Êtes-vous sûr de vouloir supprimer tout l'historique de génération ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-3 pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/10 transition-all duration-300"
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-accent hover:bg-accent/80 text-black font-medium transition-all duration-300"
          >
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};