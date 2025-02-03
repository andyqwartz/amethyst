import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings2, Wand2 } from "lucide-react";

export interface GenerationButtonsProps {
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
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSettings}
        className={`transition-colors duration-200 ${showSettings ? 'bg-primary/10' : ''}`}
      >
        <Settings2 className="h-4 w-4" />
      </Button>
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="flex-1"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
    </div>
  );
};