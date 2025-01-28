import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

export const Header = ({
  onSettingsClick,
  onHelpClick
}: HeaderProps) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="relative flex justify-center items-center mb-4">
      {/* Logo and Name */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full"></div>
          <Sparkles className="h-8 w-8 text-primary relative animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold font-outfit bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%] animate-[gradient_8s_linear_infinite] tracking-tight">
          Amethyst
        </h1>
      </div>
      
      {/* Floating Help Button */}
      <div 
        className="fixed top-4 right-4 z-50 transition-opacity duration-300"
        onMouseEnter={() => setShowHelp(true)}
        onMouseLeave={() => setShowHelp(false)}
        style={{ opacity: showHelp ? 1 : 0.2 }}
      >
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