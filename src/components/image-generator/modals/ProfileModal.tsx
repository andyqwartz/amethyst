import React, { useEffect, useState } from 'react';
import ModalComponent from "@/components/ModalComponent";
import { UserProfile } from "@/components/ui/user-profile";
import { supabase } from "@/integrations/supabase/client";

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileModal = ({
  open,
  onOpenChange
}: ProfileModalProps) => {
  const [userData, setUserData] = useState<any>(null);

  // Mock user data matching UserProfile interface
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
    <ModalComponent
      open={open}
      onClose={() => onOpenChange(false)}
      fullScreen
      disableBackdropClick={false}
    >
      <div className="max-w-4xl w-full mx-auto pt-12">
        <UserProfile user={userData || mockUser} />
      </div>
    </ModalComponent>
  );
}; 
