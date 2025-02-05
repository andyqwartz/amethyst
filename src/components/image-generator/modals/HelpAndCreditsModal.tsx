import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface HelpAndCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpAndCreditsModal = ({
  open,
  onOpenChange
}: HelpAndCreditsModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Aide & Crédits</DialogTitle>
          <DialogDescription>
            Guide d'utilisation et informations sur le projet
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Guide d'utilisation</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Entrez une description détaillée de l'image souhaitée</li>
                <li>Ajustez les paramètres selon vos besoins</li>
                <li>Cliquez sur "Générer" et attendez le résultat</li>
                <li>Téléchargez ou partagez vos créations</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h3 className="text-lg font-semibold">Crédits</h3>
              <div className="space-y-2">
                <p>
                  Ce projet utilise les technologies suivantes :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <a 
                      href="https://replicate.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Replicate
                    </a>
                    {' '}pour la génération d'images
                  </li>
                  <li>
                    <a 
                      href="https://supabase.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Supabase
                    </a>
                    {' '}pour le stockage et l'authentification
                  </li>
                  <li>
                    <a 
                      href="https://ui.shadcn.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      shadcn/ui
                    </a>
                    {' '}pour l'interface utilisateur
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};