import React from 'react';
import { GuidanceScale } from './settings/parameters/GuidanceScale';
import { Steps } from './settings/parameters/Steps';
import { OutputSettings } from './settings/parameters/OutputSettings';
import type { GenerationSettings } from '@/types/replicate';

interface ParameterInputsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const ParameterInputs = ({ settings, onSettingsChange }: ParameterInputsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GuidanceScale
          value={settings.guidanceScale}
          onChange={(value) => onSettingsChange({ guidanceScale: value })}
        />
        <Steps
          value={settings.steps}
          onChange={(value) => onSettingsChange({ steps: value })}
        />
        <OutputSettings
          numOutputs={settings.numOutputs}
          aspectRatio={settings.aspectRatio}
          outputFormat={settings.outputFormat}
          onNumOutputsChange={(value) => onSettingsChange({ numOutputs: value })}
          onAspectRatioChange={(value) => onSettingsChange({ aspectRatio: value })}
          onOutputFormatChange={(value) => onSettingsChange({ outputFormat: value })}
        />
      </div>
    </div>
  );
};