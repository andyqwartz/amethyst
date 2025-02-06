import React, { useEffect } from 'react';
import type { ImageSettings } from '@/types/generation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus } from 'lucide-react';

export interface LoraSettingsProps {
  settings: ImageSettings;
  onSettingsChange: (settings: Partial<ImageSettings>) => void;
  disabled?: boolean;
}

const DEFAULT_LORA = 'AndyVampiro/fog';
const DEFAULT_SCALE = 1.0;

export const LoraSettings: React.FC<LoraSettingsProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  // Initialize default LoRAs if needed
  useEffect(() => {
    if (!settings.hf_loras || settings.hf_loras.length === 0) {
      onSettingsChange({
        hf_loras: [DEFAULT_LORA],
        lora_scales: [DEFAULT_SCALE]
      });
    }
  }, []);

  const handleAddLora = () => {
    const currentLoras = settings.hf_loras || [];
    const currentScales = settings.lora_scales || [];

    onSettingsChange({
      hf_loras: [...currentLoras, ''],
      lora_scales: [...currentScales, DEFAULT_SCALE]
    });
  };

  const handleLoraChange = (index: number, value: string) => {
    if (!value.trim()) return;
    
    const currentLoras = [...(settings.hf_loras || [])];
    currentLoras[index] = value.trim();
    onSettingsChange({ hf_loras: currentLoras });
  };

  const handleLoraScaleChange = (index: number, value: number) => {
    const currentScales = [...(settings.lora_scales || [])];
    currentScales[index] = value;
    onSettingsChange({ lora_scales: currentScales });
  };

  const handleRemoveLora = (index: number) => {
    if (index === 0) return; // Don't remove the first LoRA
    
    const currentLoras = [...(settings.hf_loras || [])];
    const currentScales = [...(settings.lora_scales || [])];
    
    currentLoras.splice(index, 1);
    currentScales.splice(index, 1);
    
    onSettingsChange({
      hf_loras: currentLoras,
      lora_scales: currentScales
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-lg font-semibold">LoRA Settings</Label>
        <Button
          type="button"
          onClick={handleAddLora}
          disabled={disabled}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add LoRA
        </Button>
      </div>

      <div className="space-y-4">
        {(settings.hf_loras || []).map((lora, index) => (
          <div key={index} className="flex items-center gap-3 group">
            <div className="flex-1">
              <Input
                type="text"
                value={lora}
                onChange={(e) => handleLoraChange(index, e.target.value)}
                disabled={disabled || index === 0}
                placeholder="LoRA model path"
                className="w-full"
              />
            </div>
            <div className="w-24">
              <Input
                type="number"
                value={settings.lora_scales?.[index] || DEFAULT_SCALE}
                onChange={(e) => handleLoraScaleChange(index, parseFloat(e.target.value))}
                disabled={disabled}
                min={0}
                max={2}
                step={0.1}
                className="w-full text-center"
              />
            </div>
            {index > 0 && (
              <Button
                type="button"
                onClick={() => handleRemoveLora(index)}
                disabled={disabled}
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        <p>Tips:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Scale values between 0.1 and 2.0</li>
          <li>Combine multiple LoRAs for unique results</li>
          <li>The default LoRA cannot be removed</li>
        </ul>
      </div>
    </div>
  );
};
