import React, { useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Settings, Sparkles } from 'lucide-react';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';

interface GenerationButtonsProps {
  onGenerationStart?: () => void;
}

export const GenerationButtons: React.FC<GenerationButtonsProps> = ({
  onGenerationStart
}) => {
  const isGenerating = useImageGeneratorStore((state) => state.ui.isGenerating);
  const showSettings = useImageGeneratorStore((state) => state.ui.showSettings);
  const setShowSettings = useImageGeneratorStore((state) => state.setShowSettings);
  const setIsGenerating = useImageGeneratorStore((state) => state.setIsGenerating);

  // Log l'état du bouton à chaque changement
  useEffect(() => {
    console.log('État du bouton paramètres:', { showSettings, isGenerating });
  }, [showSettings, isGenerating]);

  const handleGenerateClick = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isGenerating) return;
    
    try {
      console.log('Démarrage de la génération...');
      onGenerationStart?.();
      setIsGenerating(true);
    } catch (error) {
      console.error('Erreur lors du démarrage de la génération:', error);
      setIsGenerating(false);
    }
  }, [isGenerating, setIsGenerating, onGenerationStart]);

  const handleSettingsClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isGenerating) return;
    
    const newState = !showSettings;
    console.log('Toggle des paramètres avancés:', newState);
    setShowSettings(newState);
  }, [isGenerating, showSettings, setShowSettings]);
  
  return (
    <div className="flex flex-col gap-3" role="group" aria-label="Contrôles de génération">
      <Button
        onClick={handleSettingsClick}
        className={`w-full bg-card hover:bg-card/80 text-foreground border transition-all duration-200 ${
          showSettings 
            ? 'border-primary bg-primary/5' 
            : 'border-primary/20'
        } rounded-full`}
        variant="secondary"
        disabled={isGenerating}
        type="button"
        data-state={showSettings ? 'active' : 'inactive'}
        data-show-settings={showSettings}
        aria-expanded={showSettings}
        aria-controls="advanced-settings-panel"
        aria-pressed={showSettings}
      >
        <Settings 
          className={`h-4 w-4 mr-2 transition-transform duration-200 ${
            showSettings ? 'rotate-180 text-primary' : ''
          }`} 
          aria-hidden="true"
        />
        Paramètres avancés
      </Button>

      <Button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        className="w-full bg-primary hover:bg-primary-hover text-primary-foreground rounded-full transition-all duration-200"
        type="button"
      >
        <Sparkles 
          className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} 
          aria-hidden="true"
        />
        {isGenerating ? 'Génération en cours...' : 'Générer'}
      </Button>
    </div>
  );
};
