import React, { useState } from 'react';
import EditUserModal from './EditUserModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Ban,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { Profile } from '@/types/database';
import UserCard from './UserCard';

interface UserManagementProps {
  profiles: Profile[];
  onBanUser: (id: string, currentStatus: boolean) => Promise<void>;
  onToggleAdmin: (id: string, currentStatus: boolean) => Promise<void>;
  onViewImages: (id: string) => Promise<void>;
  onToggleSurveillance: (id: string, currentStatus: boolean) => Promise<void>;
  onUpdateUser: (user: Profile) => Promise<void>;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
  needsAttentionFilter: boolean;
  onNeedsAttentionFilterChange: (value: boolean) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({
  profiles,
  onBanUser,
  onToggleAdmin,
  onViewImages,
  onToggleSurveillance,
  onUpdateUser,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  needsAttentionFilter,
  onNeedsAttentionFilterChange,
}) => {
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  const filteredProfiles = profiles.filter(profile => {
    // Search filter
    const searchMatch = !searchTerm || 
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let statusMatch = true;
    if (filterStatus === 'admin') statusMatch = profile.is_admin;
    else if (filterStatus === 'banned') statusMatch = profile.is_banned;
    else if (filterStatus === 'active') statusMatch = !profile.is_banned;

    // Needs attention filter
    const attentionMatch = !needsAttentionFilter || profile.needs_attention;

    return searchMatch && statusMatch && attentionMatch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Rechercher un utilisateur..."
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
            Tous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange('admin')}
            className={`text-white border-white/20 hover:bg-white/10 ${filterStatus === 'admin' ? 'bg-white/10' : ''}`}
          >
            <Shield className="h-4 w-4 mr-2" />
            Admins
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onFilterChange('banned')}
            className={`text-white border-white/20 hover:bg-white/10 ${filterStatus === 'banned' ? 'bg-white/10' : ''}`}
          >
            <Ban className="h-4 w-4 mr-2" />
            Bannis
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNeedsAttentionFilterChange(!needsAttentionFilter)}
            className={`text-white border-white/20 hover:bg-white/10 ${needsAttentionFilter ? 'bg-white/10' : ''}`}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Surveillance
          </Button>
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {filteredProfiles.map(profile => (
          <UserCard
            key={profile.id}
            user={profile}
            onBanUser={onBanUser}
            onToggleAdmin={onToggleAdmin}
            onViewImages={onViewImages}
            onToggleSurveillance={onToggleSurveillance}
            onEdit={() => setSelectedUser(profile)}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredProfiles.length === 0 && (
        <div className="text-center py-8 text-white/50">
          Aucun utilisateur trouvé
        </div>
      )}

      {/* Edit Modal */}
      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={async (updatedUser) => {
            await onUpdateUser(updatedUser);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
