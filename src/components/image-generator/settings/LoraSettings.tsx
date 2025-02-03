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
    const updatedLoras = [...settings.hf_loras];
    updatedLoras[index] = value;
    onSettingsChange({ hf_loras: updatedLoras });
  };

  const handleLoraScaleChange = (index: number, value: number) => {
    const updatedScales = [...settings.lora_scales];
    updatedScales[index] = value;
    onSettingsChange({ lora_scales: updatedScales });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">LoRA Settings</h3>
      {settings.hf_loras.map((lora, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            type="text"
            value={lora}
            onChange={(e) => handleLoraChange(index, e.target.value)}
            disabled={disabled}
            className="border rounded p-2"
            placeholder="LoRA model path"
          />
          <input
            type="number"
            value={settings.lora_scales[index] || 1}
            onChange={(e) => handleLoraScaleChange(index, parseFloat(e.target.value))}
            disabled={disabled}
            className="border rounded p-2 w-20"
            placeholder="Scale"
            min={0}
            step={0.1}
          />
        </div>
      ))}
      <button
        onClick={() => onSettingsChange({ hf_loras: [...settings.hf_loras, ''], lora_scales: [...settings.lora_scales, 1] })}
        disabled={disabled}
        className="mt-2 bg-blue-500 text-white rounded p-2"
      >
        Add LoRA
      </button>
    </div>
  );
};
