import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/components/admin/NotificationsPanel';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Subscribe to realtime events
    const userSubscription = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
        addNotification({
          type: 'user',
          message: `Nouvel utilisateur : ${payload.new.email}`,
        });
      })
      .subscribe();

    const generationSubscription = supabase
      .channel('public:generated_images')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'generated_images'
        },
        (payload) => {
          if (payload.new.status === 'failed') {
            addNotification({
              type: 'generation',
              message: `Génération échouée pour l'utilisateur ${payload.new.user_id}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'generated_images'
        },
        (payload) => {
        if (payload.new.status === 'failed' && payload.old.status !== 'failed') {
          addNotification({
            type: 'generation',
            message: `Génération échouée pour l'utilisateur ${payload.new.user_id}`,
          });
        }
      })
      .subscribe();

    return () => {
      userSubscription.unsubscribe();
      generationSubscription.unsubscribe();
    };
  }, []);

  const addNotification = ({ type, message }: { type: Notification['type']; message: string }) => {
    const notification: Notification = {
      id: uuidv4(),
      type,
      message,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    clearNotification,
    clearAllNotifications,
  };
};
