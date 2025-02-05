import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Ban,
  Shield,
  User,
  Mail,
  Phone,
  DollarSign,
  Bell,
  Image as ImageIcon,
  AlertTriangle,
  Clock,
  Calendar,
  Activity,
  Eye,
  Settings,
  MoreVertical,
} from 'lucide-react';
import { Profile } from '@/types/database';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserCardProps {
  user: Profile;
  onBanUser: (id: string, currentStatus: boolean) => Promise<void>;
  onToggleAdmin: (id: string, currentStatus: boolean) => Promise<void>;
  onViewImages: (id: string) => Promise<void>;
  onToggleSurveillance: (id: string, currentStatus: boolean) => Promise<void>;
  onEdit: (user: Profile) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onBanUser,
  onToggleAdmin,
  onViewImages,
  onToggleSurveillance,
  onEdit,
}) => {
  return (
    <Card className="bg-[#1A1D27] border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="h-12 w-12 rounded-full" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-6 w-6 text-white/50" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-white">{user.full_name || 'Sans nom'}</h3>
              <p className="text-sm text-white/70">{user.email}</p>
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
                onClick={() => onEdit(user)}
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onViewImages(user.id)}
                className="text-white hover:bg-white/10"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Images
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBanUser(user.id, user.is_banned)}
                className="text-white hover:bg-white/10"
              >
                <Ban className="h-4 w-4 mr-2" />
                {user.is_banned ? 'Débannir' : 'Bannir'}
              </DropdownMenuItem>
              {!user.is_admin && (
                <DropdownMenuItem
                  onClick={() => onToggleAdmin(user.id, user.is_admin)}
                  className="text-white hover:bg-white/10"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {user.is_admin ? 'Retirer Admin' : 'Accorder Admin'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onToggleSurveillance(user.id, user.needs_attention)}
                className="text-white hover:bg-white/10"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                {user.needs_attention ? 'Retirer Surveillance' : 'Surveiller'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mt-3">
          {user.is_admin && (
            <Badge variant="default">Admin</Badge>
          )}
          {user.is_banned && (
            <Badge variant="destructive">Banni</Badge>
          )}
          {user.needs_attention && (
            <Badge variant="outline" className="border-yellow-500 text-yellow-500">
              Surveillance
            </Badge>
          )}
          <Badge variant={user.subscription_tier === 'free' ? 'secondary' : 'default'}>
            {user.subscription_tier}
          </Badge>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 divide-x divide-white/10">
        {/* Left Column */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <div className="text-sm text-white/50">Vérification</div>
            <div className="flex items-center gap-2">
              <Mail className={`h-4 w-4 ${user.email_verified ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm">{user.email_verified ? 'Email vérifié' : 'Email non vérifié'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className={`h-4 w-4 ${user.phone_verified ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm">{user.phone_verified ? 'Téléphone vérifié' : 'Téléphone non vérifié'}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-white/50">Crédits</div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">{user.credits_balance} disponibles</span>
            </div>
            <div className="text-sm text-white/50">
              {user.lifetime_credits} crédits totaux
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <div className="text-sm text-white/50">Dernière connexion</div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {formatDistanceToNow(new Date(user.last_sign_in_at), { locale: fr, addSuffix: true })}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-white/50">Publicités</div>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="text-sm">{user.ads_watched_today}/{user.daily_ads_limit} aujourd'hui</span>
            </div>
            <div className="text-sm text-white/50">
              {user.ads_credits_earned} crédits gagnés
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserCard;
