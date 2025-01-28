import React from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PromptInput } from './controls/PromptInput';
import { GenerationButtons } from './controls/GenerationButtons';
import type { GenerationSettings } from '@/types/replicate';

interface GenerationControlsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  onToggleSettings: () => void;
  isGenerating: boolean;
}

export const GenerationControls = ({
  settings,
  onSettingsChange,
  onGenerate,
  onToggleSettings,
  isGenerating
}: GenerationControlsProps) => {
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!settings.prompt?.trim()) {
      toast({
        title: "Prompt requis",
        description: "Veuillez entrer une description de l'image à générer",
        variant: "destructive"
      });
      return;
    }

    console.log('Starting generation with settings:', settings);
    onGenerate();
    onToggleSettings(); // Close advanced settings after generation
  };

  return (
    <div className="space-y-6">
      <PromptInput
        settings={settings}
        onSettingsChange={onSettingsChange}
        onGenerate={handleGenerate}
      />
      <GenerationButtons
        onToggleSettings={onToggleSettings}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
      />
    </div>
  );
};