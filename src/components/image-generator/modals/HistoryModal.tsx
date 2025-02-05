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
import { ScrollArea } from "@/components/ui/scroll-area";

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
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Historique des générations
            </DialogTitle>
            <DialogDescription className="text-lg">
              Retrouvez toutes vos images générées précédemment
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {images.map((image, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden hover-scale glass-card">
                  <img
                    src={image.url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end justify-center gap-2 p-4">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onDownload(image.url)}
                      className="hover:bg-primary/20"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => onTweak(image.settings)}
                      className="hover:bg-primary/20"
                    >
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};