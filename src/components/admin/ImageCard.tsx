import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  Trash2,
  User,
  Clock,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { GeneratedImage, ImageMetadata, Profile } from '@/types/database';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ImageCardProps {
  image: GeneratedImage & { metadata?: ImageMetadata; user?: Profile };
  onView: (image: GeneratedImage & { metadata?: ImageMetadata; user?: Profile }) => void;
  onDelete: (id: string) => Promise<void>;
  onDownload: (image: GeneratedImage) => Promise<void>;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onView,
  onDelete,
  onDownload,
}) => {
  return (
    <Card className="bg-[#1A1D27] border-white/10 overflow-hidden">
      {/* Image Preview */}
      <div 
        className="relative aspect-square bg-black/20 cursor-pointer"
        onClick={() => onView(image)}
      >
        {image.output_url ? (
          <img
            src={image.output_url}
            alt={image.prompt}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-white/20" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
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
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {image.user?.avatar_url ? (
              <img
                src={image.user.avatar_url}
                alt=""
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-4 w-4 text-white/50" />
              </div>
            )}
            <div>
              <div className="font-medium">{image.user?.full_name || 'Utilisateur inconnu'}</div>
              <div className="text-sm text-white/50">
                {formatDistanceToNow(new Date(image.created_at), { locale: fr, addSuffix: true })}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white/70 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#1A1D27] border-white/10">
              <DropdownMenuItem
                onClick={() => onView(image)}
                className="text-white hover:bg-white/10"
              >
                <Eye className="h-4 w-4 mr-2" />
                Voir
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDownload(image)}
                className="text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(image.id)}
                className="text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Prompt */}
        <div className="space-y-2">
          <div className="text-sm text-white/50">Prompt</div>
          <p className="text-sm line-clamp-2">{image.prompt}</p>
        </div>

        {/* Details */}
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
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
        </div>
      </div>
    </Card>
  );
};

export default ImageCard;
