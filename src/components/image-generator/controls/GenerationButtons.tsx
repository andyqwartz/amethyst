import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings2, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationButtonsProps {
  onGenerate: () => void;
  onToggleSettings: () => void;
  isGenerating: boolean;
  showSettings: boolean;
  className?: string;
}

export const GenerationButtons: React.FC<GenerationButtonsProps> = ({
  onGenerate,
  onToggleSettings,
  isGenerating,
  showSettings,
  className
}) => {
  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full max-w-[200px] bg-[#D6BCFA] hover:bg-[#C4B5FD] text-background"
      >
        <Wand2 className="mr-2 h-4 w-4" />
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSettings}
        className={cn(
          "mx-auto transition-all duration-200",
          showSettings && "rotate-180 text-[#D6BCFA]"
        )}
        aria-label="Toggle advanced settings"
      >
        <Settings2 className="h-5 w-5" />
      </Button>
    </div>
  );
};
