import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Shield, LogOut, RefreshCw, Bell } from 'lucide-react';
import NotificationsPanel from './NotificationsPanel';
import { useNotifications } from '@/hooks/useNotifications';

interface AdminHeaderProps {
  onRefresh: () => void;
  onSignOut: () => void;
  isLoading: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  onRefresh,
  onSignOut,
  isLoading,
}) => {
  const [isRefreshBarOpen, setIsRefreshBarOpen] = useState(false);
  const isMobile = useIsMobile();
  const { notifications, clearNotification, clearAllNotifications } = useNotifications();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed top-0 left-0 right-0 bg-[#1A1D27] border-b border-white/10 z-50">
      <div className="container mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-white" />
            <h1 className="text-lg font-bold text-white hidden sm:block">
              Administration
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRefreshBarOpen(!isRefreshBarOpen)}
              className="text-white/70 hover:text-white lg:hidden"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onRefresh}
              disabled={isLoading}
              className="text-white/70 hover:text-white hidden lg:flex"
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white/70 hover:text-white relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[400px] bg-[#1A1D27] border-white/10 p-0"
                role="dialog"
                aria-label="Notifications"
              >
                <NotificationsPanel
                  notifications={notifications}
                  onClearAll={clearAllNotifications}
                  onClearNotification={clearNotification}
                />
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              size="sm"
              onClick={onSignOut}
              className="text-white/70 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span className="hidden sm:inline ml-2">Déconnexion</span>
            </Button>
          </div>
        </div>

        {/* Refresh Bar - Mobile */}
        {isRefreshBarOpen && (
          <div className="p-4 border-t border-white/10 lg:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="w-full text-white border-white/20 hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Actualisation...' : 'Actualiser les données'}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminHeader;
