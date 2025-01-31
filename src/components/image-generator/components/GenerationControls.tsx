import React from 'react';
import { Button } from '@/components/ui/button';
import { useGenerationState } from '../hooks/useGenerationState';
import { Play, Square } from 'lucide-react';

interface GenerationControlsProps {
  onStart?: () => void;
  onStop?: () => void;
  className?: string;
}

export const GenerationControls: React.FC<GenerationControlsProps> = ({
  onStart,
  onStop,
  className = '',
}) => {
  const { isGenerating, isPaused } = useGenerationState();

  const handleStart = () => {
    onStart?.();
  };

  const handleStop = () => {
    onStop?.();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        onClick={handleStart}
        disabled={isGenerating && !isPaused}
        variant="default"
        size="sm"
        className="w-24"
      >
        <Play className="mr-2 h-4 w-4" />
        {isGenerating && !isPaused ? 'Running' : 'Start'}
      </Button>

      <Button
        onClick={handleStop}
        disabled={!isGenerating || isPaused}
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