import React from 'react';
import type { GenerationSettings } from '@/types/replicate';

export interface LoraSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  disabled?: boolean;
}

export const LoraSettings: React.FC<LoraSettingsProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          LoRA Models
        </label>
        <input
          type="text"
          value={settings.hf_loras.join(', ')}
          onChange={(e) => onSettingsChange({ hf_loras: e.target.value.split(',').map(item => item.trim()) })}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          LoRA Scales
        </label>
        <input
          type="text"
          value={settings.lora_scales.join(', ')}
          onChange={(e) => onSettingsChange({ lora_scales: e.target.value.split(',').map(item => parseFloat(item.trim())) })}
          disabled={disabled}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};
