import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

export interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aide & Crédits</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            Cette application utilise l'intelligence artificielle pour générer des images
            à partir de descriptions textuelles.
          </p>
          <p>
            Vous pouvez ajuster les paramètres pour personnaliser vos images, y compris le
            format, la qualité et d'autres options avancées.
          </p>
          <p>
            Pour toute question ou problème, n'hésitez pas à consulter la documentation ou
            à contacter le support.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
