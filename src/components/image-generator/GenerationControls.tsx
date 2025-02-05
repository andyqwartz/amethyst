import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { PromptInput } from './controls/PromptInput';
import { GenerationButtons } from './controls/GenerationButtons';
import type { GenerationSettings } from '@/types/replicate';

interface GenerationControlsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  onGenerate: () => void;
  onToggleSettings: () => void;
  isGenerating: boolean;
  showSettings?: boolean;
}

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  settings,
  onSettingsChange,
  onGenerate,
  onToggleSettings,
  isGenerating,
  showSettings = false
}) => {
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
  };

  return (
    <div className="space-y-4 w-full">
      <PromptInput
        settings={settings}
<<<<<<< HEAD
        updateSettings={onSettingsChange}
=======
        onSettingsChange={onSettingsChange}
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
        onGenerate={handleGenerate}
      />
      <div className="flex justify-center">
        <GenerationButtons
          onToggleSettings={onToggleSettings}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          showSettings={showSettings}
        />
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
