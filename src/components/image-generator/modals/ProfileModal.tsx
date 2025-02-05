import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { UserProfile } from "@/components/ui/user-profile";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from '@/hooks/use-auth';
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
            notifications_enabled,
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
