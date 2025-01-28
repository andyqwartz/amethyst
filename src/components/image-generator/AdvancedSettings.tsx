import React from 'react';
import { BasicSettings } from './settings/BasicSettings';
import { OutputSettings } from './settings/OutputSettings';
import { LoraSettings } from './settings/LoraSettings';
import type { GenerationSettings } from '@/types/replicate';

interface AdvancedSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const AdvancedSettings = ({ settings, onSettingsChange }: AdvancedSettingsProps) => {
  return (
    <div className="space-y-6 p-6 bg-card/95 backdrop-blur-xl rounded-xl border border-primary/10 shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BasicSettings settings={settings} onSettingsChange={onSettingsChange} />
        <OutputSettings settings={settings} onSettingsChange={onSettingsChange} />
      </div>
      <LoraSettings settings={settings} onSettingsChange={onSettingsChange} />
    </div>
  );
};