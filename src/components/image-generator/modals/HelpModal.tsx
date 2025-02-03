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

export const HelpModal: React.FC<HelpModalProps> = ({
  open,
  onOpenChange
}) => {
  const [activeSection, setActiveSection] = React.useState('usage');

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
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="usage">Guide</TabsTrigger>
              <TabsTrigger value="tips">Conseils</TabsTrigger>
              <TabsTrigger value="advanced">Avancé</TabsTrigger>
              <TabsTrigger value="credits">Crédits</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="usage" className="mt-0">
              <UsageGuide />
            </TabsContent>
            <TabsContent value="tips" className="mt-0">
              <Tips />
            </TabsContent>
            <TabsContent value="advanced" className="mt-0">
              <AdvancedParams />
            </TabsContent>
            <TabsContent value="credits" className="mt-0">
              <Credits />
            </TabsContent>
            <TabsContent value="contact" className="mt-0">
              <Contact />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};