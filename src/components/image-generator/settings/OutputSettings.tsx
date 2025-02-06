import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import type { GenerationSettings } from '@/types/replicate';

interface OutputSettingsProps {
  settings: GenerationSettings;
  onSettingsChange: (settings: Partial<GenerationSettings>) => void;
}

export const OutputSettings = ({ settings, onSettingsChange }: OutputSettingsProps) => {
  const renderTooltip = (description: string) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="ml-2">
          <HelpCircle className="h-4 w-4 text-primary/50" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center">
          Seed {renderTooltip("Random seed for reproducible generation")}
        </Label>
        <Input
          type="number"
          value={settings.seed || ''}
          onChange={(e) => onSettingsChange({ seed: parseInt(e.target.value) || undefined })}
          placeholder="Random seed"
          className="bg-popover border-primary/20"
        />
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          Output Format {renderTooltip("Format of the output images")}
        </Label>
        <Select
          value={settings.output_format}
          onValueChange={(value) => onSettingsChange({ output_format: value as 'webp' | 'jpg' | 'png' })}
        >
          <SelectTrigger className="bg-popover border-primary/20">
            <SelectValue placeholder="Select format" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20">
            <SelectItem value="webp">WebP</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          Output Quality {renderTooltip("Quality when saving the output images (0-100)")}
        </Label>
        <Slider
          value={[settings.output_quality]}
          onValueChange={([value]) => onSettingsChange({ output_quality: value })}
          max={100}
          min={0}
          step={1}
          className="[&_[role=slider]]:bg-primary"
        />
        <span className="text-xs text-primary/50">{settings.output_quality}</span>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center">
          Safety Checker {renderTooltip("Enable/disable safety checker for generated images")}
        </Label>
        <div className="flex items-center space-x-2">
          <Switch
            checked={!settings.disable_safety_checker}
            onCheckedChange={(checked) => onSettingsChange({ disable_safety_checker: !checked })}
          />
          <span className="text-sm text-primary/70">
            {settings.disable_safety_checker ? 'Disabled' : 'Enabled'}
          </span>
        </div>
      </div>
    </div>
  );
};