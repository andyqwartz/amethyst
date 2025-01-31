import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Sparkles } from 'lucide-react';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';

export const GenerationButtons = () => {
  const isGenerating = useImageGeneratorStore((state) => state.ui.isGenerating);
  const isSettingsModalOpen = useImageGeneratorStore((state) => state.ui.isSettingsModalOpen);
  const setIsSettingsModalOpen = useImageGeneratorStore((state) => state.setIsSettingsModalOpen);
  const setIsGenerating = useImageGeneratorStore((state) => state.setIsGenerating);

  const handleGenerateClick = () => {
    if (!isGenerating) {
      if (isSettingsModalOpen) {
        setIsSettingsModalOpen(false);
      }
      setIsGenerating(true);
    }
  };
  
  return (
    <div className="flex flex-col gap-3 px-4">
      <Button
        onClick={() => setIsSettingsModalOpen(!isSettingsModalOpen)}
        className="w-full bg-card hover:bg-card/80 text-foreground border border-primary/20 rounded-full transition-all duration-200"
        variant="secondary"
        disabled={isGenerating}
      >
        <Settings className="h-4 w-4 mr-2" />
        Paramètres avancés
      </Button>

      <Button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-full transition-all duration-200"
      >
        <Sparkles className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
        {isGenerating ? 'Génération en cours...' : 'Générer'}
      </Button>
    </div>
  );
};
