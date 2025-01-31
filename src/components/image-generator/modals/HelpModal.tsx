import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageGuide } from './help/UsageGuide';
import { Tips } from './help/Tips';
import { AdvancedParams } from './help/AdvancedParams';
import { Credits } from './help/Credits';
import { Contact } from './help/Contact';

interface HelpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HelpModal = ({
  open,
  onOpenChange
}: HelpModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Aide</DialogTitle>
          <DialogDescription>
            Guide d'utilisation et conseils
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px]">
          <Tabs defaultValue="usage" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="usage">Guide</TabsTrigger>
              <TabsTrigger value="tips">Conseils</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
              <TabsTrigger value="credits">Crédits</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="usage">
              <UsageGuide />
            </TabsContent>
            <TabsContent value="tips">
              <Tips />
            </TabsContent>
            <TabsContent value="advanced">
              <AdvancedParams />
            </TabsContent>
            <TabsContent value="credits">
              <Credits />
            </TabsContent>
            <TabsContent value="contact">
              <Contact />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};