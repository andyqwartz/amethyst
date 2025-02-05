<<<<<<< HEAD
import React, { useEffect, useState, useCallback } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
import {
  Dialog,
  DialogContent,
  DialogClose,
<<<<<<< HEAD
=======
  DialogTitle,
  DialogDescription,
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { UserProfile } from "@/components/ui/user-profile";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from '@/hooks/use-auth';
<<<<<<< HEAD
=======
import { useNavigate } from 'react-router-dom';
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
import { useToast } from '@/hooks/use-toast';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UserData {
  name: string;
  email: string;
  avatarUrl?: string;
  joinDate: Date;
  credits: number;
  membershipType: string;
  totalGenerations: number;
  lastActive: Date;
  preferences: {
    language: string;
    notifications: boolean;
    newsletter: boolean;
    ads_enabled: boolean;
  };
  auth_provider?: string;
  ads_watched_today?: number;
  daily_ads_limit?: number;
  ads_credits_earned?: number;
}

export const ProfileModal = ({
  open,
  onOpenChange
}: ProfileModalProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> a945a29ba778c4116754a03171a654de675e5402

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            id,
            full_name,
            email,
            avatar_url,
            created_at,
            last_sign_in_at,
            credits_balance,
            subscription_tier,
<<<<<<< HEAD
            notifications_enabled,
=======
            subscription_status,
            lifetime_credits,
            auth_provider,
            ads_enabled,
            ads_watched_today,
            daily_ads_limit,
            ads_credits_earned,
            notifications_enabled,
            marketing_emails_enabled,
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
            language
          `)
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setUserData({
            name: profile.full_name || user.email?.split('@')[0] || "Utilisateur",
            email: user.email || "utilisateur@example.com",
            avatarUrl: profile.avatar_url,
<<<<<<< HEAD
            joinDate: new Date(profile.created_at || Date.now()),
            credits: profile.credits_balance || 0,
            membershipType: profile.subscription_tier || "Gratuit",
            totalGenerations: 0, // lifetime_credits field removed
            lastActive: new Date(profile.last_sign_in_at || Date.now()),
            preferences: {
              language: profile.language || "Français",
              notifications: profile.notifications_enabled || false,
              newsletter: false,
              ads_enabled: true
=======
            joinDate: new Date(profile.created_at || user.created_at || Date.now()),
            credits: profile.credits_balance || 0,
            membershipType: profile.subscription_tier || "Gratuit",
            totalGenerations: profile.lifetime_credits || 0,
            lastActive: new Date(profile.last_sign_in_at || Date.now()),
            auth_provider: profile.auth_provider,
            ads_watched_today: profile.ads_watched_today || 0,
            daily_ads_limit: profile.daily_ads_limit || 10,
            ads_credits_earned: profile.ads_credits_earned || 0,
            preferences: {
              language: profile.language || "Français",
              notifications: profile.notifications_enabled || false,
              newsletter: profile.marketing_emails_enabled || false,
              ads_enabled: profile.ads_enabled || true
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
            }
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données utilisateur"
        });
      }
    };

    if (open) {
      fetchUserData();
    }
  }, [open, user, toast]);

<<<<<<< HEAD
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
        className="fixed top-0 left-0 w-screen h-screen max-w-none m-0 p-0 bg-black/30 backdrop-blur-xl"
        onClick={handleBackdropClick}
      >
        <DialogClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 rounded-full opacity-70 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
        </DialogClose>
        {/* Add user profile content here */}
      </DialogContent>
    </Dialog>
  );
};
=======
  const handleWatchAd = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('watch_ad', {
        profile_id: user.id,
        ad_id: 'rewarded_video',
        duration: 30
      });

      if (error) throw error;

      if (data) {
        toast({
          title: "Publicité visionnée",
          description: "5 crédits ont été ajoutés à votre compte"
        });
        // Rafraîchir les données utilisateur
        fetchUserData();
      }
    } catch (err) {
      console.error('Error watching ad:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de visionner la publicité"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-screen h-screen max-w-none m-0 p-0 bg-black/30 backdrop-blur-xl"
      >
        <DialogTitle className="sr-only">Profil Utilisateur</DialogTitle>
        <DialogDescription className="sr-only">
          Gérez votre profil et vos préférences
        </DialogDescription>
        
        <div className="max-w-4xl mx-auto h-full flex flex-col bg-background rounded-xl relative overflow-hidden">
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-50 rounded-full opacity-70 hover:opacity-100 hover:bg-primary/20 transition-all duration-200"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fermer</span>
            </Button>
          </DialogClose>

          <div className="flex-grow h-full overflow-auto">
            <div className="p-6">
              <UserProfile 
                user={userData} 
                onWatchAd={handleWatchAd}
                canWatchAd={userData?.ads_watched_today < (userData?.daily_ads_limit || 10)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
>>>>>>> a945a29ba778c4116754a03171a654de675e5402
