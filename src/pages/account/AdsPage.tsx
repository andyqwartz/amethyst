import { AccountLayout } from './AccountLayout';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProfile } from '@/hooks/useProfile';
import { useState } from 'react';
import { Youtube, Gift, Clock, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AdViewer } from '@/components/credits/AdViewer';

export const AdsPage = () => {
  const { profile, updateProfile } = useProfile();
  const [showAdViewer, setShowAdViewer] = useState(false);

  const canWatchAd = (profile?.ads_watched_today || 0) < (profile?.daily_ads_limit || 10);
  const progressPercentage = ((profile?.ads_watched_today || 0) / (profile?.daily_ads_limit || 10)) * 100;

  const handleAdComplete = async () => {
    setShowAdViewer(false);
    // Refresh profile data to get updated credit balance
    updateProfile({});
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!profile?.ads_enabled) {
    return (
      <AccountLayout title="Gagner des crédits">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <AlertTriangle className="w-12 h-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Publicités désactivées</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Vous devez activer les publicités dans vos paramètres de compte pour gagner des crédits gratuits.
            </p>
            <Button variant="outline" onClick={() => window.location.href = '/account/settings'}>
              Aller aux paramètres
            </Button>
          </div>
        </Card>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout title="Gagner des crédits">
      <div className="space-y-6">
        {/* État actuel */}
        <Card className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-accent/50 rounded-lg">
              <Youtube className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-bold">{profile.ads_watched_today}</span>
              <span className="text-sm text-muted-foreground text-center">
                Publicités vues aujourd'hui
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-accent/50 rounded-lg">
              <Gift className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-bold">{profile.ads_credits_earned}</span>
              <span className="text-sm text-muted-foreground text-center">
                Crédits gagnés au total
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-4 space-y-2 bg-accent/50 rounded-lg">
              <Clock className="w-8 h-8 text-primary mb-2" />
              <span className="text-2xl font-bold">{getTimeUntilReset()}</span>
              <span className="text-sm text-muted-foreground text-center">
                Avant réinitialisation
              </span>
            </div>
          </div>
        </Card>

        {/* Progression */}
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Progression quotidienne</h2>
                <p className="text-sm text-muted-foreground">
                  {canWatchAd ? 
                    `Il vous reste ${profile.daily_ads_limit - profile.ads_watched_today} publicités à regarder aujourd'hui` :
                    'Vous avez atteint votre limite quotidienne'
                  }
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => setShowAdViewer(true)}
                disabled={!canWatchAd}
              >
                Regarder une publicité
                <span className="ml-2 text-xs bg-primary/20 px-2 py-1 rounded-full">
                  +5 crédits
                </span>
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{profile.ads_watched_today} vues</span>
                <span>{profile.daily_ads_limit} maximum</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              {!canWatchAd && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Revenez demain pour gagner plus de crédits !
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Comment ça marche */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Comment ça marche ?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Regardez des publicités</p>
                <p className="text-sm text-muted-foreground">
                  Visionnez des publicités courtes et gagnez des crédits
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Gagnez des crédits</p>
                <p className="text-sm text-muted-foreground">
                  Recevez 5 crédits pour chaque publicité regardée
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Limite quotidienne</p>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez regarder jusqu'à {profile.daily_ads_limit} publicités par jour
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

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
