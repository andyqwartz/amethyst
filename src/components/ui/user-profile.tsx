import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings2, 
  Key, 
  CreditCard, 
  LogOut, 
  UserX, 
  Bell, 
  Shield, 
  Gift, 
  Globe,
  History,
  Image as ImageIcon,
  Mail,
  Palette,
  Sparkles
} from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface UserProfileProps {
  user?: {
    name?: string;
    email?: string;
    avatarUrl?: string;
    joinDate?: Date;
    credits?: number;
    membershipType?: string;
    totalGenerations?: number;
    lastActive?: Date;
    preferences?: {
      language?: string;
      notifications?: boolean;
      newsletter?: boolean;
    };
  };
}

const defaultUser = {
  name: 'Utilisateur',
  email: 'utilisateur@exemple.com',
  credits: 0,
  membershipType: 'Gratuit',
  totalGenerations: 0,
  joinDate: new Date(),
  lastActive: new Date(),
  preferences: {
    language: 'Français',
    notifications: false,
    newsletter: false
  }
};

export const UserProfile = ({ user: providedUser }: UserProfileProps) => {
  const user = { ...defaultUser, ...providedUser, preferences: { ...defaultUser.preferences, ...providedUser?.preferences } };
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [showEmail, setShowEmail] = React.useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la déconnexion",
        variant: "destructive"
      });
    }
  };

  const protectEmail = (email: string) => {
    if (!email) return 'email@exemple.com';
    if (showEmail) return email;
    try {
      const [username, domain] = email.split('@');
      return `${username[0]}${'.'.repeat(Math.max(0, username.length - 2))}${username.slice(-1)}@${domain}`;
    } catch {
      return 'email@exemple.com';
    }
  };

  const menuItems = [
    {
      icon: <Settings2 className="w-5 h-5" />,
      title: "Paramètres du compte",
      description: "Gérez vos informations personnelles",
      onClick: undefined,
      badge: <Badge variant="secondary" className="ml-2">En développement</Badge>
    },
    {
      icon: <Key className="w-5 h-5" />,
      title: "Sécurité",
      description: "Changez votre mot de passe et vos paramètres de sécurité",
      onClick: undefined,
      badge: <Badge variant="outline" className="ml-2">2FA Activé</Badge>
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Abonnements et crédits",
      description: `${user.credits} crédits disponibles`,
      onClick: undefined,
      badge: <Badge className="bg-primary/10 text-primary ml-2">Gratuit</Badge>
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Notifications",
      description: "Gérez vos préférences de notification",
      onClick: undefined,
      badge: null
    },
    {
      icon: <History className="w-5 h-5" />,
      title: "Historique des générations",
      description: "Consultez vos générations précédentes",
      onClick: undefined,
      badge: <Badge variant="secondary" className="ml-2">Bientôt disponible</Badge>
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Préférences de style",
      description: "Personnalisez l'apparence de l'interface",
      onClick: undefined,
      badge: null
    }
  ];

  const statsItems = [
    {
      icon: <ImageIcon className="w-4 h-4" />,
      value: (user.totalGenerations ?? 0).toString(),
      label: "Images générées"
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      value: (user.credits ?? 0).toString(),
      label: "Crédits restants"
    },
    {
      icon: <Gift className="w-4 h-4" />,
      value: "2",
      label: "Récompenses"
    },
    {
      icon: <Globe className="w-4 h-4" />,
      value: user.membershipType ?? 'Gratuit',
      label: "Type d'abonnement"
    }
  ];

  return (
    <ScrollArea className="h-[calc(100vh-5rem)]">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* En-tête du profil */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatarUrl} />
              <AvatarFallback className="text-2xl bg-primary/10">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary/10 text-primary">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <div 
              className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => setShowEmail(!showEmail)}
            >
              {protectEmail(user.email)}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Membre depuis {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
              </p>
              <p className="text-sm text-muted-foreground">
                Dernière connexion: {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-3 gap-4">
          {statsItems.map((stat, index) => (
            <Card key={index} className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                {stat.icon}
                <span className="font-semibold">{stat.value}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Menu principal */}
        <div className="grid gap-4">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className={`p-4 ${item.onClick ? 'hover:bg-primary/5 transition-colors cursor-pointer' : 'opacity-75'}`}
              onClick={item.onClick}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-full bg-primary/10 text-primary">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{item.title}</h3>
                    {item.badge}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Préférences */}
        <Card className="p-6 space-y-6">
          <h3 className="text-lg font-semibold">Préférences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>Langue</span>
              </div>
              <Button variant="outline" size="sm" className="text-sm pointer-events-none opacity-75">
                {user.preferences.language || 'Français'} (Non modifiable)
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>Mode sombre</span>
              </div>
              <Switch
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
                disabled
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <span>Notifications</span>
              </div>
              <Switch
                checked={user.preferences.notifications}
                disabled
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Newsletter</span>
              </div>
              <Switch
                checked={user.preferences.newsletter}
                disabled
              />
            </div>
          </div>
        </Card>

        {/* Actions de compte */}
        <div className="flex flex-col gap-4 pt-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Déconnexion
          </Button>
          <Button
            variant="destructive"
            className="w-full justify-start"
            disabled
          >
            <UserX className="w-4 h-4 mr-2" />
            Supprimer le compte (Non disponible)
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
}; 
