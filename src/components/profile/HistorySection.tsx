import React from 'react';
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Image as ImageIcon, 
  Download, 
  Trash2, 
  ExternalLink,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { 
  CreditTransaction, 
  SubscriptionHistory, 
  GeneratedImage, 
  ReferenceImage 
} from '@/hooks/useProfileHistory';

interface HistorySectionProps {
  creditTransactions: CreditTransaction[];
  subscriptionHistory: SubscriptionHistory[];
  generatedImages: GeneratedImage[];
  referenceImages: ReferenceImage[];
  onDeleteReferenceImage: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export const HistorySection = ({
  creditTransactions,
  subscriptionHistory,
  generatedImages,
  referenceImages,
  onDeleteReferenceImage,
  isLoading
}: HistorySectionProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency?: string) => {
    if (currency) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
    return amount.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Tabs defaultValue="credits" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="credits">Crédits</TabsTrigger>
        <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
        <TabsTrigger value="generated">Images générées</TabsTrigger>
        <TabsTrigger value="references">Images de référence</TabsTrigger>
      </TabsList>

      <TabsContent value="credits">
        <Card className="p-4">
          <ScrollArea className="h-[400px]">
            {creditTransactions.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                Aucune transaction
              </div>
            ) : (
              <div className="space-y-4">
                {creditTransactions.map((transaction) => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant={transaction.amount > 0 ? "default" : "destructive"}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount} crédits
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </TabsContent>

      <TabsContent value="subscriptions">
        <Card className="p-4">
          <ScrollArea className="h-[400px]">
            {subscriptionHistory.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                Aucun abonnement
              </div>
            ) : (
              <div className="space-y-4">
                {subscriptionHistory.map((subscription) => (
                  <div 
                    key={subscription.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{subscription.tier}</p>
                          <Badge>{subscription.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Du {formatDate(subscription.start_date)}
                          {subscription.end_date && ` au ${formatDate(subscription.end_date)}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatAmount(subscription.amount, subscription.currency)} • {subscription.payment_method}
                        </p>
                      </div>
                    </div>
                    {subscription.status === 'active' && (
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Gérer
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </TabsContent>

      <TabsContent value="generated">
        <Card className="p-4">
          <ScrollArea className="h-[400px]">
            {generatedImages.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                Aucune image générée
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {generatedImages.map((image) => (
                  <div 
                    key={image.id}
                    className="relative group"
                  >
                    <img 
                      src={image.public_url} 
                      alt={image.prompt}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-white line-clamp-2">{image.prompt}</p>
                        {image.negative_prompt && (
                          <p className="text-sm text-red-400 line-clamp-1">
                            Négatif: {image.negative_prompt}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-white/80">
                          {formatDate(image.created_at)}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => window.open(image.public_url, '_blank')}
                        >
                          <Download className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </TabsContent>

      <TabsContent value="references">
        <Card className="p-4">
          <ScrollArea className="h-[400px]">
            {referenceImages.length === 0 ? (
              <div className="text-center text-muted-foreground p-4">
                Aucune image de référence
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {referenceImages.map((image) => (
                  <div 
                    key={image.id}
                    className="relative group"
                  >
                    <img 
                      src={image.public_url} 
                      alt={image.original_filename}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg p-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-white line-clamp-2">{image.original_filename}</p>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <Clock className="w-3 h-3" />
                          Dernière utilisation: {formatDate(image.last_used_at)}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <RefreshCw className="w-3 h-3" />
                          Utilisée {image.usage_count} fois
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDeleteReferenceImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>
      </TabsContent>
    </Tabs>
  );
};
