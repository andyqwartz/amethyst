import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, Users, Image as ImageIcon, BarChart, Download, RefreshCw } from 'lucide-react';
import { Sheet, SheetContent } from "@/components/ui/sheet";
import SettingsPage from '@/components/admin/SettingsPage';
import AdminHeader from '@/components/admin/AdminHeader';
import MobileNavigation from '@/components/admin/MobileNavigation';
import UserManagement from '@/components/admin/UserManagement';
import ImageManagement from '@/components/admin/ImageManagement';
import StatsManagement from '@/components/admin/StatsManagement';
import { Profile, GeneratedImage, ImageMetadata, UserGenerationStats } from '@/types/database';
import ImageViewModal from '@/components/admin/ImageViewModal';
import LoadingState from '@/components/admin/LoadingState';
import ConfirmDialog from '@/components/admin/ConfirmDialog';

const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [images, setImages] = useState<(GeneratedImage & { metadata?: ImageMetadata; user?: Profile })[]>([]);
  const [generationStats, setGenerationStats] = useState<UserGenerationStats[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState(false);
  const [imageFilterStatus, setImageFilterStatus] = useState<string>("all");
  const [imageSearchTerm, setImageSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage & { metadata?: ImageMetadata; user?: Profile }>();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    variant: 'default' | 'destructive';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    variant: 'default',
    onConfirm: () => {},
  });
  
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration"
        });
        navigate('/');
        return;
      }

      fetchData();
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch images with metadata
      const { data: imagesData, error: imagesError } = await supabase
        .from('generated_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (imagesError) throw imagesError;

      // Fetch generation stats
      const { data: statsData, error: statsError } = await supabase
        .from('user_generation_stats')
        .select('*');

      if (statsError) throw statsError;

      setProfiles(profilesData);
      setImages(imagesData);
      setGenerationStats(statsData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: (error as any).message || "Impossible de charger les données"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBanUser = async (userId: string, currentStatus: boolean) => {
    return new Promise<void>((resolve) => {
      setConfirmDialog({
        isOpen: true,
        title: currentStatus ? 'Débannir l\'utilisateur' : 'Bannir l\'utilisateur',
        description: `Êtes-vous sûr de vouloir ${currentStatus ? 'débannir' : 'bannir'} cet utilisateur ?`,
        variant: 'destructive',
        onConfirm: async () => {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({ is_banned: !currentStatus })
              .eq('id', userId);

            if (error) throw error;

            setProfiles(profiles.map(profile => 
              profile.id === userId ? { ...profile, is_banned: !currentStatus } : profile
            ));
            
            toast({
              title: "Succès",
              description: `Utilisateur ${currentStatus ? 'débanni' : 'banni'}`
            });
            resolve();
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de modifier le statut"
            });
            resolve();
          }
        },
      });
    });
  };

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    return new Promise<void>((resolve) => {
      setConfirmDialog({
        isOpen: true,
        title: currentStatus ? 'Retirer les droits d\'administration' : 'Accorder les droits d\'administration',
        description: `Êtes-vous sûr de vouloir ${currentStatus ? 'retirer' : 'accorder'} les droits d'administration à cet utilisateur ?`,
        variant: 'default',
        onConfirm: async () => {
          try {
            const { error } = await supabase
              .from('profiles')
              .update({ is_admin: !currentStatus })
              .eq('id', userId);

            if (error) throw error;

            setProfiles(profiles.map(profile => 
              profile.id === userId ? { ...profile, is_admin: !currentStatus } : profile
            ));

            toast({
              title: "Succès",
              description: `Droits d'administration ${currentStatus ? 'retirés' : 'accordés'}`
            });
            resolve();
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de modifier les droits"
            });
            resolve();
          }
        },
      });
    });
  };

  const handleDeleteImage = async (imageId: string) => {
    return new Promise<void>((resolve) => {
      setConfirmDialog({
        isOpen: true,
        title: 'Supprimer l\'image',
        description: 'Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.',
        variant: 'destructive',
        onConfirm: async () => {
          try {
            const { error } = await supabase
              .from('generated_images')
              .delete()
              .eq('id', imageId);

            if (error) throw error;

            setImages(images.filter(img => img.id !== imageId));
            toast({
              title: "Succès",
              description: "Image supprimée avec succès"
            });
            resolve();
          } catch (error) {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de supprimer l'image"
            });
            resolve();
          }
        },
      });
    });
  };

  const handleUpdateUser = async (updatedUser: Profile) => {
    try {
      // Update only the changed fields
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: updatedUser.full_name,
          phone_number: updatedUser.phone_number,
          subscription_tier: updatedUser.subscription_tier,
          subscription_status: updatedUser.subscription_status,
          credits_balance: updatedUser.credits_balance,
          daily_ads_limit: updatedUser.daily_ads_limit,
          notifications_enabled: updatedUser.notifications_enabled,
          marketing_emails_enabled: updatedUser.marketing_emails_enabled,
          ads_enabled: updatedUser.ads_enabled,
          language: updatedUser.language,
          theme: updatedUser.theme,
          is_admin: updatedUser.is_admin,
          needs_attention: updatedUser.needs_attention,
        })
        .eq('id', updatedUser.id);

      if (updateError) throw updateError;

      // Refresh the profiles list
      const { data: updatedProfiles, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProfiles(updatedProfiles);

      toast({
        title: "Succès",
        description: "Utilisateur mis à jour avec succès"
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'utilisateur"
      });
    }
  };

  const handleToggleSurveillance = async (userId: string, currentStatus: boolean) => {
    return new Promise<void>((resolve) => {
      setConfirmDialog({
        isOpen: true,
        title: currentStatus ? 'Retirer de la surveillance' : 'Ajouter à la surveillance',
        description: `Êtes-vous sûr de vouloir ${currentStatus ? 'retirer' : 'ajouter'} cet utilisateur à la surveillance ?`,
        variant: 'default',
        onConfirm: async () => {
          try {
            // Update only the needs_attention field
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ needs_attention: !currentStatus })
              .eq('id', userId);

            if (updateError) throw updateError;

            // Refresh the profiles list
            const { data: updatedProfiles, error: fetchError } = await supabase
              .from('profiles')
              .select('*')
              .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            setProfiles(updatedProfiles);

            toast({
              title: "Succès",
              description: `Utilisateur ${currentStatus ? 'retiré de la surveillance' : 'ajouté à la surveillance'}`
            });
            resolve();
          } catch (error) {
            console.error('Error updating surveillance status:', error);
            toast({
              variant: "destructive",
              title: "Erreur",
              description: "Impossible de modifier le statut de surveillance"
            });
            resolve();
          }
        },
      });
    });
  };

  const handleViewImage = (image: GeneratedImage & { metadata?: ImageMetadata; user?: Profile }) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(`/api/images/${image.id}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.id}.${image.output_format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger l'image"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1117] text-white pb-20 lg:pb-8">
      <AdminHeader
        onRefresh={fetchData}
        onSignOut={signOut}
        isLoading={isLoading}
      />

      <MobileNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={fetchData}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isLoading={isLoading}
      />

      {/* Settings Sheet */}
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetContent 
          side="right" 
          className="w-full sm:w-[540px] bg-[#1A1D27] border-white/10 p-0 overflow-y-auto"
        >
          <SettingsPage onClose={() => setIsSettingsOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-20">
        {isLoading ? (
          <LoadingState message="Chargement des données..." />
        ) : (
          <div className="space-y-6">

            {/* Users Section */}
            <div className={`${activeTab === 'users' ? 'block' : 'hidden'} -mt-4`}>
            <UserManagement
              onUpdateUser={handleUpdateUser}
              profiles={profiles}
              onBanUser={handleBanUser}
              onToggleAdmin={handleToggleAdmin}
              onViewImages={async (id: string) => {
                const { data, error } = await supabase
                  .from('generated_images')
                  .select('*')
                  .eq('user_id', id)
                  .order('created_at', { ascending: false });

                if (error) {
                  toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les images de l'utilisateur"
                  });
                  return;
                }

                setImages(data);
              }}
              onToggleSurveillance={handleToggleSurveillance}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterStatus={filterStatus}
              onFilterChange={(value: string) => setFilterStatus(value)}
              needsAttentionFilter={needsAttentionFilter}
              onNeedsAttentionFilterChange={setNeedsAttentionFilter}
            />
            </div>

            {/* Images Section */}
            <div className={`${activeTab === 'images' ? 'block' : 'hidden'} -mt-4`}>
            <ImageManagement
              images={images}
              onDeleteImage={handleDeleteImage}
              onViewImage={handleViewImage}
              searchTerm={imageSearchTerm}
              onSearchChange={setImageSearchTerm}
              filterStatus={imageFilterStatus}
              onFilterChange={(value: string) => setImageFilterStatus(value)}
            />
            </div>

            {/* Stats Section */}
            <div className={activeTab === 'stats' ? 'block' : 'hidden'}>
            <StatsManagement
              profiles={profiles}
              generationStats={generationStats}
              images={images}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
            </div>
          </div>
        )}
      </div>
      <ImageViewModal
        image={selectedImage}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onDownload={handleDownloadImage}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />
    </div>
  );
};

export default Admin;
