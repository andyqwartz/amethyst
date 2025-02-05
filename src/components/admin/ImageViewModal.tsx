import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  User,
  Clock,
  Image as ImageIcon,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { GeneratedImage, ImageMetadata, Profile } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ImageViewModalProps {
  image?: GeneratedImage & { metadata?: ImageMetadata; user?: Profile };
  isOpen: boolean;
  onClose: () => void;
  onDownload: (image: GeneratedImage) => Promise<void>;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({
  image,
  isOpen,
  onClose,
  onDownload,
}) => {
  if (!image) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl bg-[#1A1D27] border-white/10 text-white"
        aria-describedby="image-details-description"
      >
        <DialogHeader>
          <DialogTitle>Détails de l'image</DialogTitle>
          <DialogDescription id="image-details-description" className="sr-only">
            Détails et paramètres de l'image générée
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="relative aspect-square bg-black/20 rounded-lg overflow-hidden">
            {image.output_url ? (
              <img
                src={image.output_url}
                alt={image.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-white/20" />
              </div>
            )}
          </div>

          {/* Image Details */}
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center gap-3">
              {image.user?.avatar_url ? (
                <img
                  src={image.user.avatar_url}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-white/50" />
                </div>
              )}
              <div>
                <div className="font-medium">{image.user?.full_name || 'Utilisateur inconnu'}</div>
                <div className="text-sm text-white/50">
                  {formatDistanceToNow(new Date(image.created_at), { locale: fr, addSuffix: true })}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="text-sm text-white/50 mb-2">Statut</div>
              <Badge
                variant={
                  image.status === 'completed' ? 'default' :
                  image.status === 'failed' ? 'destructive' :
                  'secondary'
                }
              >
                {image.status === 'completed' ? 'Terminé' :
                 image.status === 'failed' ? 'Échec' :
                 'En cours'}
              </Badge>
              {image.error_message && (
                <p className="mt-2 text-sm text-red-500">{image.error_message}</p>
              )}
            </div>

            {/* Prompt */}
            <div>
              <div className="text-sm text-white/50 mb-2">Prompt</div>
              <p className="text-sm">{image.prompt}</p>
              {image.negative_prompt && (
                <>
                  <div className="text-sm text-white/50 mt-4 mb-2">Prompt négatif</div>
                  <p className="text-sm">{image.negative_prompt}</p>
                </>
              )}
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-white/50 mb-1">Dimensions</div>
                <div>{image.width}x{image.height}</div>
              </div>
              <div>
                <div className="text-white/50 mb-1">Format</div>
                <div>{image.output_format.toUpperCase()}</div>
              </div>
              <div>
                <div className="text-white/50 mb-1">Modèle</div>
                <div>{image.model_id || 'SDXL 1.0'}</div>
              </div>
              <div>
                <div className="text-white/50 mb-1">Temps</div>
                <div>{image.processing_time ? `${Math.round(image.processing_time)}s` : 'N/A'}</div>
              </div>
              <div>
                <div className="text-white/50 mb-1">Steps</div>
                <div>{image.num_inference_steps}</div>
              </div>
              <div>
                <div className="text-white/50 mb-1">Guidance Scale</div>
                <div>{image.guidance_scale}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onDownload(image)}
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageViewModal;
