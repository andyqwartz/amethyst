import { AccountLayout } from './AccountLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, CreditCard, PlayCircle } from 'lucide-react';
import { DeleteAccountModal } from '@/components/account/DeleteAccountModal';

export const AccountSettingsPage = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleUpdateProfile = async (data: Partial<typeof profile>) => {
    try {
      setIsLoading(true);
      await updateProfile(data);
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le profil"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccountLayout title="Paramètres du compte">
      <div className="space-y-6">
        {/* Navigation rapide */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/account/security">
            <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
              <Shield className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold">Sécurité</h3>
              <p className="text-sm text-muted-foreground">Gérer la sécurité de votre compte</p>
            </Card>
          </Link>
          <Link to="/account/subscription">
            <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
              <CreditCard className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold">Abonnement & Crédits</h3>
              <p className="text-sm text-muted-foreground">Gérer vos crédits et abonnements</p>
            </Card>
          </Link>
          <Link to="/account/ads">
            <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
              <PlayCircle className="h-6 w-6 mb-2 text-primary" />
              <h3 className="font-semibold">Gagner des crédits</h3>
              <p className="text-sm text-muted-foreground">Regarder des publicités pour gagner des crédits</p>
            </Card>
          </Link>
        </div>

        {/* Informations du profil */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                defaultValue={profile?.full_name}
                onChange={(e) => handleUpdateProfile({ full_name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile?.email}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </Card>

        {/* Préférences */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Préférences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications sur les nouvelles fonctionnalités
                </p>
              </div>
              <Switch
                checked={profile?.notifications_enabled}
                onCheckedChange={(checked) => 
                  handleUpdateProfile({ notifications_enabled: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Emails marketing</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des emails sur les offres et nouveautés
                </p>
              </div>
              <Switch
                checked={profile?.marketing_emails_enabled}
                onCheckedChange={(checked) => 
                  handleUpdateProfile({ marketing_emails_enabled: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Suppression du compte */}
        <Card className="p-6 border-destructive">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-destructive">Zone dangereuse</h2>
              <p className="text-sm text-muted-foreground">
                La suppression de votre compte est irréversible
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              Supprimer le compte
            </Button>
            <DeleteAccountModal 
              open={showDeleteModal}
              onOpenChange={setShowDeleteModal}
            />
          </div>
        </Card>
      </div>
    </AccountLayout>
  );
};
