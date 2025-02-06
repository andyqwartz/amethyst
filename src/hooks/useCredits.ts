import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from './use-toast';

interface Profile {
  id: string;
  credits_balance: number;
  lifetime_credits: number;
  ads_watched_today: number;
  daily_ads_limit: number;
  ads_credits_earned: number;
  ads_last_watched?: string;
}

interface CreditTransaction {
  amount: number;
  type: 'purchase' | 'ad_reward' | 'generation' | 'refund';
  description?: string;
  metadata?: Record<string, any>;
}

interface AdView {
  ad_id: string;
  view_duration: number;
  completed: boolean;
  credits_earned: number;
  metadata?: Record<string, any>;
}

export const useCredits = (userId?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [lifetimeCredits, setLifetimeCredits] = useState(0);
  const [adWatchedToday, setAdWatchedToday] = useState(0);
  const { toast } = useToast();

  const fetchCreditBalance = useCallback(async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits_balance, lifetime_credits, ads_watched_today')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setBalance(data.credits_balance);
      setLifetimeCredits(data.lifetime_credits);
      setAdWatchedToday(data.ads_watched_today);
    } catch (err) {
      console.error('Error fetching credit balance:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger votre solde de crédits"
      });
    }
  }, [userId, toast]);

  const recordTransaction = async (transaction: CreditTransaction) => {
    if (!userId) return;
    setIsLoading(true);

    try {
      // Start a Supabase transaction
      const { data: { credits_balance }, error: balanceError } = await supabase
        .from('profiles')
        .select('credits_balance')
        .eq('id', userId)
        .single();

      if (balanceError) throw balanceError;

      const newBalance = credits_balance + transaction.amount;
      
      if (newBalance < 0) {
        throw new Error('Solde insuffisant');
      }

      // Update profile balance
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          credits_balance: newBalance,
          lifetime_credits: transaction.amount > 0 ? lifetimeCredits + transaction.amount : lifetimeCredits,
          last_credit_update: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Record the transaction
      const { error: transactionError } = await supabase
        .from('credits_transactions')
        .insert({
          profile_id: userId,
          amount: transaction.amount,
          type: transaction.type,
          description: transaction.description,
          metadata: transaction.metadata
        });

      if (transactionError) throw transactionError;

      // Update local state
      setBalance(newBalance);
      if (transaction.amount > 0) {
        setLifetimeCredits(prev => prev + transaction.amount);
      }

      toast({
        title: "Succès",
        description: transaction.amount > 0 
          ? `${transaction.amount} crédits ajoutés à votre compte`
          : `${Math.abs(transaction.amount)} crédits utilisés`
      });

    } catch (err) {
      console.error('Error recording transaction:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de la transaction"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const recordAdView = async (adView: AdView) => {
    if (!userId) return;
    setIsLoading(true);

    try {
      // Check daily ad limit
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('ads_watched_today, daily_ads_limit, ads_credits_earned')
        .eq('id', userId)
        .single();

      if (profileError || !profile) throw profileError;

      const profileData = profile as Profile;
      if (profileData.ads_watched_today >= profileData.daily_ads_limit) {
        throw new Error('Limite quotidienne de publicités atteinte');
      }

      // Record ad view
      const { error: viewError } = await supabase
        .from('ad_views')
        .insert({
          profile_id: userId,
          ad_id: adView.ad_id,
          view_duration: adView.view_duration,
          completed: adView.completed,
          credits_earned: adView.credits_earned,
          metadata: adView.metadata
        });

      if (viewError) throw viewError;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ads_watched_today: profileData.ads_watched_today + 1,
          ads_credits_earned: (profileData.ads_credits_earned || 0) + adView.credits_earned,
          ads_last_watched: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Add credits
      await recordTransaction({
        amount: adView.credits_earned,
        type: 'ad_reward',
        description: 'Crédits gagnés en regardant une publicité',
        metadata: { ad_id: adView.ad_id }
      });

      setAdWatchedToday(prev => prev + 1);

    } catch (err) {
      console.error('Error recording ad view:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: err instanceof Error ? err.message : "Erreur lors de l'enregistrement de la publicité"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseCredits = async (amount: number, price: number) => {
    if (!userId) return;
    setIsLoading(true);

    try {
      // TODO: Implement Stripe payment
      // For now, just add the credits directly
      await recordTransaction({
        amount,
        type: 'purchase',
        description: `Achat de ${amount} crédits`,
        metadata: { price }
      });

    } catch (err) {
      console.error('Error purchasing credits:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de l'achat des crédits"
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const useCredits = async (amount: number, description: string, metadata?: Record<string, any>) => {
    if (!userId) return;

    try {
      await recordTransaction({
        amount: -amount,
        type: 'generation',
        description,
        metadata
      });
      return true;
    } catch (err) {
      return false;
    }
  };

  return {
    balance,
    lifetimeCredits,
    adWatchedToday,
    isLoading,
    fetchCreditBalance,
    recordAdView,
    purchaseCredits,
    useCredits
  };
};
