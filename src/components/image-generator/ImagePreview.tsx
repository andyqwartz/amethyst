import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Settings, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { GenerationSettings } from '@/types/replicate';

interface ImagePreviewProps {
  images: string[];
  onDownload: (imageUrl: string) => void;
  onTweak?: (settings: GenerationSettings) => void;
  onDelete?: (imageUrl: string) => void;
  settings?: GenerationSettings;
  className?: string;
}

export const ImagePreview = ({ 
  images, 
  onDownload, 
  onTweak,
  onDelete,
  settings,
  className = "" 
}: ImagePreviewProps) => {
  if (!images.length) {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {images.map((imageUrl, index) => (
        <div key={index} className="relative group">
          <img
            src={imageUrl}
            alt={`Generated image ${index + 1}`}
            className="w-full h-auto rounded-lg shadow-lg transition-all duration-300 hover:scale-[1.02]"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onDownload(imageUrl)}
              className="rounded-full bg-primary hover:bg-primary-hover shadow-lg transition-all duration-300 w-10 h-10"
            >
              <Download className="h-4 w-4 text-white" />
            </Button>
            {settings && onTweak && (
              <Button
                variant="secondary"
                size="icon"
                onClick={() => onTweak(settings)}
                className="rounded-full bg-primary hover:bg-primary-hover shadow-lg transition-all duration-300 w-10 h-10"
              >
                <Settings className="h-4 w-4 text-white" />
              </Button>
            )}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full bg-destructive hover:bg-destructive/90 shadow-lg transition-all duration-300 w-10 h-10"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer l'image</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(imageUrl)}>
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};