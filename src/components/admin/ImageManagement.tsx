import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
} from 'lucide-react';
import { GeneratedImage, ImageMetadata, Profile } from '@/types/database';
import ImageCard from './ImageCard';

interface ImageManagementProps {
  images: (GeneratedImage & { metadata?: ImageMetadata; user?: Profile })[];
  onDeleteImage: (id: string) => Promise<void>;
  onViewImage: (image: GeneratedImage & { metadata?: ImageMetadata; user?: Profile }) => void;
  onDownloadImage?: (image: GeneratedImage) => Promise<void>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

const ImageManagement: React.FC<ImageManagementProps> = ({
  images,
  onDeleteImage,
  onViewImage,
  onDownloadImage,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}) => {
  const filteredImages = images.filter(image => {
    // Search filter
    const searchMatch = !searchTerm || 
      image.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.user?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let statusMatch = true;
    if (filterStatus === 'completed') statusMatch = image.status === 'completed';
    else if (filterStatus === 'failed') statusMatch = image.status === 'failed';
    else if (filterStatus === 'pending') statusMatch = image.status === 'pending';

    return searchMatch && statusMatch;
  });

  return (
    <div className="space-y-6 -mt-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Rechercher une image..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-[#1A1D27] border-white/10 text-white w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange('all')}
            className={`text-white border-white/20 hover:bg-white/10 ${filterStatus === 'all' ? 'bg-white/10' : ''}`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Toutes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange('completed')}
            className={`text-white border-white/20 hover:bg-white/10 ${filterStatus === 'completed' ? 'bg-white/10' : ''}`}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Terminées
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange('failed')}
            className={`text-white border-white/20 hover:bg-white/10 ${filterStatus === 'failed' ? 'bg-white/10' : ''}`}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Échouées
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange('pending')}
            className={`text-white border-white/20 hover:bg-white/10 ${filterStatus === 'pending' ? 'bg-white/10' : ''}`}
          >
            <Loader className="h-4 w-4 mr-2" />
            En cours
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredImages.map(image => (
          <ImageCard
            key={image.id}
            image={image}
            onView={onViewImage}
            onDelete={onDeleteImage}
            onDownload={onDownloadImage || (() => Promise.resolve())}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredImages.length === 0 && (
        <div className="text-center py-8 text-white/50">
          Aucune image trouvée
        </div>
      )}
    </div>
  );
};

export default ImageManagement;
