import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings2, HelpCircle, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  onHelpClick: () => void;
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onHelpClick,
  onSettingsClick,
}) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold">Amethyst AI</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button variant="ghost" size="icon" onClick={onHelpClick}>
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onSettingsClick}>
          <Settings2 className="h-5 w-5" />
        </Button>
        <Link to="/profile">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  );
}; 