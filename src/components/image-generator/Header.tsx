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
    <div className="relative overflow-hidden p-6 rounded-xl flex justify-between items-center mb-6 backdrop-blur-xl bg-gradient-to-r from-card/40 to-card/60 border border-primary/20 shadow-lg animate-border-glow animate-float">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full"></div>
          <Sparkles className="h-8 w-8 text-primary relative animate-pulse" />
        </div>
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold font-outfit bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%] animate-[gradient_8s_linear_infinite] tracking-tight">
            Amethyst
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onHistoryClick}
          className="relative group hover:bg-primary/10 transition-all duration-300 hover-scale"
        >
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 blur transition-all duration-300 rounded-lg"></div>
          <History className="h-5 w-5 text-primary relative z-10" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onHelpClick}
          className="relative group hover:bg-primary/10 transition-all duration-300 hover-scale"
        >
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 blur transition-all duration-300 rounded-lg"></div>
          <HelpCircle className="h-5 w-5 text-primary relative z-10" />
        </Button>
      </div>
    </div>
  );
};