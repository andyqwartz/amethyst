import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeSubscription = (onUpdate: () => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('images_changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'images'
        },
        () => onUpdate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};