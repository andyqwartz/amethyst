import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Database,
  RefreshCw,
  Shield,
  AlertTriangle,
  Settings,
  Trash,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SettingsPageProps {
  onClose: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  onClose
}) => {
  const { toast } = useToast();
  const [isMaintenanceMode, setIsMaintenanceMode] = React.useState(false);
  const [isLoggingEnabled, setIsLoggingEnabled] = React.useState(true);

  const handleClearCache = async () => {
    try {
      // Implement cache clearing logic here
      toast({
        title: "Cache vidé",
        description: "Le cache du système a été vidé avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de vider le cache"
      });
    }
  };

  const handleClearLogs = async () => {
    try {
      // Implement log clearing logic here
      toast({
        title: "Logs effacés",
        description: "Les logs du système ont été effacés avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'effacer les logs"
      });
    }
  };

  const handleBackupDatabase = async () => {
    try {
      // Implement database backup logic here
      toast({
        title: "Sauvegarde effectuée",
        description: "La base de données a été sauvegardée avec succès"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de sauvegarder la base de données"
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Paramètres système</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white/70 hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* System Status */}
      <Card className="bg-[#1A1D27] border-white/10 p-6">
        <h3 className="text-lg font-semibold mb-4">État du système</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mode maintenance</Label>
              <div className="text-sm text-white/50">Activer le mode maintenance</div>
            </div>
            <Switch
              checked={isMaintenanceMode}
              onCheckedChange={setIsMaintenanceMode}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Journalisation</Label>
              <div className="text-sm text-white/50">Activer la journalisation système</div>
            </div>
            <Switch
              checked={isLoggingEnabled}
              onCheckedChange={setIsLoggingEnabled}
            />
          </div>
        </div>
      </Card>

      {/* Maintenance */}
      <Card className="bg-[#1A1D27] border-white/10 p-6">
        <h3 className="text-lg font-semibold mb-4">Maintenance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cache système</Label>
              <div className="text-sm text-white/50">Vider le cache du système</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCache}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Vider
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Logs système</Label>
              <div className="text-sm text-white/50">Effacer les logs du système</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearLogs}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Trash className="h-4 w-4 mr-2" />
              Effacer
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Base de données</Label>
              <div className="text-sm text-white/50">Sauvegarder la base de données</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackupDatabase}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <Database className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </div>
      </Card>

      {/* System Info */}
      <Card className="bg-[#1A1D27] border-white/10 p-6">
        <h3 className="text-lg font-semibold mb-4">Informations système</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Base de données</span>
            <span className="text-green-500">Connectée</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Dernier backup</span>
            <span>Il y a 2 heures</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Espace disque</span>
            <span>45% utilisé</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
