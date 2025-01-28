import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";

const aspectRatios = [
  { ratio: "1:1", description: "Square format (1024x1024px) - Perfect for profile pictures and social media posts" },
  { ratio: "16:9", description: "Widescreen (1024x576px) - Ideal for YouTube thumbnails and presentations" },
  { ratio: "21:9", description: "Ultra-wide (1024x439px) - Cinematic format for movie scenes and landscapes" },
  { ratio: "3:2", description: "Standard photo (1024x683px) - Classic DSLR camera ratio" },
  { ratio: "2:3", description: "Portrait (683x1024px) - Vertical format for phone wallpapers" },
  { ratio: "4:5", description: "Instagram portrait (819x1024px) - Optimized for Instagram posts" },
  { ratio: "5:4", description: "Large format (1024x819px) - Common for printed photographs" },
  { ratio: "3:4", description: "Classic portrait (768x1024px) - Traditional portrait photography" },
  { ratio: "4:3", description: "Standard screen (1024x768px) - Classic monitor aspect ratio" },
  { ratio: "9:16", description: "Mobile (576x1024px) - Perfect for Stories and TikTok" },
  { ratio: "9:21", description: "Vertical panorama (439x1024px) - Tall architectural shots" }
];

interface AspectRatioSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const AspectRatioSelect = ({ value, onChange }: AspectRatioSelectProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-white">
          Format
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-white/50 hover:text-white/70 transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="right" className="max-w-[200px]">
                <p className="text-sm">Choose the dimensions for your generated image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger 
          className="w-full bg-popover/50 backdrop-blur-sm border-primary/20 text-white hover:bg-popover/70 transition-colors"
        >
          <SelectValue placeholder="Select aspect ratio" />
        </SelectTrigger>
        <SelectContent className="bg-popover/95 backdrop-blur-xl border-primary/20">
          <ScrollArea className="h-[300px] pr-4">
            {aspectRatios.map(({ ratio, description }) => (
              <SelectItem
                key={ratio}
                value={ratio}
                className="flex flex-col items-start space-y-1.5 py-3 cursor-pointer hover:bg-primary/10 transition-colors rounded-md px-2 my-1"
              >
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 border border-primary/30 rounded-md overflow-hidden">
                    <div 
                      className="absolute inset-1 bg-primary/20 rounded"
                      style={{
                        aspectRatio: ratio.split(':').join('/'),
                      }}
                    />
                  </div>
                  <span className="font-medium text-white">{ratio}</span>
                </div>
                <span className="text-xs text-white/70 leading-relaxed">{description}</span>
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </div>
  );
};