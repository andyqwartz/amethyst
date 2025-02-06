import { AccountLayout } from './AccountLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { CreditCard, Gift, History, Sparkles, Youtube } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CreditDialog } from '@/components/credits/CreditDialog';
import { AdViewer } from '@/components/credits/AdViewer';

export const SubscriptionPage = () => {
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [showCreditDialog, setShowCreditDialog] = useState(false);
  const [showAdViewer, setShowAdViewer] = useState(false);

  const canWatchAd = (profile?.ads_watched_today || 0) < (profile?.daily_ads_limit || 10);

  const handleAdComplete = async () => {
    setShowAdViewer(false);
    // Refresh profile data to get updated credit balance
    updateProfile({});
  };

  const handleManageSubscription = async () => {
    if (!profile?.stripe_customer_id) {
      toast({
        title: "Erreur",
        description: "Vous devez d'abord acheter des crédits pour créer un compte client",
        variant: "destructive"
      });
      return;
    }

    // Rediriger vers le portail client Stripe
    toast({
      title: "Redirection",
      description: "Vous allez être redirigé vers le portail de gestion d'abonnement"
    });
  };

  return (
    <AccountLayout title="Abonnement & Crédits">
      <div className="space-y-6">
        {/* Abonnement actuel */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Abonnement actuel</h2>
              <p className="text-sm text-muted-foreground">
                Gérez votre abonnement et vos options de paiement
              </p>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {profile?.subscription_tier || 'Standard'}
            </Badge>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary" />
                <div className="space-y-1">
                  <p className="font-medium">Moyen de paiement</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.stripe_customer_id ? 'Carte enregistrée' : 'Aucun moyen de paiement'}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleManageSubscription}
                disabled={!profile?.stripe_customer_id}
              >
                Gérer
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                <div className="space-y-1">
                  <p className="font-medium">Renouvellement</p>
                  <p className="text-sm text-muted-foreground">
                    {profile?.subscription_end_date ? 
                      `Le ${new Date(profile.subscription_end_date).toLocaleDateString()}` : 
                      'Pas d\'abonnement actif'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Crédits */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Crédits</h2>
              <p className="text-sm text-muted-foreground">
                Gérez vos crédits et options d'achat
              </p>
            </div>
            <Button onClick={() => setShowCreditDialog(true)}>
              Acheter des crédits
            </Button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="p-4">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold">{profile?.credits_balance}</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">Crédits disponibles</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Gift className="w-4 h-4" />
                <span className="font-semibold">{profile?.lifetime_credits}</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">Crédits totaux</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Youtube className="w-4 h-4" />
                <span className="font-semibold">{profile?.ads_credits_earned}</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">Crédits gagnés (pubs)</p>
            </Card>
          </div>
        </Card>

        {/* Publicités */}
        {profile?.ads_enabled && (
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Gagner des crédits</h2>
                <p className="text-sm text-muted-foreground">
                  Regardez des publicités pour gagner des crédits gratuits
                </p>
              </div>
              <Button
                onClick={() => setShowAdViewer(true)}
                disabled={!canWatchAd}
              >
                Regarder une pub (+5 crédits)
              </Button>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  Publicités aujourd'hui
                </span>
                <span className="text-sm text-muted-foreground">
                  {profile.ads_watched_today}/{profile.daily_ads_limit}
                </span>
              </div>
              <Progress 
                value={(profile.ads_watched_today / profile.daily_ads_limit) * 100} 
                className="h-2"
              />
              {!canWatchAd && (
                <p className="text-sm text-muted-foreground mt-2">
                  Limite quotidienne atteinte. Revenez demain !
                </p>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Credit Dialog */}
      <CreditDialog
        userId={profile?.id}
        open={showCreditDialog}
        onOpenChange={setShowCreditDialog}
        onSuccess={() => {
          updateProfile({});
        }}
      />

      {/* Ad Viewer */}
      {showAdViewer && profile?.id && (
        <AdViewer
          userId={profile.id}
          onComplete={handleAdComplete}
          onError={() => setShowAdViewer(false)}
        />
      )}
    </AccountLayout>
  );
};
