<<<<<<< HEAD
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
  
=======
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Ban, 
  CheckCircle, 
  Image as ImageIcon, 
  Settings, 
  Shield, 
  User,
  Search,
  LogOut,
  Filter,
  Download,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
  last_sign_in_at: string;
  provider: string;
  full_name: string;
  avatar_url: string;
}

interface GeneratedImage {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  created_at: string;
  settings: ImageSettings;
}

interface ImageSettings {
  negative_prompt: string;
  guidance_scale: number;
  num_inference_steps: number;
  aspect_ratio: string;
}

export const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "admin" | "banned">("all");
  const [imageFilter, setImageFilter] = useState<"all" | "recent" | "popular">("all");
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

<<<<<<< HEAD
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
=======
  // Fonction pour confirmer la déconnexion
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la déconnexion"
      });
    }
  };

  // Fonction pour supprimer une image
  const handleDeleteImage = async (imageId: string) => {
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'image"
      });
    }
  };

  // Filtrer les profils
  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = !searchTerm || 
      (profile.email?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" 
      || (filterStatus === "admin" && profile.is_admin)
      || (filterStatus === "banned" && profile.is_banned);
    return matchesSearch && matchesFilter;
  });

  // Filtrer et trier les images
  const filteredImages = images
    .filter(image => {
      if (!image) return false;
      if (imageFilter === "all") return true;
      if (imageFilter === "recent") {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return new Date(image.created_at) > oneWeekAgo;
      }
      return true;
    })
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  useEffect(() => {
    console.log("État auth dans Admin:", { user: !!user, isAdmin, authLoading });
    
    if (!authLoading) {
      if (!user) {
        console.log("Pas d'utilisateur, redirection vers /auth");
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
        navigate('/auth');
        return;
      }

      if (!isAdmin) {
<<<<<<< HEAD
=======
        console.log("Non admin, redirection vers /");
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration"
        });
        navigate('/');
        return;
      }

<<<<<<< HEAD
=======
      // Si on arrive ici, l'utilisateur est connecté et admin
      console.log("Utilisateur admin confirmé, chargement des données");
      const fetchData = async () => {
        try {
          console.log("Chargement des profils...");
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

          if (profilesError) {
            console.error("Erreur profils:", profilesError);
            throw profilesError;
          }

          // Vérifier et nettoyer les données des profils
          const cleanedProfiles = (profilesData || []).map(profile => ({
            ...profile,
            email: profile.email || "Email non défini",
            created_at: profile.created_at || new Date().toISOString(),
            last_sign_in_at: profile.last_sign_in_at || new Date().toISOString(),
            provider: profile.provider || "email",
            full_name: profile.full_name || "Nom non défini",
            avatar_url: profile.avatar_url || ""
          }));

          console.log("Profils chargés:", cleanedProfiles.length);
          setProfiles(cleanedProfiles);

          console.log("Chargement des images...");
          const { data: imagesData, error: imagesError } = await supabase
            .from('generated_images')
            .select('*')
            .order('created_at', { ascending: false });

          if (imagesError) {
            console.error("Erreur images:", imagesError);
            throw imagesError;
          }

          // Vérifier et nettoyer les données des images
          const cleanedImages = (imagesData || []).map(image => ({
            ...image,
            prompt: image.prompt || "Prompt non défini",
            created_at: image.created_at || new Date().toISOString(),
            settings: {
              negative_prompt: image.settings?.negative_prompt || "",
              guidance_scale: image.settings?.guidance_scale || 7.5,
              num_inference_steps: image.settings?.num_inference_steps || 20,
              aspect_ratio: image.settings?.aspect_ratio || "1:1"
            }
          }));

          console.log("Images chargées:", cleanedImages.length);
          setImages(cleanedImages);
        } catch (error) {
          console.error('Erreur chargement:', error);
          toast({
            variant: "destructive",
            title: "Erreur",
            description: error.message || "Impossible de charger les données"
          });
        } finally {
          setIsLoading(false);
        }
      };

>>>>>>> a945a29ba778c4116754a03171a654de675e5402
      fetchData();
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

<<<<<<< HEAD
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
=======
  const handleToggleBan = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(profiles.map(profile => 
        profile.id === profileId 
          ? { ...profile, is_banned: !currentStatus }
          : profile
      ));

      toast({
        title: "Succès",
        description: `Utilisateur ${currentStatus ? 'débanni' : 'banni'}`
      });
    } catch (error) {
      console.error('Error toggling ban status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier le statut"
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
      });
    }
  };

