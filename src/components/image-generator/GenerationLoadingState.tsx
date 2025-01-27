import React, { useEffect, useState } from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GenerationLoadingStateProps {
  isGenerating: boolean;
  progress: number;
}

const messages = [
  "Démarrage...",
  "Analyse...",
  "Génération...",
  "Finalisation..."
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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-card/80 p-8 rounded-2xl max-w-md w-full mx-4 shadow-2xl animate-fade-in border border-primary/10 animate-border-glow">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-32 h-32 animate-float">
            <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="absolute inset-2 bg-primary/10 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute inset-4 bg-primary/15 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="absolute inset-6 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }} />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="w-12 h-12 text-primary animate-spin" 
                     style={{ 
                       filter: 'drop-shadow(0 0 8px rgba(155, 135, 245, 0.5))',
                       animation: 'spin 3s linear infinite'
                     }} 
              />
            </div>
          </div>

          <p className="text-center text-lg text-foreground/90 font-light animate-fade-in">
            {currentMessage}
          </p>

          <div className="w-full space-y-2">
            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-300 ease-out rounded-full"
                style={{ 
                  width: `${progress}%`,
                  boxShadow: '0 0 10px rgba(155, 135, 245, 0.3)'
                }}
              />
            </div>
            <div className="flex justify-between items-center text-sm text-foreground/70">
              <span>Progression</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};