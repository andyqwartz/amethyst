import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Wand2 } from "lucide-react";
import type { GenerationSettings } from '@/types/replicate';

interface HistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: { url: string; settings: GenerationSettings }[];
  onDownload: (imageUrl: string) => void;
  onTweak: (settings: GenerationSettings) => void;
}

export const HistoryModal = ({ 
  open, 
  onOpenChange, 
  images,
  onDownload,
  onTweak 
}: HistoryModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none m-0 p-6 backdrop-blur-xl bg-black/30">
        <div className="max-w-[90vw] mx-auto h-full flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Historique des générations
            </DialogTitle>
            <DialogDescription className="text-lg">
              Retrouvez toutes vos images générées précédemment
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 overflow-y-auto flex-grow">
            {images.map((image, index) => (
              <div key={`${image.url}-${index}`} className="relative group rounded-lg overflow-hidden hover-scale glass-card">
                <img
                  src={image.url}
                  alt={`Generated image ${index + 1}`}
                  className="w-full h-full object-cover aspect-square rounded-lg transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-4 gap-4">
                  <div className="text-xs text-white/80 space-y-1">
                    <p className="font-medium truncate">Prompt: {image.settings.prompt}</p>
                    {image.settings.negativePrompt && (
                      <p className="truncate">Negative: {image.settings.negativePrompt}</p>
                    )}
                    <p>Steps: {image.settings.steps} | Scale: {image.settings.guidanceScale}</p>
                    <p>Size: {image.settings.aspectRatio} | Seed: {image.settings.seed || 'Random'}</p>
                    {image.settings.hfLoras && image.settings.hfLoras.length > 0 && (
                      <p className="truncate">LoRAs: {image.settings.hfLoras.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onDownload(image.url)}
                      className="bg-primary/20 hover:bg-primary/30 rounded-full"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onTweak(image.settings)}
                      className="bg-primary/20 hover:bg-primary/30 rounded-full"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};