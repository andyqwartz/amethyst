import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings2, Wand2 } from 'lucide-react';

export interface GenerationButtonsProps {
  onToggleSettings: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  showSettings?: boolean;
  onGenerationStart?: () => void;
}

export const GenerationButtons: React.FC<GenerationButtonsProps> = ({
  onToggleSettings,
  onGenerate,
  isGenerating,
  showSettings = false,
  onGenerationStart
}) => {
  const handleGenerate = () => {
    onGenerationStart?.();
    onGenerate();
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSettings}
        className={`transition-all duration-200 ${showSettings ? 'bg-primary/10' : ''}`}
      >
        <Settings2 className="h-5 w-5" />
      </Button>
      <Button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="flex items-center gap-2"
      >
        <Wand2 className="h-5 w-5" />
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
};