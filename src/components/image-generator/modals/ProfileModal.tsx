import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import { UserProfile } from "@/components/ui/user-profile";
import { supabase } from "@/lib/supabase/client";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileModal = ({
  open,
  onOpenChange
}: ProfileModalProps) => {
  const [userData, setUserData] = useState<any>(null);

  // Mock user data match
  const mockUser = {
    name: "Utilisateur",
    email: "utilisateur@example.com",
    avatarUrl: undefined,
    joinDate: new Date("2023-01-01"),
    credits: 100,
    membershipType: "Gratuit",
    totalGenerations: 0,
    lastActive: new Date(),
    preferences: {
      language: "Français",
      notifications: true,
      newsletter: false
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (!error && profile) {
          setUserData({
            name: profile.full_name || session.user.email?.split('@')[0] || "Utilisateur",
            email: session.user.email || "utilisateur@example.com",
            avatarUrl: profile.avatar_url,
            joinDate: new Date(session.user.created_at),
            credits: profile.credits || 0,
            membershipType: profile.membership_type || "Gratuit",
            totalGenerations: profile.total_generations || 0,
            lastActive: new Date(profile.last_active || session.user.last_sign_in_at),
            preferences: {
              language: profile.language || "Français",
              notifications: profile.notifications_enabled || false,
              newsletter: profile.newsletter_subscribed || false
            }
          });
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="w-screen h-screen max-w-none m-0 p-0 bg-black/30 backdrop-blur-xl"
      >
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
              <UserProfile user={userData || mockUser} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 
