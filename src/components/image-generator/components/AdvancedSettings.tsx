import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface GenerationSettings {
  prompt: string;
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  seed?: number;
  num_outputs: number;
  aspect_ratio: string;
  output_format: 'webp' | 'jpg' | 'png';
  output_quality: number;
  prompt_strength: number;
  hf_loras: string[];
  lora_scales: number[];
  disable_safety_checker: boolean;
}

interface AdvancedSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
  disabled?: boolean;
}

const aspectRatios = [
  { value: "1:1", label: "Square (1024×1024)", description: "Perfect for profile pictures and social media posts" },
  { value: "16:9", label: "Widescreen (1024×576)", description: "Ideal for YouTube thumbnails and presentations" },
  { value: "3:2", label: "Standard (1024×683)", description: "Classic DSLR camera ratio" },
  { value: "2:3", label: "Portrait (683×1024)", description: "Vertical format for phone wallpapers" },
];

const outputFormats = [
  { value: "webp", label: "WebP (Recommended)" },
  { value: "png", label: "PNG" },
  { value: "jpg", label: "JPEG" },
];

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  settings,
  onSettingsChange,
  disabled = false
}) => {
  return (
    <Card className="p-6 space-y-6">
      {/* Aspect Ratio */}
      <div className="space-y-4">
        <Label>Aspect Ratio</Label>
        <Select
          value={settings.aspect_ratio}
          onValueChange={(value) => onSettingsChange({ aspect_ratio: value })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select aspect ratio" />
          </SelectTrigger>
          <SelectContent>
            {aspectRatios.map((ratio) => (
              <SelectItem key={ratio.value} value={ratio.value}>
                <div className="space-y-1">
                  <div className="font-medium">{ratio.label}</div>
                  <div className="text-sm text-muted-foreground">{ratio.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Number of Images */}
      <div className="space-y-4">
        <Label>Number of Images</Label>
        <Input
          type="number"
          min={1}
          max={4}
          value={settings.num_outputs}
          onChange={(e) => onSettingsChange({ num_outputs: parseInt(e.target.value) })}
          disabled={disabled}
        />
      </div>

      <Separator />

      {/* Prompt Strength */}
      <div className="space-y-4">
        <Label>Prompt Strength</Label>
        <Slider
          value={[settings.prompt_strength]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={([value]) => onSettingsChange({ prompt_strength: value })}
          disabled={disabled}
        />
        <div className="text-sm text-muted-foreground">
          {settings.prompt_strength.toFixed(1)}
        </div>
      </div>

      <Separator />

      {/* Output Format */}
      <div className="space-y-4">
        <Label>Output Format</Label>
        <Select
          value={settings.output_format}
          onValueChange={(value) => onSettingsChange({ output_format: value as 'webp' | 'jpg' | 'png' })}
          disabled={disabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select output format" />
          </SelectTrigger>
          <SelectContent>
            {outputFormats.map((format) => (
              <SelectItem key={format.value} value={format.value}>
                {format.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Output Quality */}
      <div className="space-y-4">
        <Label>Output Quality</Label>
        <Slider
          value={[settings.output_quality]}
          min={1}
          max={100}
          step={1}
          onValueChange={([value]) => onSettingsChange({ output_quality: value })}
          disabled={disabled}
        />
        <div className="text-sm text-muted-foreground">
          {settings.output_quality}%
        </div>
      </div>
    </Card>
  );
};