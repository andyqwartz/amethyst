import { AccountLayout } from './AccountLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Shield, Key, AlertTriangle, Smartphone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const SecurityPage = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableTwoFactor = async () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'authentification à deux facteurs sera bientôt disponible",
    });
  };

  const handleChangePassword = async () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "Le changement de mot de passe sera bientôt disponible",
    });
  };

  return (
    <AccountLayout title="Sécurité">
      <div className="space-y-6">
        {/* État de la sécurité */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">État de la sécurité</h2>
              <p className="text-sm text-muted-foreground">
                Vérifiez l'état de sécurité de votre compte
              </p>
            </div>
            <Badge variant={profile?.email_verified ? "default" : "destructive"}>
              {profile?.email_verified ? "Sécurisé" : "Action requise"}
            </Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <span>Email vérifié</span>
              </div>
              {profile?.email_verified ? (
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  Vérifié
                </Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={() => {}}>
                  Vérifier l'email
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                <span>Authentification à deux facteurs</span>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEnableTwoFactor}
                disabled
              >
                Configurer
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                <span>Mot de passe</span>
              </div>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleChangePassword}
                disabled={profile?.auth_provider !== 'email'}
              >
                Changer
              </Button>
            </div>
          </div>
        </Card>

        {/* Méthodes de connexion */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Méthodes de connexion</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <div className="space-y-1">
                  <p className="font-medium">Email et mot de passe</p>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
              <Badge variant="outline">Principal</Badge>
            </div>

            {profile?.auth_provider === 'google' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                    />
                  </svg>
                  <div className="space-y-1">
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">Connecté</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-destructive" disabled>
                  Déconnecter
                </Button>
              </div>
            )}

            {/* Autres providers à implémenter */}
            <div className="flex items-center justify-between opacity-50">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.218.682-.485 0-.236-.009-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.068-.608.068-.608 1.003.07 1.532 1.03 1.532 1.03.892 1.53 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                <div className="space-y-1">
                  <p className="font-medium">GitHub</p>
                  <p className="text-sm text-muted-foreground">Non connecté</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" disabled>
                Connecter
              </Button>
            </div>
          </div>
        </Card>

        {/* Sessions actives */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Sessions actives</h2>
              <p className="text-sm text-muted-foreground">
                Gérez vos sessions de connexion actives
              </p>
            </div>
            <Button variant="outline" size="sm" disabled>
              Déconnecter toutes les sessions
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <div className="space-y-1">
                  <p className="font-medium">Session actuelle</p>
                  <p className="text-sm text-muted-foreground">
                    Dernière activité: {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant="outline">Actif</Badge>
            </div>
          </div>
        </Card>

        {/* Zone de danger */}
        <Card className="p-6 border-destructive">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-destructive">Zone dangereuse</h2>
              <p className="text-sm text-muted-foreground">
                Actions irréversibles pour votre compte
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <div className="space-y-1">
                  <p className="font-medium">Révoquer tous les accès</p>
                  <p className="text-sm text-muted-foreground">
                    Déconnecte toutes les sessions et révoque tous les tokens
                  </p>
                </div>
              </div>
              <Button variant="destructive" size="sm" disabled>
                Révoquer
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </AccountLayout>
  );
};
