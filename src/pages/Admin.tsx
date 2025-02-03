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
  Ban, 
  CheckCircle, 
  Image as ImageIcon, 
  Settings, 
  Shield, 
  User 
} from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  is_admin: boolean;
  is_banned: boolean;
  created_at: string;
  last_sign_in_at: string;
}

interface GeneratedImage {
  id: string;
  user_id: string;
  prompt: string;
  image_url: string;
  created_at: string;
  settings: any; // À typer correctement plus tard
}

export const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, checkAdminStatus } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      const isAdmin = await checkAdminStatus(user.id);
      if (!isAdmin) {
        toast({
          variant: "destructive",
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration"
        });
        navigate('/');
      }
    };

    checkAdmin();
  }, [user, navigate, checkAdminStatus, toast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les profils
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        // Charger les images générées
        const { data: imagesData, error: imagesError } = await supabase
          .from('generated_images')
          .select('*')
          .order('created_at', { ascending: false });

        if (imagesError) throw imagesError;

        setProfiles(profilesData);
        setImages(imagesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Administration</h1>
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-sm text-muted-foreground">
            {profiles.length} utilisateurs • {images.length} images
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Utilisateurs */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Utilisateurs</h2>
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {profile.is_banned && (
                          <span className="text-destructive text-sm">Banni</span>
                        )}
                        {profile.is_admin && (
                          <span className="text-primary text-sm">Admin</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleBan(profile.id, profile.is_banned)}
                        >
                          {profile.is_banned ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleAdmin(profile.id, profile.is_admin)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Images générées */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Images générées</h2>
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>
                      {profiles.find(p => p.id === image.user_id)?.email}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {image.prompt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(image.image_url, '_blank')}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log('Settings:', image.settings)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin; 