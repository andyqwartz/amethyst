import React from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Users, Image as ImageIcon, BarChart, Settings, Bell, RefreshCw } from 'lucide-react';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onRefresh: () => void;
  onOpenSettings: () => void;
  isLoading?: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  activeTab,
  onTabChange,
  onRefresh,
  onOpenSettings,
  isLoading,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1D27] border-t border-white/10 p-2 flex justify-around items-center lg:hidden">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onTabChange('users')}
        className={`flex flex-col items-center gap-1 h-16 ${
          activeTab === 'users' ? 'text-primary' : 'text-white/70'
        }`}
      >
        <Users className="h-5 w-5" />
        <span className="text-xs">Utilisateurs</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onTabChange('images')}
        className={`flex flex-col items-center gap-1 h-16 ${
          activeTab === 'images' ? 'text-primary' : 'text-white/70'
        }`}
      >
        <ImageIcon className="h-5 w-5" />
        <span className="text-xs">Images</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onTabChange('stats')}
        className={`flex flex-col items-center gap-1 h-16 ${
          activeTab === 'stats' ? 'text-primary' : 'text-white/70'
        }`}
      >
        <BarChart className="h-5 w-5" />
        <span className="text-xs">Stats</span>
      </Button>

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex flex-col items-center gap-1 h-16 text-white/70"
          >
            <Menu className="h-5 w-5" />
            <span className="text-xs">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-[#1A1D27] border-white/10 p-0">
          <div className="flex flex-col h-full">
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">Menu</h2>
              </div>
              <div className="p-6 space-y-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white"
                  onClick={onOpenSettings}
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Paramètres
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white/70 hover:text-white"
                  onClick={onRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-sm text-white/50 mb-4">Notifications</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="text-sm">Nouvel utilisateur</div>
                      <div className="text-xs text-white/50">Il y a 5 min</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="text-sm">Génération échouée</div>
                      <div className="text-xs text-white/50">Il y a 15 min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
