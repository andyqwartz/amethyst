import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-[90%] max-w-md p-6 space-y-4">
        <h3 className="text-lg font-semibold">Génération en cours...</h3>
        {currentLogs && (
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            <pre className="text-sm whitespace-pre-wrap">{currentLogs}</pre>
          </ScrollArea>
        )}
      </Card>
    </div>
  );
};