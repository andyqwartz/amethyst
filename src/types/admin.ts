import { GeneratedImage, ImageMetadata, Profile } from './database';

export type UserFilterStatus = 'all' | 'admin' | 'banned';
export type ImageFilterStatus = 'all' | 'completed' | 'processing' | 'failed';
export type TimeRange = 'day' | 'week' | 'month' | 'year';

export interface UserManagementProps {
  profiles: Profile[];
  onBanUser: (userId: string, currentStatus: boolean) => Promise<void>;
  onToggleAdmin: (userId: string, currentStatus: boolean) => Promise<void>;
  onViewImages: (userId: string) => Promise<void>;
  onToggleSurveillance: (userId: string, currentStatus: boolean) => Promise<void>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
  needsAttentionFilter: boolean;
  onNeedsAttentionFilterChange: (value: boolean) => void;
}

export interface ImageManagementProps {
  images: (GeneratedImage & { metadata?: ImageMetadata; user?: Profile })[];
  onDeleteImage: (imageId: string) => Promise<void>;
  onViewImage: (image: GeneratedImage & { metadata?: ImageMetadata; user?: Profile }) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

export interface StatsManagementProps {
  profiles: Profile[];
  generationStats: UserGenerationStats[];
  images: GeneratedImage[];
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

export interface ImageViewModalProps {
  image?: GeneratedImage & { metadata?: ImageMetadata; user?: Profile };
  isOpen: boolean;
  onClose: () => void;
  onDownload: (image: GeneratedImage) => Promise<void>;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export interface LoadingStateProps {
  message?: string;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: number;
}

export interface UserGenerationStats {
  user_id: string;
  total_generations: number;
  successful_generations: number;
  failed_generations: number;
  avg_generation_time: number;
  total_credits_spent: number;
  active_days: number;
  last_30_days_generations: number;
  favorite_models: Record<string, number>;
  common_resolutions: Record<string, number>;
  created_at: string;
  updated_at: string;
}
