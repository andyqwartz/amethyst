import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Image as ImageIcon,
  Clock,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
} from 'lucide-react';
import { Profile, GeneratedImage, UserGenerationStats } from '@/types/database';
import { format, subDays, subMonths, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

interface StatsManagementProps {
  profiles: Profile[];
  generationStats: UserGenerationStats[];
  images: GeneratedImage[];
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: 'day' | 'week' | 'month' | 'year') => void;
}

const StatsManagement: React.FC<StatsManagementProps> = ({
  profiles,
  generationStats,
  images,
  timeRange,
  onTimeRangeChange,
}) => {
  // Calculate date range
  const now = new Date();
  const getDateRange = () => {
    switch (timeRange) {
      case 'day':
        return { start: startOfDay(now), end: endOfDay(now) };
      case 'week':
        return { start: subDays(now, 7), end: now };
      case 'month':
        return { start: subMonths(now, 1), end: now };
      case 'year':
        return { start: subMonths(now, 12), end: now };
    }
  };

  const dateRange = getDateRange();

  // Filter data by date range
  const filteredImages = images.filter(
    img => new Date(img.created_at) >= dateRange.start && new Date(img.created_at) <= dateRange.end
  );

  // Calculate stats
  const totalUsers = profiles.length;
  const activeUsers = profiles.filter(p => !p.is_banned).length;
  const bannedUsers = profiles.filter(p => p.is_banned).length;
  const totalImages = filteredImages.length;
  const completedImages = filteredImages.filter(img => img.status === 'completed').length;
  const failedImages = filteredImages.filter(img => img.status === 'failed').length;
  const averageTime = filteredImages
    .filter(img => img.processing_time)
    .reduce((acc, img) => acc + (img.processing_time || 0), 0) / completedImages || 0;

  const renderStatCard = (
    title: string,
    value: string | number,
    icon: React.ReactNode,
    description?: string,
    color: string = 'text-white'
  ) => (
    <Card className="bg-[#1A1D27] border-white/10 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-white/50">{title}</p>
          <h3 className={`text-2xl font-bold mt-2 ${color}`}>{value}</h3>
          {description && (
            <p className="text-sm text-white/50 mt-1">{description}</p>
          )}
        </div>
        <div className="text-white/20">{icon}</div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTimeRangeChange('day')}
          className={`text-white border-white/20 hover:bg-white/10 ${timeRange === 'day' ? 'bg-white/10' : ''}`}
        >
          <Clock className="h-4 w-4 mr-2" />
          Aujourd'hui
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTimeRangeChange('week')}
          className={`text-white border-white/20 hover:bg-white/10 ${timeRange === 'week' ? 'bg-white/10' : ''}`}
        >
          <Activity className="h-4 w-4 mr-2" />
          7 jours
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTimeRangeChange('month')}
          className={`text-white border-white/20 hover:bg-white/10 ${timeRange === 'month' ? 'bg-white/10' : ''}`}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          30 jours
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTimeRangeChange('year')}
          className={`text-white border-white/20 hover:bg-white/10 ${timeRange === 'year' ? 'bg-white/10' : ''}`}
        >
          <Calendar className="h-4 w-4 mr-2" />
          12 mois
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* User Stats */}
        {renderStatCard(
          'Utilisateurs totaux',
          totalUsers,
          <Users className="h-6 w-6" />
        )}
        {renderStatCard(
          'Utilisateurs actifs',
          activeUsers,
          <CheckCircle className="h-6 w-6" />,
          `${((activeUsers / totalUsers) * 100).toFixed(1)}% du total`,
          'text-green-500'
        )}
        {renderStatCard(
          'Utilisateurs bannis',
          bannedUsers,
          <AlertTriangle className="h-6 w-6" />,
          `${((bannedUsers / totalUsers) * 100).toFixed(1)}% du total`,
          'text-red-500'
        )}

        {/* Image Stats */}
        {renderStatCard(
          'Images générées',
          totalImages,
          <ImageIcon className="h-6 w-6" />
        )}
        {renderStatCard(
          'Images réussies',
          completedImages,
          <CheckCircle className="h-6 w-6" />,
          `${((completedImages / totalImages) * 100).toFixed(1)}% du total`,
          'text-green-500'
        )}
        {renderStatCard(
          'Images échouées',
          failedImages,
          <XCircle className="h-6 w-6" />,
          `${((failedImages / totalImages) * 100).toFixed(1)}% du total`,
          'text-red-500'
        )}

        {/* Performance Stats */}
        {renderStatCard(
          'Temps moyen',
          `${averageTime.toFixed(1)}s`,
          <Clock className="h-6 w-6" />,
          'Par génération'
        )}
        {renderStatCard(
          'Taux de réussite',
          `${((completedImages / totalImages) * 100).toFixed(1)}%`,
          <TrendingUp className="h-6 w-6" />,
          'Images réussies'
        )}
        {renderStatCard(
          'Images par utilisateur',
          (totalImages / activeUsers).toFixed(1),
          <Activity className="h-6 w-6" />,
          'En moyenne'
        )}
      </div>
    </div>
  );
};

export default StatsManagement;
