import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface DeleteImageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  imageUrl: string;
}

export const DeleteImageModal = ({
  open,
  onOpenChange,
  onConfirm,
  imageUrl
}: DeleteImageModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to delete image:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-transparent border-none shadow-none" closeButton={false}>
        <div className="relative">
          <img
            src={imageUrl}
            alt="Image à supprimer"
            className="w-full h-48 object-cover rounded-t-xl opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 rounded-t-xl" />
        </div>
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold text-white">
            Supprimer l'image
          </DialogTitle>
          <DialogDescription className="text-gray-300 mt-2">
            Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center space-x-3 pt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/10 transition-all duration-300"
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium transition-all duration-300"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression...
              </>
            ) : (
              'Supprimer'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
