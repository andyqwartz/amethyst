import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Sparkles } from 'lucide-react';

interface GenerationButtonsProps {
  onToggleSettings: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  showSettings: boolean;
}

export const GenerationButtons = ({ 
  onToggleSettings, 
  onGenerate, 
  isGenerating,
  showSettings
}: GenerationButtonsProps) => {
  const handleGenerateClick = () => {
    if (!isGenerating) {
      if (showSettings) {
        onToggleSettings();
      }
      onGenerate();
    }
  };
  
  return (
    <div className="flex flex-col gap-3 px-4">
      <Button
        onClick={onToggleSettings}
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