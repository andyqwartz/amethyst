import React from 'react';
import { BasicSettings } from './settings/BasicSettings';
import { OutputSettings } from './settings/OutputSettings';
import { LoraSettings } from './settings/LoraSettings';
import { ParameterInputs } from './ParameterInputs';
import type { GenerationSettings } from '@/types/replicate';

interface AdvancedSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const AdvancedSettings = ({ settings, onSettingsChange }: AdvancedSettingsProps) => {
  console.log('AdvancedSettings - settings:', settings);
  
  return (
    <div className="space-y-12 p-8 bg-card/95 backdrop-blur-xl rounded-xl border border-primary/10 shadow-xl">
      <div className="space-y-10">
        <BasicSettings settings={settings} onSettingsChange={onSettingsChange} />
        <ParameterInputs settings={settings} onSettingsChange={onSettingsChange} />
        <OutputSettings settings={settings} onSettingsChange={onSettingsChange} />
        <LoraSettings settings={settings} onSettingsChange={onSettingsChange} />
      </div>
    </div>
  );
};