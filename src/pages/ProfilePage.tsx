import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile } from "@/components/ui/user-profile";
import { useAuth } from '@/hooks/use-auth';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleClose = () => {
    // If we came from somewhere else in the app, go back
    if (location.key !== "default") {
      navigate(-1);
    } else {
      // If we accessed the profile directly, go to home
      navigate('/');
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="w-screen h-[100dvh] max-w-none m-0 p-0 bg-background/80 backdrop-blur-xl border-none rounded-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/50 pointer-events-none" />
        <DialogTitle className="sr-only">Profil utilisateur</DialogTitle>
        <DialogDescription className="sr-only">
          Gérez votre profil, vos crédits et vos paramètres
        </DialogDescription>
        <UserProfile 
          user={user} 
          onSignOut={handleSignOut}
        />
      </DialogContent>
    </Dialog>
  );
}
