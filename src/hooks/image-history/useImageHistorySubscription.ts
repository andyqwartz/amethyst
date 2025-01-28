import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useImageHistorySubscription = (fetchHistory: () => Promise<void>) => {
  useEffect(() => {
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchHistory();
      }
    });

    const channel = supabase
      .channel('images_changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'images'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      authSubscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchHistory]);
};