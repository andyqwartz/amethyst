import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreditDialog } from "@/components/credits/CreditDialog";
import { AdViewer } from "@/components/credits/AdViewer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { useProfile } from '@/hooks/useProfile';
import { useProfileActions } from '@/hooks/useProfileActions';
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
  Sparkles,
  User,
  Youtube,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface UserProfileProps {
  user?: {
    id?: string;
    email?: string;
  };
  onSignOut?: () => void;
}

export const UserProfile = ({ user, onSignOut }: UserProfileProps) => {
  const { profile, loading, updateProfile } = useProfile();
  const { isUploading, updateAvatar } = useProfileActions(user?.id, () => {
    updateProfile({});
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [showAdViewer, setShowAdViewer] = useState(false);

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const canWatchAd = (profile.ads_watched_today || 0) < (profile.daily_ads_limit || 10);

  const handleAdComplete = async () => {
    setShowAdViewer(false);
    // Refresh profile data to get updated credit balance
    updateProfile({});
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

  const getAuthProviderBadge = () => {
    switch (profile.auth_provider) {
      case 'google':
        return <Badge variant="outline" className="ml-2">Google</Badge>;
      case 'github':
        return <Badge variant="outline" className="ml-2">GitHub</Badge>;
      case 'apple':
        return <Badge variant="outline" className="ml-2">Apple</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">Email</Badge>;
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
      badge: getAuthProviderBadge()
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Abonnements et crédits",
      description: `${profile.credits_balance} crédits disponibles`,
      onClick: () => setShowCreditDialog(true),
      badge: <Badge className="bg-primary/10 text-primary ml-2">{profile.subscription_tier}</Badge>
    },
    {
      icon: <Youtube className="w-5 h-5" />,
      title: "Gagner des crédits",
      description: `${profile.ads_watched_today}/${profile.daily_ads_limit} publicités vues aujourd'hui`,
      onClick: canWatchAd ? () => setShowAdViewer(true) : undefined,
      badge: canWatchAd ? (
        <Badge variant="outline" className="ml-2 bg-primary/10 text-primary">+5 crédits</Badge>
      ) : (
        <Badge variant="secondary" className="ml-2">Limite atteinte</Badge>
      )
    }
  ];

  const statsItems = [
    {
      icon: <ImageIcon className="w-4 h-4" />,
      value: "0", // TODO: Add total generations from stats
      label: "Images générées"
    },
    {
      icon: <Sparkles className="w-4 h-4" />,
      value: profile.credits_balance.toString(),
      label: "Crédits restants"
    },
    {
      icon: <Gift className="w-4 h-4" />,
      value: profile.ads_credits_earned.toString(),
      label: "Crédits gagnés"
    },
    {
      icon: <Globe className="w-4 h-4" />,
      value: profile.subscription_tier || 'Standard',
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
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name || ''} />
              ) : (
                <AvatarFallback>
                  <User className="h-10 w-10" />
                </AvatarFallback>
              )}
            </Avatar>
            <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary/10 text-primary">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{profile.full_name || 'Utilisateur'}</h1>
            <div 
              className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
              onClick={() => setShowEmail(!showEmail)}
            >
              {protectEmail(profile.email)}
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Membre depuis {new Date(profile.created_at).toLocaleDateString()}
              </p>
              {profile.last_sign_in_at && (
                <p className="text-sm text-muted-foreground">
                  Dernière connexion: {new Date(profile.last_sign_in_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

        {/* Progression des publicités */}
        {profile.ads_enabled && (
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-primary" />
                <span className="font-medium">Progression des publicités</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {profile.ads_watched_today}/{profile.daily_ads_limit}
              </span>
            </div>
            <Progress 
              value={(profile.ads_watched_today / profile.daily_ads_limit) * 100} 
              className="h-2"
            />
            {!canWatchAd && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <AlertCircle className="w-4 h-4" />
                <span>Limite quotidienne atteinte. Revenez demain !</span>
              </div>
            )}
          </Card>
        )}

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
                Français (Non modifiable)
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
                checked={profile.notifications_enabled}
                onCheckedChange={(checked) => 
                  updateProfile({ notifications_enabled: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Newsletter</span>
              </div>
              <Switch
                checked={profile.marketing_emails_enabled}
                onCheckedChange={(checked) => 
                  updateProfile({ marketing_emails_enabled: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-primary" />
                <span>Publicités récompensées</span>
              </div>
              <Switch
                checked={profile.ads_enabled}
                onCheckedChange={(checked) => 
                  updateProfile({ ads_enabled: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Actions de compte */}
        <div className="flex flex-col gap-4 pt-4">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
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

      {/* Credit Dialog */}
      <CreditDialog
        userId={user?.id}
        open={showCreditDialog}
        onOpenChange={setShowCreditDialog}
        onSuccess={() => {
          updateProfile({});
        }}
      />

      {/* Ad Viewer */}
      {showAdViewer && user?.id && (
        <AdViewer
          userId={user.id}
          onComplete={handleAdComplete}
          onError={() => setShowAdViewer(false)}
        />
      )}
    </ScrollArea>
  );
};
