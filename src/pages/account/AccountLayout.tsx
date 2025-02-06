import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface AccountLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AccountLayout = ({ children, title }: AccountLayoutProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Header avec bouton de fermeture */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <h1 className="text-xl font-semibold">{title}</h1>
          <div className="flex-1" />
          <button
            onClick={handleClose}
            className="rounded-full p-2.5 hover:bg-accent transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container max-w-screen-2xl py-6">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
};
