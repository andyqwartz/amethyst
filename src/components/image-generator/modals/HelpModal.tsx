import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aide & Crédits</DialogTitle>
          <DialogDescription>
            Cette application utilise l'API Replicate pour générer des images.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <section>
            <h3 className="font-medium mb-2">Comment utiliser</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Entrez une description de l'image souhaitée</li>
              <li>Ajustez les paramètres avancés si nécessaire</li>
              <li>Cliquez sur Générer</li>
            </ul>
          </section>
          <section>
            <h3 className="font-medium mb-2">Crédits</h3>
            <p className="text-sm text-muted-foreground">
              Développé avec ❤️ par l'équipe Lovable
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};