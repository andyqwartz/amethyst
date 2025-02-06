import React from 'react';
import { BasicSettings } from './settings/BasicSettings';
import { OutputSettings } from './settings/OutputSettings';
import { LoraSettings } from './settings/LoraSettings';
import { ParameterInputs } from './ParameterInputs';
import type { ImageSettings } from '@/types/generation';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdvancedSettingsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  settings,
  onSettingsChange,
  isOpen,
  onToggle
}) => {
  return (
    <div className="w-full space-y-4">
      <Button
        variant="ghost"
        onClick={onToggle}
        className="w-full flex items-center justify-between hover:bg-[#D6BCFA]/10"
      >
        <span>Advanced Settings</span>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {isOpen && (
        <div className="space-y-6 p-6 bg-card/95 backdrop-blur-xl rounded-xl border border-[#D6BCFA]/10 shadow-xl">
          <BasicSettings settings={settings} onSettingsChange={onSettingsChange} />
          <ParameterInputs settings={settings} onSettingsChange={onSettingsChange} />
          <OutputSettings settings={settings} onSettingsChange={onSettingsChange} />
          <LoraSettings settings={settings} onSettingsChange={onSettingsChange} />
        </div>
      )}
    </div>
  );
};
