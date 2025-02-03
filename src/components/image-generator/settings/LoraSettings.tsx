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
  const handleLoraChange = (index: number, value: string) => {
    const newLoras = [...settings.hf_loras];
    newLoras[index] = value;
    onSettingsChange({ hf_loras: newLoras });
  };

  const handleLoraScaleChange = (index: number, value: number) => {
    const newScales = [...settings.lora_scales];
    newScales[index] = value;
    onSettingsChange({ lora_scales: newScales });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">LoRA Settings</h3>
      {settings.hf_loras.map((lora, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={lora}
            onChange={(e) => handleLoraChange(index, e.target.value)}
            disabled={disabled}
            className="border rounded p-1"
            placeholder="LoRA model path"
          />
          <input
            type="number"
            value={settings.lora_scales[index] || 0}
            onChange={(e) => handleLoraScaleChange(index, parseFloat(e.target.value))}
            disabled={disabled}
            className="border rounded p-1 w-16"
            placeholder="Scale"
          />
        </div>
      ))}
      <button
        onClick={() => onSettingsChange({ hf_loras: [...settings.hf_loras, ''], lora_scales: [...settings.lora_scales, 0] })}
        disabled={disabled}
        className="mt-2 bg-blue-500 text-white rounded p-1"
      >
        Add LoRA
      </button>
    </div>
  );
};
