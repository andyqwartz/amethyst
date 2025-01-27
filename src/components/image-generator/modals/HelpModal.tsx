import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none m-0 p-6 backdrop-blur-xl bg-black/30">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Aide & Crédits
            </DialogTitle>
            <DialogDescription className="text-lg">
              Guide d'utilisation et informations sur l'application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-8 overflow-y-auto flex-grow glass-card p-8 rounded-lg">
            <section>
              <h3 className="text-xl font-semibold mb-4 text-primary">Comment utiliser</h3>
              <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                <li>Entrez une description détaillée de l'image souhaitée</li>
                <li>Ajoutez une image de référence (optionnel)</li>
                <li>Ajustez les paramètres avancés selon vos besoins</li>
                <li>Cliquez sur Générer et attendez le résultat</li>
              </ul>
            </section>
            
            <Separator className="bg-primary/20" />
            
            <section>
              <h3 className="text-xl font-semibold mb-4 text-primary">Paramètres avancés</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><strong>Ratio d'aspect :</strong> Format de l'image (1:1, 16:9, etc.)</li>
                <li><strong>Nombre d'images :</strong> Nombre d'images à générer (1-4)</li>
                <li><strong>Format de sortie :</strong> Format des fichiers (WebP, JPG, PNG)</li>
                <li><strong>Échelle de guidage :</strong> Influence du prompt (0-10)</li>
              </ul>
            </section>
            
            <Separator className="bg-primary/20" />
            
            <section>
              <h3 className="text-xl font-semibold mb-4 text-primary">Crédits</h3>
              <p className="text-muted-foreground">
                Développé avec ❤️ par l'équipe Lovable.<br />
                Propulsé par l'API Replicate et Stable Diffusion.
              </p>
            </section>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};