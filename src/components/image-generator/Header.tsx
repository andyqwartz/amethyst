import React from 'react';
import { Button } from "@/components/ui/button";
import { History, Settings, HelpCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

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
    <div className="bg-primary/5 p-4 rounded-xl flex justify-between items-center mb-4 glass-card">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Amethyst
      </h1>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onHistoryClick}
          className="hover:bg-primary/10"
        >
          <History className="h-5 w-5 text-primary" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSettingsClick}
          className="hover:bg-primary/10"
        >
          <Settings className="h-5 w-5 text-primary" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onHelpClick}
          className="hover:bg-primary/10"
        >
          <HelpCircle className="h-5 w-5 text-primary" />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  );
};