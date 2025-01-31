import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';

const FormatSelector = ({ disabled = false }) => {
  const { settings, updateSettings } = useImageGeneratorStore();
  
  return (
    <div className="space-y-4">
      <Label>Format</Label>
      <Select
        value={settings.output_format}
        onValueChange={(value) => updateSettings({ output_format: value })}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select output format" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="webp">WebP</SelectItem>
          <SelectItem value="png">PNG</SelectItem>
          <SelectItem value="jpg">JPEG</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const OutputCountSelector = ({ disabled = false }) => {
  const { settings, updateSettings } = useImageGeneratorStore();
  
  return (
    <div className="space-y-4">
      <Label>Number of Images</Label>
      <Input
        type="number"
        min={1}
        max={4}
        value={settings.num_outputs}
        onChange={(e) => updateSettings({ num_outputs: parseInt(e.target.value) })}
        disabled={disabled}
      />
    </div>
  );
};

const PromptStrengthSelector = ({ disabled = false }) => {
  const { settings, updateSettings } = useImageGeneratorStore();
  
  return (
    <div className="space-y-4">
      <Label>Prompt Strength</Label>
      <Slider
        value={[settings.prompt_strength]}
        min={0}
        max={1}
        step={0.1}
        onValueChange={([value]) => updateSettings({ prompt_strength: value })}
        disabled={disabled}
      />
      <div className="text-sm text-muted-foreground">
        {settings.prompt_strength.toFixed(1)}
      </div>
    </div>
  );
};

const QualitySelector = ({ disabled = false }) => {
  const { settings, updateSettings } = useImageGeneratorStore();
  
  return (
    <div className="space-y-4">
      <Label>Output Quality</Label>
      <Slider
        value={[settings.output_quality]}
        min={1}
        max={100}
        step={1}
        onValueChange={([value]) => updateSettings({ output_quality: value })}
        disabled={disabled}
      />
      <div className="text-sm text-muted-foreground">
        {settings.output_quality}%
      </div>
    </div>
  );
};

interface AdvancedSettingsProps {
  disabled?: boolean;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  disabled = false
}) => {
  return (
    <Card className="p-6 space-y-6">
      <FormatSelector disabled={disabled} />
      <Separator />
      <OutputCountSelector disabled={disabled} />
      <Separator />
      <PromptStrengthSelector disabled={disabled} />
      <Separator />
      <QualitySelector disabled={disabled} />
    </Card>
  );
};
