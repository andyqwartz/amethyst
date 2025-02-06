import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  User,
  Mail,
  Phone,
  Upload,
  Shield,
  Bell,
  Globe,
  Youtube,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Profile } from '@/hooks/useProfile';

interface SettingsSectionProps {
  profile: Profile;
  isUploading?: boolean;
  onUpdateAvatar: (file: File) => Promise<void>;
  onUpdateName: (name: string) => Promise<void>;
  onUpdatePhone: (phone: string) => Promise<void>;
  onUpdatePreferences: (updates: Partial<Profile>) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export const SettingsSection = ({
  profile,
  isUploading,
  onUpdateAvatar,
  onUpdateName,
  onUpdatePhone,
  onUpdatePreferences,
  onDeleteAccount
}: SettingsSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(profile.full_name);
  const [newPhone, setNewPhone] = useState(profile.phone_number || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpdateAvatar(file);
    }
  };

  const handleSaveChanges = async () => {
    if (newName !== profile.full_name) {
      await onUpdateName(newName);
    }
    if (newPhone !== profile.phone_number) {
      await onUpdatePhone(newPhone);
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Informations de base */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                ) : (
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                )}
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-4 h-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Téléphone (optionnel)</Label>
                    <Input
                      id="phone"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveChanges}>Enregistrer</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>{profile.full_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>{profile.email}</span>
                    {profile.email_verified ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">Vérifié</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Non vérifié</Badge>
                    )}
                  </div>
                  {profile.phone_number && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{profile.phone_number}</span>
                      {profile.phone_verified ? (
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">Vérifié</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Non vérifié</Badge>
                      )}
                    </div>
                  )}
                  <Button variant="outline" onClick={() => setIsEditing(true)}>Modifier</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Préférences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Préférences</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <Label htmlFor="language">Langue</Label>
            </div>
            <select
              id="language"
              value={profile.language}
              onChange={(e) => onUpdatePreferences({ language: e.target.value })}
              className="bg-background border rounded-md px-2 py-1"
            >
              <option value="Français">Français</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <Label htmlFor="theme">Thème</Label>
            </div>
            <select
              id="theme"
              value={profile.theme}
              onChange={(e) => onUpdatePreferences({ theme: e.target.value })}
              className="bg-background border rounded-md px-2 py-1"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="system">Système</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <Switch
              id="notifications"
              checked={profile.notifications_enabled}
              onCheckedChange={(checked) => 
                onUpdatePreferences({ notifications_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <Label htmlFor="marketing">Emails marketing</Label>
            </div>
            <Switch
              id="marketing"
              checked={profile.marketing_emails_enabled}
              onCheckedChange={(checked) => 
                onUpdatePreferences({ marketing_emails_enabled: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-primary" />
              <Label htmlFor="ads">Publicités récompensées</Label>
            </div>
            <Switch
              id="ads"
              checked={profile.ads_enabled}
              onCheckedChange={(checked) => 
                onUpdatePreferences({ ads_enabled: checked })
              }
            />
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="p-6 border-destructive">
        <h3 className="text-lg font-semibold text-destructive mb-4">Zone de danger</h3>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
          </p>
          <Button 
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer mon compte
          </Button>
        </div>
      </Card>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Cette action est irréversible</span>
                </div>
                <p>
                  La suppression de votre compte entraînera la perte définitive de :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Toutes vos images générées</li>
                  <li>Votre historique de crédits et transactions</li>
                  <li>Vos images de référence</li>
                  <li>Vos préférences et paramètres</li>
                </ul>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
