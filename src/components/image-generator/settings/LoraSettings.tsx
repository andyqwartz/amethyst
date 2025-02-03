import React from 'react';
import type { GenerationSettings } from '@/types/replicate';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from 'lucide-react';

export interface LoraSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const LoraSettings: React.FC<LoraSettingsProps> = ({ settings, onSettingsChange }) => {
  const handleAddLora = () => {
    const newLoras = [...(settings.hf_loras || []), ''];
    const newScales = [...(settings.lora_scales || []), 0.8];
    onSettingsChange({
      hf_loras: newLoras,
      lora_scales: newScales
    });
  };

  const handleRemoveLora = (index: number) => {
    const newLoras = settings.hf_loras?.filter((_, i) => i !== index) || [];
    const newScales = settings.lora_scales?.filter((_, i) => i !== index) || [];
    onSettingsChange({
      hf_loras: newLoras,
      lora_scales: newScales
    });
  };

  const handleLoraChange = (index: number, value: string) => {
    const newLoras = [...(settings.hf_loras || [])];
    newLoras[index] = value;
    onSettingsChange({ hf_loras: newLoras });
  };

  const handleScaleChange = (index: number, value: string) => {
    const newScales = [...(settings.lora_scales || [])];
    newScales[index] = parseFloat(value) || 0;
    onSettingsChange({ lora_scales: newScales });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">LoRA Settings</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddLora}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add LoRA
        </Button>
      </div>

      {settings.hf_loras?.map((lora, index) => (
        <div key={index} className="grid grid-cols-[1fr,100px,40px] gap-2 items-end">
          <div className="space-y-2">
            <Label>LoRA {index + 1}</Label>
            <Input
              value={lora}
              onChange={(e) => handleLoraChange(index, e.target.value)}
              placeholder="Enter LoRA path"
            />
          </div>
          <div className="space-y-2">
            <Label>Scale</Label>
            <Input
              type="number"
              value={settings.lora_scales?.[index] || 0.8}
              onChange={(e) => handleScaleChange(index, e.target.value)}
              min={0}
              max={2}
              step={0.1}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveLora(index)}
            className="mb-[2px]"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};