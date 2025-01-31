import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { HelpCircle, Image as ImageIcon } from 'lucide-react';

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
        <Label className="flex items-center gap-2 text-violet-100">
          Format de sortie
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-violet-300" />
              </TooltipTrigger>
              <TooltipContent className="bg-violet-950 border-violet-800">
                <p className="text-violet-100">Choisissez le format d'export pour vos images générées</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select
          value={outputFormat}
          onValueChange={onOutputFormatChange}
        >
          <SelectTrigger className="bg-popover/50 border-violet-800/50 hover:border-violet-700">
            <SelectValue placeholder="Sélectionner le format">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-violet-950 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-5 w-5 text-violet-200" />
                </div>
                <span className="text-violet-100 font-semibold">{outputFormat.toUpperCase()}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20">
            <SelectItem value="webp" className="flex items-center gap-2 py-3">
              <div className="flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-950 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-violet-200" />
                  </div>
                  <span className="font-semibold text-violet-100">WebP</span>
                </div>
                <span className="text-sm text-violet-200">Compression optimale pour le web</span>
              </div>
            </SelectItem>
            <SelectItem value="jpg" className="flex items-center gap-2 py-3">
              <div className="flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-950 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-violet-200" />
                  </div>
                  <span className="font-semibold text-violet-100">JPG</span>
                </div>
                <span className="text-sm text-violet-200">Format universel compatible</span>
              </div>
            </SelectItem>
            <SelectItem value="png" className="flex items-center gap-2 py-3">
              <div className="flex items-center justify-between w-full text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-violet-950 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-5 w-5 text-violet-200" />
                  </div>
                  <span className="font-semibold text-violet-100">PNG</span>
                </div>
                <span className="text-sm text-violet-200">Haute qualité sans perte</span>
              </div>
            </SelectItem>
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
                <p className="text-white">Ratio d'aspect des images générées</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
        <Select
          value={aspectRatio}
          onValueChange={onAspectRatioChange}
        >
          <SelectTrigger className="bg-popover/50 border-violet-800/50 hover:border-violet-700">
            <SelectValue placeholder="Sélectionner le ratio">
              {aspectRatio && (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-6 bg-violet-950 rounded flex items-center justify-center border border-violet-800">
                    <span className="text-violet-200 text-sm">{aspectRatio}</span>
                  </div>
                  <span className="text-violet-100 font-medium">
                    {aspectRatio.split(':').reduce((a, b) => Number(a) > Number(b) ? 'Paysage' : Number(a) < Number(b) ? 'Portrait' : 'Carré')}
                  </span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-popover border-primary/20">
            {aspectRatios.map((ratio) => {
              const [width, height] = ratio.split(':').map(Number);
              const previewWidth = 60;
              const previewHeight = (height * previewWidth) / width;
              
              return (
                <SelectItem key={ratio} value={ratio} className="flex items-center gap-2 py-2">
                  <div className="flex items-center gap-4 text-white w-full">
                    <div className="flex items-center gap-3">
                      <div 
                        className="bg-violet-950/50 rounded-sm border border-violet-800"
                        style={{
                          width: `${previewWidth}px`,
                          height: `${previewHeight}px`,
                        }}
                      />
                      <span className="font-medium text-violet-100">{ratio}</span>
                    </div>
                    <span className="text-sm text-violet-200">
                      {width > height ? 'Paysage' : width < height ? 'Portrait' : 'Carré'}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
