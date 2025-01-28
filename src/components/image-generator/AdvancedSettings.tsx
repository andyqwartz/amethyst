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
      <BasicSettings settings={settings} onSettingsChange={onSettingsChange} />
      <OutputSettings settings={settings} onSettingsChange={onSettingsChange} />
      <LoraSettings settings={settings} onSettingsChange={onSettingsChange} />
    </div>
  );
};