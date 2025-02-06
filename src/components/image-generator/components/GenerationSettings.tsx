
import React from 'react';
import { useGenerationSettings } from '../hooks/useGenerationSettings';
import type { ImageSettings } from '@/types/generation';

interface GenerationSettingsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
}

export const GenerationSettings: React.FC<GenerationSettingsProps> = ({
  settings,
  onSettingsChange
}) => {
  const handleNumberInput = (
    value: string,
    field: keyof ImageSettings,
    min?: number,
    max?: number
  ) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      if (min !== undefined && num < min) return;
      if (max !== undefined && num > max) return;
      onSettingsChange({ [field]: num });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Negative Prompt
        </label>
        <textarea
          value={settings.negative_prompt}
          onChange={(e) => onSettingsChange({ negative_prompt: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Width
          </label>
          <input
            type="number"
            value={settings.width}
            onChange={(e) => handleNumberInput(e.target.value, 'width', 64, 2048)}
            min={64}
            max={2048}
            step={64}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Height
          </label>
          <input
            type="number"
            value={settings.height}
            onChange={(e) => handleNumberInput(e.target.value, 'height', 64, 2048)}
            min={64}
            max={2048}
            step={64}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Inference Steps
        </label>
        <input
          type="number"
          value={settings.num_inference_steps}
          onChange={(e) => handleNumberInput(e.target.value, 'num_inference_steps', 1, 150)}
          min={1}
          max={150}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Guidance Scale
        </label>
        <input
          type="number"
          value={settings.guidance_scale}
          onChange={(e) => handleNumberInput(e.target.value, 'guidance_scale', 1, 20)}
          min={1}
          max={20}
          step={0.1}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Seed
        </label>
        <input
          type="number"
          value={settings.seed}
          onChange={(e) => handleNumberInput(e.target.value, 'seed')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Use -1 for random seed
        </p>
      </div>
    </div>
  );
};
