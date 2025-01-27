import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationLoadingStateProps {
  isGenerating: boolean;
  progress: number;
}

const messages = [
  "Préparation en cours, cela peut prendre un moment...",
  "La magie est en train d'opérer, patience...",
  "Ça arrive ! Votre création prend forme.",
  "Les dernières touches sont en cours d'application..."
];

export const GenerationLoadingState = ({ 
  isGenerating,
  progress 
}: GenerationLoadingStateProps) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    if (!isGenerating) return;
    
    const messageIndex = Math.floor((progress / 100) * messages.length);
    setCurrentMessage(messages[Math.min(messageIndex, messages.length - 1)]);
  }, [isGenerating, progress]);

  if (!isGenerating) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card/90 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl animate-fade-in">
        <div className="flex flex-col items-center space-y-6">
          {/* Animation centrale */}
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse" />
            <Loader className="w-12 h-12 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          </div>

          {/* Message dynamique */}
          <p className="text-center text-lg text-foreground/90 animate-fade-in">
            {currentMessage}
          </p>

          {/* Barre de progression */}
          <div className="w-full space-y-2">
            <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-sm text-foreground/70">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};