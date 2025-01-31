import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle, Sparkles, User, LogIn } from 'lucide-react';
import { ProfileModal } from './modals/ProfileModal';
import { supabase } from "@/integrations/supabase/client";

interface HeaderProps {
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

export const Header = ({
  onSettingsClick,
  onHelpClick
}: HeaderProps) => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="relative p-4 sm:p-6 flex justify-center items-center">
        <div className="absolute left-4 sm:left-6 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-500 group">
          <div className="absolute inset-[-1rem] bg-transparent"></div>
          {user ? (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowProfileModal(true)}
              className="relative hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 hover-scale touch-manipulation rounded-xl"
            >
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 group-active:bg-primary/20 blur transition-all duration-300 rounded-xl"></div>
              <User className="h-5 w-5 text-primary relative z-10" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleSignIn}
              className="relative hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 hover-scale touch-manipulation rounded-xl"
            >
              <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 group-active:bg-primary/20 blur transition-all duration-300 rounded-xl"></div>
              <LogIn className="h-5 w-5 text-primary relative z-10" />
            </Button>
          )}
        </div>

        <div 
          className="flex items-center gap-3 sm:gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-500 group"
          onClick={handleLogoClick}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl animate-pulse rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            <Sparkles className="h-9 w-9 sm:h-12 sm:w-12 text-primary relative animate-pulse group-hover:animate-[pulse_2s_ease-in-out_infinite]" />
          </div>
          <div className="flex flex-col items-start">
            <h1 className="text-3xl sm:text-5xl font-bold font-outfit title-gradient tracking-tight group-hover:tracking-normal transition-all duration-500">
              Amethyst
            </h1>
          </div>
        </div>
        
        <div className="absolute right-4 sm:right-6 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-500 group">
          <div className="absolute inset-[-1rem] bg-transparent"></div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onHelpClick}
            className="relative hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 hover-scale touch-manipulation rounded-xl"
          >
            <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 group-active:bg-primary/20 blur transition-all duration-300 rounded-xl"></div>
            <HelpCircle className="h-5 w-5 text-primary relative z-10" />
          </Button>
        </div>
      </div>

      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
    </>
  );
};
