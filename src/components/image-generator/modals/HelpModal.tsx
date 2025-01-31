import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHelpContent } from '@/hooks/useHelpContent';
import useModalStore from '@/state/modalStore';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsageGuide } from './help/UsageGuide';
import { Tips } from './help/Tips';
import { AdvancedParams } from './help/AdvancedParams';
import { Credits } from './help/Credits';
import { Contact } from './help/Contact';

const MODAL_ID = 'help';

export const HelpModal = () => {
  const { activeSection, setActiveSection, isValidSection } = useHelpContent();
  const { getModalState, closeModal } = useModalStore();
  const isOpen = getModalState(MODAL_ID);

  const handleOpenChange = (open: boolean) => {
    if (!open) closeModal(MODAL_ID);
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] transition-all duration-300">
        <DialogHeader>
          <DialogTitle>Aide</DialogTitle>
          <DialogDescription>
            Guide d'utilisation et conseils
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px]">
          <Tabs value={activeSection} onValueChange={(value) => isValidSection(value) && setActiveSection(value)} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="usage" className="transition-all duration-200">Guide</TabsTrigger>
              <TabsTrigger value="tips" className="transition-all duration-200">Conseils</TabsTrigger>
              <TabsTrigger value="advanced" className="transition-all duration-200">Avancé</TabsTrigger>
              <TabsTrigger value="credits" className="transition-all duration-200">Crédits</TabsTrigger>
              <TabsTrigger value="contact" className="transition-all duration-200">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="usage" className="transition-all duration-300 data-[state=active]:animate-fadeIn">
              <UsageGuide />
            </TabsContent>
            <TabsContent value="tips" className="transition-all duration-300 data-[state=active]:animate-fadeIn">
              <Tips />
            </TabsContent>
            <TabsContent value="advanced" className="transition-all duration-300 data-[state=active]:animate-fadeIn">
              <AdvancedParams />
            </TabsContent>
            <TabsContent value="credits" className="transition-all duration-300 data-[state=active]:animate-fadeIn">
              <Credits />
            </TabsContent>
            <TabsContent value="contact" className="transition-all duration-300 data-[state=active]:animate-fadeIn">
              <Contact />
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
