import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';

interface OutputSettingsProps {
  aspectRatio: string;
  outputFormat: "webp" | "jpg" | "png";
  onAspectRatioChange: (value: string) => void;
  onOutputFormatChange: (value: "webp" | "jpg" | "png") => void;
}

export const OutputSettings = ({
  aspectRatio,
  outputFormat,
  onAspectRatioChange,
  onOutputFormatChange
}: OutputSettingsProps) => {
  const aspectRatios = [
    "1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Format de sortie
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Format des images générées</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select
          value={outputFormat}
          onValueChange={onOutputFormatChange}
        >
          <SelectTrigger className="bg-popover border-primary/20">
            <SelectValue placeholder="Sélectionner le format" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20">
            <SelectItem value="webp">WebP</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="png">PNG</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Ratio d'aspect
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Ratio d'aspect des images générées</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select
          value={aspectRatio}
          onValueChange={onAspectRatioChange}
        >
          <SelectTrigger className="bg-popover border-primary/20">
            <SelectValue placeholder="Sélectionner le ratio" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20">
            {aspectRatios.map((ratio) => (
              <SelectItem key={ratio} value={ratio}>
                {ratio}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};