<<<<<<< HEAD
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
=======
  const handleToggleAdmin = async (profileId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(profiles.map(profile => 
        profile.id === profileId 
          ? { ...profile, is_admin: !currentStatus }
          : profile
      ));

      toast({
        title: "Succès",
        description: `Droits d'administration ${currentStatus ? 'retirés' : 'accordés'}`
      });
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modifier les droits"
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
      });
    }
  };

<<<<<<< HEAD
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
=======
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg text-muted-foreground">Chargement de l'interface d'administration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Administration</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {profiles.length} utilisateurs • {images.length} images
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <User className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="images">
              <ImageIcon className="h-4 w-4 mr-2" />
              Images
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={(value: "all" | "admin" | "banned") => setFilterStatus(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les utilisateurs</SelectItem>
                      <SelectItem value="admin">Administrateurs</SelectItem>
                      <SelectItem value="banned">Utilisateurs bannis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="relative overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Fournisseur</TableHead>
                      <TableHead>Dernière connexion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          {profile.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{profile.full_name}</span>
                            <span className="text-sm text-muted-foreground">{profile.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {profile.is_banned && (
                              <Badge variant="destructive">Banni</Badge>
                            )}
                            {profile.is_admin && (
                              <Badge variant="default">Admin</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {profile.provider || "email"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(profile.last_sign_in_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  {profile.is_banned ? 
                                    <CheckCircle className="h-4 w-4" /> : 
                                    <Ban className="h-4 w-4" />
                                  }
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {profile.is_banned ? "Débannir l'utilisateur" : "Bannir l'utilisateur"}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Êtes-vous sûr de vouloir {profile.is_banned ? "débannir" : "bannir"} cet utilisateur ?
                                    Cette action peut être annulée ultérieurement.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleToggleBan(profile.id, profile.is_banned)}
                                  >
                                    Confirmer
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Shield className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {profile.is_admin ? "Retirer les droits admin" : "Donner les droits admin"}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Êtes-vous sûr de vouloir {profile.is_admin ? "retirer" : "donner"} les droits 
                                    d'administration à cet utilisateur ?
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => handleToggleAdmin(profile.id, profile.is_admin)}
                                  >
                                    Confirmer
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Select value={imageFilter} onValueChange={(value: "all" | "recent" | "popular") => setImageFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filtrer les images" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les images</SelectItem>
                      <SelectItem value="recent">7 derniers jours</SelectItem>
                      <SelectItem value="popular">Plus populaires</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <img
                        src={image.image_url}
                        alt={image.prompt}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <Button variant="secondary" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Supprimer l'image</DialogTitle>
                              <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer cette image ?
                                Cette action est irréversible.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="destructive"
                                onClick={() => handleDeleteImage(image.id)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-sm font-medium truncate">{image.prompt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{new Date(image.created_at).toLocaleDateString()}</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Paramètres de l'image</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Prompt négatif</h4>
                                <p className="text-sm text-muted-foreground">
                                  {image.settings.negative_prompt || "Aucun"}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Guidance Scale</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {image.settings.guidance_scale}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Steps</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {image.settings.num_inference_steps}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
    </div>
  );
};

<<<<<<< HEAD
export default Admin;
=======
export default Admin; 
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
