import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UsageGuide } from './help/UsageGuide';
import { AdvancedParams } from './help/AdvancedParams';
import { Tips } from './help/Tips';
import { Contact } from './help/Contact';
import { Credits } from './help/Credits';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = ({ open, onOpenChange }: HelpModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-screen w-screen max-w-none m-0 p-6 backdrop-blur-xl bg-black/30">
        <div className="max-w-4xl mx-auto h-[calc(100vh-3rem)] flex flex-col">
          <DialogHeader className="flex-shrink-0 mb-6">
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Aide & Crédits
            </DialogTitle>
            <DialogDescription className="text-lg">
              Guide d'utilisation et informations sur l'application
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 min-h-0 pr-6 glass-card rounded-lg">
            <div className="p-6 space-y-8">
              <UsageGuide />
              <Separator className="bg-primary/20" />
              <AdvancedParams />
              <Separator className="bg-primary/20" />
              <Tips />
              <Separator className="bg-primary/20" />
              <Contact />
              <Separator className="bg-primary/20" />
              <Credits />
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};