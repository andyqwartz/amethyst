import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface CreditTransaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  metadata: any;
}

export interface SubscriptionHistory {
  id: string;
  tier: string;
  status: string;
  start_date: string;
  end_date: string | null;
  payment_method: string;
  amount: number;
  currency: string;
  metadata: any;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  negative_prompt: string;
  public_url: string;
  created_at: string;
  width: number;
  height: number;
  status: string;
}

export interface ReferenceImage {
  id: string;
  original_filename: string;
  public_url: string;
  created_at: string;
  last_used_at: string;
  usage_count: number;
}

export const useProfileHistory = (userId: string | undefined) => {
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState<SubscriptionHistory[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        // Fetch credit transactions
        const { data: creditData, error: creditError } = await supabase
          .from('credit_transactions')
          .select('*')
          .eq('profile_id', userId)
          .order('created_at', { ascending: false });

        if (creditError) throw creditError;
        setCreditTransactions(creditData);

        // Fetch subscription history
        const { data: subData, error: subError } = await supabase
          .from('subscription_history')
          .select('*')
          .eq('profile_id', userId)
          .order('start_date', { ascending: false });

        if (subError) throw subError;
        setSubscriptionHistory(subData);

        // Fetch generated images
        const { data: genData, error: genError } = await supabase
          .from('generated_images')
          .select('id, prompt, negative_prompt, public_url, created_at, width, height, status')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (genError) throw genError;
        setGeneratedImages(genData);

        // Fetch reference images
        const { data: refData, error: refError } = await supabase
          .from('reference_images')
          .select('id, original_filename, public_url, created_at, last_used_at, usage_count')
          .eq('user_id', userId)
          .order('last_used_at', { ascending: false });

        if (refError) throw refError;
        setReferenceImages(refData);

      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const deleteReferenceImage = async (imageId: string) => {
    if (!userId) return;

    try {
      // Delete from active_reference_images first
      const { error: activeError } = await supabase
        .from('active_reference_images')
        .delete()
        .eq('image_id', imageId);

      if (activeError) throw activeError;

      // Then delete from reference_images
      const { error: refError } = await supabase
        .from('reference_images')
        .delete()
        .eq('id', imageId);

      if (refError) throw refError;

      // Update local state
      setReferenceImages(prev => prev.filter(img => img.id !== imageId));

    } catch (err) {
      console.error('Error deleting reference image:', err);
      throw err;
    }
  };

  return {
    creditTransactions,
    subscriptionHistory,
    generatedImages,
    referenceImages,
    isLoading,
    error,
    deleteReferenceImage
  };
};
