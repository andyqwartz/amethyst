import React from 'react';
import { Button } from "@/components/ui/button";
import { History, HelpCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

export const Header = ({
  onHistoryClick,
  onSettingsClick,
  onHelpClick
}: HeaderProps) => {
  return (
    <div className="relative overflow-hidden bg-card/80 p-6 rounded-xl flex justify-between items-center mb-4 glass-card border border-primary/20 shadow-lg animate-fade-in">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%] animate-[gradient_8s_linear_infinite]">
            Amethyst
          </h1>
          <span className="text-sm text-primary/70">AI Image Generator</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onHistoryClick}
          className="hover:bg-primary/10 hover-scale"
        >
          <History className="h-5 w-5 text-primary" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onHelpClick}
          className="hover:bg-primary/10 hover-scale"
        >
          <HelpCircle className="h-5 w-5 text-primary" />
        </Button>
      </div>
    </div>
  );
};