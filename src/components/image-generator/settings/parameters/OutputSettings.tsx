import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface OutputSettingsProps {
  numOutputs: number;
  aspectRatio: string;
  outputFormat: "webp" | "jpg" | "png";
  onNumOutputsChange: (value: number) => void;
  onAspectRatioChange: (value: string) => void;
  onOutputFormatChange: (value: "webp" | "jpg" | "png") => void;
}

export const OutputSettings = ({
  numOutputs,
  aspectRatio,
  outputFormat,
  onNumOutputsChange,
  onAspectRatioChange,
  onOutputFormatChange
}: OutputSettingsProps) => {
  const aspectRatios = [
    "1:1", "16:9", "21:9", "3:2", "2:3", "4:5", "5:4", "3:4", "4:3", "9:16", "9:21"
  ];

  return (
    <>
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          Number of Images
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span className="text-xs text-primary/50">(?)</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>Number of images to generate (1-4)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select
          value={numOutputs.toString()}
          onValueChange={(value) => onNumOutputsChange(parseInt(value))}
        >
          <SelectTrigger className="bg-popover border-primary/20">
            <SelectValue placeholder="Select number of images" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20">
            <SelectItem value="1">1 image</SelectItem>
            <SelectItem value="2">2 images</SelectItem>
            <SelectItem value="3">3 images</SelectItem>
            <SelectItem value="4">4 images</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <Select
          value={aspectRatio}
          onValueChange={onAspectRatioChange}
        >
          <SelectTrigger className="bg-popover border-primary/20">
            <SelectValue placeholder="Select aspect ratio" />
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

      <div className="space-y-2">
        <Label>Output Format</Label>
        <Select
          value={outputFormat}
          onValueChange={(value) => onOutputFormatChange(value as "webp" | "jpg" | "png")}
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
    </>
  );
};