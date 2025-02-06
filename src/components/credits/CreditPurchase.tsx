import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Sparkles, Check } from "lucide-react";
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase/client';

interface CreditPack {
  id: string;
  name: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
}

const creditPacks: CreditPack[] = [
  {
    id: 'pack_debutant',
    name: 'Pack Débutant',
    credits: 100,
    price: 4.99,
    pricePerCredit: 0.050,
  },
  {
    id: 'pack_populaire',
    name: 'Pack Populaire',
    credits: 500,
    price: 19.99,
    pricePerCredit: 0.040,
    popular: true,
  },
  {
    id: 'pack_pro',
    name: 'Pack Pro',
    credits: 1200,
    price: 39.99,
    pricePerCredit: 0.033,
  },
];

interface CreditPurchaseProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const CreditPurchase = ({ userId, onSuccess, onError }: CreditPurchaseProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handlePurchase = async (pack: CreditPack) => {
    try {
      setIsLoading(true);

      // Create Stripe checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          userId,
          packId: pack.id,
          credits: pack.credits,
          amount: Math.round(pack.price * 100), // Convert to cents
          successUrl: `${window.location.origin}/account/subscription?success=true`,
          cancelUrl: `${window.location.origin}/account/subscription?success=false`,
        }
      });

      if (error) throw error;

      const stripeInstance = await stripe.catch(error => {
        toast({
          variant: "destructive",
          title: "Erreur de configuration",
          description: error.message
        });
        throw error;
      });

      const { error: stripeError } = await stripeInstance.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (stripeError) throw stripeError;

      onSuccess?.();
    } catch (err) {
      console.error('Error purchasing credits:', err);
      const error = err instanceof Error ? err : new Error('Erreur lors de l\'achat');
      onError?.(error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'achat des crédits"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 p-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {creditPacks.map((pack) => (
          <Card
            key={pack.id}
            className={`relative p-6 flex flex-col justify-between space-y-4 overflow-hidden transition-all duration-200 hover:shadow-lg ${
              pack.popular ? 'border-primary/50 bg-primary/5' : ''
            }`}
          >
            {pack.popular && (
              <Badge
                className="absolute top-0 right-0 translate-x-2 -translate-y-2 bg-primary text-white px-3 py-1 rounded-full"
              >
                Populaire
              </Badge>
            )}
            <div className="space-y-2">
              <h3 className="text-xl font-bold">{pack.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{pack.price}€</span>
                <span className="text-sm text-muted-foreground">
                  ({pack.pricePerCredit.toFixed(3)}€/crédit)
                </span>
              </div>
              <div className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>{pack.credits} crédits</span>
              </div>
              <ul className="space-y-2 mt-4">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Utilisable immédiatement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Sans engagement</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Paiement sécurisé</span>
                </li>
              </ul>
            </div>
            <Button
              className="w-full mt-4"
              onClick={() => handlePurchase(pack)}
              disabled={isLoading}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Acheter
            </Button>
          </Card>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Paiement sécurisé par Stripe. Les crédits seront ajoutés instantanément après l'achat.
      </p>
    </div>
  );
};
