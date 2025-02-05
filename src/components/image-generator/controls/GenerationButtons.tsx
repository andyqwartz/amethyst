import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings2, Wand2 } from 'lucide-react';

export interface GenerationButtonsProps {
  onToggleSettings: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  showSettings?: boolean;
}

export const GenerationButtons: React.FC<GenerationButtonsProps> = ({
  onToggleSettings,
  onGenerate,
  isGenerating,
  showSettings = false
}) => {
  return (
    <div className="flex flex-col gap-2 w-full max-w-[600px]">
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full flex items-center gap-2"
      >
        <Wand2 className="h-5 w-5" />
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSettings}
        className={`mx-auto transition-all duration-200 ${showSettings ? 'bg-primary/10' : ''}`}
      >
        <Settings2 className="h-5 w-5" />
      </Button>
    </div>
  );
};