import React from 'react';
import { useGenerationSettings } from '../hooks/useGenerationSettings';

export const GenerationSettings: React.FC = () => {
  const {
    settings,
    updateNegativePrompt,
    updateDimensions,
    updateNumInferenceSteps,
    updateGuidanceScale,
    updateSeed,
    resetSettings,
  } = useGenerationSettings();

  const handleNumberInput = (
    value: string,
    updateFn: (num: number) => void,
    min?: number,
    max?: number
  ) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      if (min !== undefined && num < min) return;
      if (max !== undefined && num > max) return;
      updateFn(num);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Generation Settings</h2>
        <button
          onClick={resetSettings}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-100"
        >
          Reset to Defaults
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Negative Prompt
          </label>
          <textarea
            value={settings.negativePrompt}
            onChange={(e) => updateNegativePrompt(e.target.value)}
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
              onChange={(e) =>
                handleNumberInput(e.target.value, (width) =>
                  updateDimensions(width, settings.height)
                )
              }
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
              onChange={(e) =>
                handleNumberInput(e.target.value, (height) =>
                  updateDimensions(settings.width, height)
                )
              }
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
            value={settings.numInferenceSteps}
            onChange={(e) =>
              handleNumberInput(e.target.value, updateNumInferenceSteps, 1, 150)
            }
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
            value={settings.guidanceScale}
            onChange={(e) =>
              handleNumberInput(e.target.value, updateGuidanceScale, 1, 20)
            }
            min={1}
            max={20}
            step={0.1}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Seed</label>
          <input
            type="number"
            value={settings.seed}
            onChange={(e) => handleNumberInput(e.target.value, updateSeed)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Use -1 for random seed
          </p>
        </div>
      </div>
    </div>
  );
};