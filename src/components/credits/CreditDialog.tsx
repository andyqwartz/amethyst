import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditPurchase } from './CreditPurchase';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdViewer } from './AdViewer';

interface CreditDialogProps {
  userId?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const CreditDialog = ({ userId, open, onOpenChange, onSuccess }: CreditDialogProps) => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('purchase');

  // Handle Stripe success/cancel
  useEffect(() => {
    const success = searchParams.get('success');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      toast({
        title: "Paiement réussi !",
        description: "Vos crédits ont été ajoutés à votre compte",
      });
      onSuccess?.();
    } else if (success === 'false') {
      toast({
        variant: "destructive",
        title: "Paiement annulé",
        description: "Le paiement a été annulé. Aucun crédit n'a été débité.",
      });
    }
  }, [searchParams, toast, onSuccess]);

  const handlePurchaseError = (error: Error) => {
    console.error('Purchase error:', error);
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Une erreur est survenue lors de l'achat des crédits",
    });
  };

  const handleAdComplete = () => {
    toast({
      title: "Succès !",
      description: "Vous avez gagné 5 crédits en regardant la publicité",
    });
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] rounded-lg overflow-hidden bg-background/95 backdrop-blur-xl border-none p-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-background/50 pointer-events-none" />
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Obtenir des crédits</DialogTitle>
          <DialogDescription>
            Achetez des crédits ou regardez des publicités pour générer plus d'images
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="purchase" value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="purchase" className="rounded-full">
              Acheter des crédits
            </TabsTrigger>
            <TabsTrigger value="ads" className="rounded-full">
              Regarder une publicité
            </TabsTrigger>
          </TabsList>

          <TabsContent value="purchase" className="mt-0">
            {userId && (
              <CreditPurchase
                userId={userId}
                onSuccess={onSuccess}
                onError={handlePurchaseError}
              />
            )}
          </TabsContent>

          <TabsContent value="ads" className="mt-0">
            {userId && (
              <AdViewer
                userId={userId}
                onComplete={handleAdComplete}
                onError={() => setActiveTab('purchase')}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
