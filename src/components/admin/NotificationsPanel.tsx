import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Bell } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export interface Notification {
  id: string;
  type: 'user' | 'generation' | 'system';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  onClearAll: () => void;
  onClearNotification: (id: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  onClearAll,
  onClearNotification,
}) => {
  return (
    <div className="flex flex-col h-full">
      <DialogHeader>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-white" />
            <DialogTitle className="text-lg font-semibold text-white">Notifications</DialogTitle>
          </div>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-white/70 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <DialogDescription className="sr-only">
          Centre de notifications avec les derniers événements
        </DialogDescription>
      </DialogHeader>
      <div className="p-4 flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-white/50">
            Aucune notification
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg group"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">
                    {notification.message}
                  </div>
                  <div className="text-xs text-white/50">
                    {formatDistanceToNow(notification.timestamp, {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClearNotification(notification.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-white/70 hover:text-white"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
