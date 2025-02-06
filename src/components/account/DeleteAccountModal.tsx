import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteAccountModal = ({ open, onOpenChange }: DeleteAccountModalProps) => {
  const [confirmation, setConfirmation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (confirmation !== 'SUPPRIMER') {
      toast({
        variant: "destructive",
        title: "Confirmation invalide",
        description: "Veuillez saisir SUPPRIMER pour confirmer"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Supprimer le compte via une fonction Edge
      const { error } = await supabase.functions.invoke('delete-account', {
        body: { userId: user?.id }
      });

      if (error) throw error;

      // Déconnexion et redirection
      await signOut();
      navigate('/');
      
      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le compte"
      });
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-destructive">Supprimer le compte</DialogTitle>
          <DialogDescription>
            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>
              Tapez <span className="font-semibold">SUPPRIMER</span> pour confirmer
            </Label>
            <Input
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="SUPPRIMER"
            />
          </div>
          
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Cette action supprimera :</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Votre profil et informations personnelles</li>
              <li>Vos images générées</li>
              <li>Votre historique de crédits</li>
              <li>Vos abonnements</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={isLoading || confirmation !== 'SUPPRIMER'}
          >
            {isLoading ? "Suppression..." : "Supprimer définitivement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
