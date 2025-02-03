import React from 'react';
import { Button } from '@/components/ui/button';
import { useGenerationState } from '../hooks/useGenerationState';
import { Play, Square } from 'lucide-react';
import { GenerationButtonsProps } from '@/types/generation';

interface Props extends GenerationButtonsProps {
  onGenerationStart: () => void;
}

export const GenerationControls: React.FC<Props> = ({
  onGenerate,
  onGenerationStart,
  isGenerating
}) => {
  const { isGenerating: stateGenerating } = useGenerationState();

  const handleStart = () => {
    onGenerationStart();
  };

  const handleStop = () => {
    onGenerate();
  };

  return (
    <div className={`flex items-center gap-2`}>
      <Button
        onClick={handleStart}
        disabled={stateGenerating}
        variant="default"
        size="sm"
        className="w-24"
      >
        <Play className="mr-2 h-4 w-4" />
        {stateGenerating ? 'Running' : 'Start'}
      </Button>

      <Button
        onClick={handleStop}
        disabled={!stateGenerating}
        variant="destructive"
        size="sm"
        className="w-24"
      >
        <Square className="mr-2 h-4 w-4" />
        Stop
      </Button>
    </div>
  );
};