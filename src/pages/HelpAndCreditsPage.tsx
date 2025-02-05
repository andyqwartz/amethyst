import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UsageGuide } from '@/components/image-generator/modals/help/UsageGuide';
import { Tips } from '@/components/image-generator/modals/help/Tips';
import { AdvancedParams } from '@/components/image-generator/modals/help/AdvancedParams';
import { Credits } from '@/components/image-generator/modals/help/Credits';
import { Contact } from '@/components/image-generator/modals/help/Contact';

export default function HelpAndCreditsPage() {
  const [activeSection, setActiveSection] = React.useState('usage');

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-primary">Aide & Crédits</h1>
        
        <ScrollArea className="h-[600px] pr-4">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
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
      </Card>
    </div>
  );
}
