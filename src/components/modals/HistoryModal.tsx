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
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Historique des générations
          </DialogTitle>
          <DialogDescription className="text-primary/70">
            Retrouvez toutes vos images générées précédemment
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image.url}
                alt={`Generated image ${index + 1}`}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onDownload(image.url)}
                  className="hover-scale"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => onTweak(image.settings)}
                  className="hover-scale"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-2 text-center py-8 text-primary/70">
              Aucune image générée pour le moment
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};