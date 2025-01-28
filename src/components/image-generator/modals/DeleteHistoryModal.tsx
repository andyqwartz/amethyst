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
      <DialogContent className="sm:max-w-md bg-card/95 border-accent/20 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Supprimer l'historique</DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Êtes-vous sûr de vouloir supprimer tout l'historique de génération ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-accent/50 text-white hover:bg-accent/20 transition-all duration-300"
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-accent hover:bg-accent/80 text-black font-medium border-none transition-all duration-300"
          >
            Supprimer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};