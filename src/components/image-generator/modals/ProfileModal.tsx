import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useRef } from 'react';
import { Settings, Shield, CreditCard, PlayCircle, X } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal = ({ onClose }: ProfileModalProps) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { signOut } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const menuItems = [
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Paramètres du compte",
      description: "Gérez vos informations personnelles",
      path: "/account/settings"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Sécurité",
      description: "Gérez la sécurité de votre compte",
      path: "/account/security"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Abonnement & Crédits",
      description: `${profile?.credits_balance || 0} crédits disponibles`,
      path: "/account/subscription"
    },
    {
      icon: <PlayCircle className="w-5 h-5" />,
      title: "Gagner des crédits",
      description: "Regarder des publicités pour gagner des crédits",
      path: "/account/ads"
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate('/auth');
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div 
        ref={modalRef}
        className="fixed right-4 top-16 z-50 w-full max-w-md rounded-lg border bg-background shadow-lg"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu du compte</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Informations de l'utilisateur */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {profile?.full_name?.[0] || profile?.email?.[0] || '?'}
              </span>
            </div>
            <div>
              <p className="font-medium">{profile?.full_name || 'Utilisateur'}</p>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
            </div>
          </div>

          {/* Menu */}
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                to={item.path}
                onClick={onClose}
              >
                <Card className="p-4 hover:bg-accent transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Déconnexion */}
          <div className="pt-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
