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
      <div 
        className="flex items-center gap-4 group hover:scale-105 transition-transform duration-300 cursor-pointer"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl animate-float rounded-full group-hover:bg-primary/40 transition-all duration-300"></div>
          <Sparkles className="h-12 w-12 text-primary relative animate-float group-hover:text-primary-hover transition-colors duration-300" />
        </div>
        <h1 
          className="text-5xl font-bold font-outfit bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent bg-[length:200%] animate-float tracking-tight relative group-hover:scale-105 transition-transform duration-300"
        >
          {/* Crystalline effect overlay */}
          <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[length:200%] animate-[gradient_3s_linear_infinite] blur-sm"></span>
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