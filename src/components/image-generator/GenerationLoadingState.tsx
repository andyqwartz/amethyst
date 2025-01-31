import React, { memo } from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface GenerationLoadingStateProps {
  isGenerating: boolean;
  currentLogs?: string;
  error?: string;
  progress?: number;
}

const GenerationLoadingStateComponent = ({ 
  isGenerating,
  currentLogs,
  error,
  progress = 0
}: GenerationLoadingStateProps) => {
  if (!isGenerating && !error) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/90 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <Card className="w-[90%] max-w-md p-6 space-y-4 relative">
        <div className="flex items-center gap-3">
          {isGenerating && <Loader2 className="h-5 w-5 animate-spin" />}
          <h3 className="text-lg font-semibold">
            {error ? "Erreur de génération" : "Génération en cours..."}
          </h3>
        </div>
        
        {progress > 0 && (
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, progress)}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}

        {error ? (
          <div className="text-destructive p-4 rounded-md bg-destructive/10">
            {error}
          </div>
        ) : currentLogs?.trim() ? (
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <pre className="text-sm whitespace-pre-wrap break-words">{currentLogs}</pre>
          </ScrollArea>
        ) : null}
      </Card>
    </div>
  );
};

export const GenerationLoadingState = memo(GenerationLoadingStateComponent);

GenerationLoadingState.displayName = 'GenerationLoadingState';
