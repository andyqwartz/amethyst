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
  const { user, isAdmin, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        navigate('/auth');
        return;
      }

      if (!isAdmin) {
        console.log("Non admin, redirection vers /");
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration"
        });
        navigate('/');
        return;
      }

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

      fetchData();
    }
  }, [user, isAdmin, authLoading, navigate, toast]);

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
      });
    }
  };

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
      });
    }
  };

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
    </div>
  );
};

export default Admin; 