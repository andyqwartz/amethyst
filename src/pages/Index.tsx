import { Button } from "@/components/ui/button";
import { History, HelpCircle, Sparkles } from 'lucide-react';
import { useState } from "react";
import { HelpModal } from "@/components/modals/HelpModal";
import { HistoryModal } from "@/components/modals/HistoryModal";

const Index = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Header flottant */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary animate-pulse" />
            <div className="flex flex-col items-start">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%] animate-[gradient_8s_linear_infinite]">
                Amethyst
              </h1>
              <span className="text-sm text-primary/70">AI Image Generator</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowHistory(true)}
              className="hover:bg-primary/10 hover-scale"
            >
              <History className="h-5 w-5 text-primary" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowHelp(true)}
              className="hover:bg-primary/10 hover-scale"
            >
              <HelpCircle className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="pt-24 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Ajoutez ici le contenu principal de votre application */}
        </div>
      </div>

      {/* Modales */}
      <HelpModal
        open={showHelp}
        onOpenChange={setShowHelp}
      />

      <HistoryModal
        open={showHistory}
        onOpenChange={setShowHistory}
        images={[]}
        onDownload={() => {}}
        onTweak={() => {}}
      />
    </div>
  );
};

export default Index;