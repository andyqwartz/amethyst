import React from 'react';
import { AspectRatioSelect } from './basic/AspectRatioSelect';
import { StrengthSlider } from './basic/StrengthSlider';
import type { GenerationSettings } from '@/types/replicate';

interface BasicSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const BasicSettings = ({ settings, onSettingsChange }: BasicSettingsProps) => {
  React.useEffect(() => {
    if (!settings.aspect_ratio) {
      onSettingsChange({
        aspect_ratio: "1:1",
        num_inference_steps: 28,
        guidance_scale: 7.5,
        prompt_strength: 0.8,
        output_format: "webp",
        output_quality: 90,
        hf_loras: ["stabilityai/sd-vae-ft-mse"],
        lora_scales: [0.8]
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      <AspectRatioSelect
        value={settings.aspect_ratio}
        onChange={(value) => onSettingsChange({ aspect_ratio: value })}
      />

      <div className="space-y-6 md:space-y-4">
        <StrengthSlider
          value={settings.prompt_strength}
          onChange={(value) => onSettingsChange({ prompt_strength: value })}
          label="Prompt Strength"
          tooltip="Controls the influence of the prompt on the final image"
          max={1}
          min={0}
          step={0.1}
        />

        <StrengthSlider
          value={settings.num_inference_steps}
          onChange={(value) => onSettingsChange({ num_inference_steps: value })}
          label="Steps"
          tooltip="Number of inference steps (higher = more detail but slower)"
          max={50}
          min={10}
          step={1}
        />
      </div>
    </div>
  );
};