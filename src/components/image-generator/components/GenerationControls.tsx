import React from 'react';
import { Button } from '@/components/ui/button';
import { useGenerationState } from '@/hooks/useGenerationState';
import { Play, Square } from 'lucide-react';

export interface GenerationButtonsProps {
  onToggleSettings: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
  showSettings?: boolean;
}

export const GenerationControls: React.FC<GenerationButtonsProps> = ({
  onToggleSettings,
  onGenerate,
  isGenerating,
  showSettings = false
}) => {
  const { isGenerating: generating } = useGenerationState();

  return (
    <div className="flex flex-col gap-2 w-full">
      <Button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full flex items-center gap-2"
      >
        <Play className="h-5 w-5" />
        {isGenerating ? 'Generating...' : 'Generate'}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleSettings}
        className={`mx-auto transition-all duration-200 ${showSettings ? 'bg-primary/10' : ''}`}
      >
        <Square className="h-5 w-5" />
      </Button>
    </div>
  );
};