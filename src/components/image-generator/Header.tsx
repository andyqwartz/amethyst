import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { HelpCircle, Sparkles, User as UserIcon, LogIn } from 'lucide-react';
import { ProfileModal } from './modals/ProfileModal';
import { HelpModal } from './modals/HelpModal';
import useModalStore, { ModalId } from '@/state/modalStore';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { user } = useAuth();
  const { openModal } = useModalStore();
  const navigate = useNavigate();

  const handleHelpClick = () => {
    openModal(ModalId.HELP, {
      type: ModalId.HELP,
      data: {
        section: 'usage'
      }
    });
  };

  const handleProfileClick = () => {
    if (user) {
      setShowProfileModal(true);
    } else {
      navigate('/auth');
    }
  };

  return (
    <>
      <div className="relative p-4 sm:p-6 flex justify-center items-center">
        <div className="absolute left-4 sm:left-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleProfileClick}
            className="relative hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 hover-scale touch-manipulation rounded-xl"
          >
            {user ? (
              <UserIcon className="h-5 w-5 text-primary" />
            ) : (
              <LogIn className="h-5 w-5 text-primary" />
            )}
          </Button>
        </div>

        <div 
          className="flex items-center gap-3 sm:gap-4 cursor-pointer hover:scale-[1.02] transition-all duration-500 group"
          onClick={() => window.location.reload()}
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
        
        <div className="absolute right-4 sm:right-6">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleHelpClick}
            className="relative hover:bg-primary/10 active:bg-primary/20 transition-all duration-300 hover-scale touch-manipulation rounded-xl"
          >
            <HelpCircle className="h-5 w-5 text-primary" />
          </Button>
        </div>
      </div>

      <ProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
      />
      
      <HelpModal 
        open={false} 
        onOpenChange={() => {}} 
      />
    </>
  );
};