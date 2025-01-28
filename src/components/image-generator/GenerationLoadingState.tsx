import React from 'react';

interface GenerationLoadingStateProps {
  isGenerating: boolean;
  currentLogs?: string;
}

export const GenerationLoadingState = ({
  isGenerating,
  currentLogs
}: GenerationLoadingStateProps) => {
  if (!isGenerating) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg border max-w-md">
      <div className="text-sm font-mono whitespace-pre-wrap">
        {currentLogs || 'Génération en cours...'}
      </div>
    </div>
  );
};