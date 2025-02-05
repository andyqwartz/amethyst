import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Profile } from '@/types/database';
import DialogWrapper from '@/components/ui/dialog-wrapper';

interface EditUserModalProps {
  user: Profile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Profile) => Promise<void>;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave,
}) => {
  const [editedUser, setEditedUser] = React.useState<Profile>(user);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(editedUser);
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof Profile, value: any) => {
    let processedValue = value;
    
    // Handle numeric fields
    if (field === 'credits_balance' || field === 'daily_ads_limit') {
      // Convert to number and handle invalid values
      const num = parseInt(value);
      processedValue = isNaN(num) ? 0 : Math.max(0, num); // Ensure non-negative
    }

    setEditedUser(prev => ({ ...prev, [field]: processedValue }));
  };

  const footer = (
    <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
      <Button
        variant="outline"
        onClick={onClose}
        className="w-full sm:w-auto text-white border-white/20 hover:bg-white/10"
      >
        Annuler
      </Button>
      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20"
      >
        {isSaving ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </div>
  );

  return (
    <DialogWrapper
      open={isOpen}
      onOpenChange={onClose}
      title="Modifier l'utilisateur"
      description="Modifiez les informations et les paramètres de l'utilisateur"
      footer={footer}
    >
      <div className="space-y-8 max-h-[calc(100vh-12rem)] overflow-y-auto px-1">
        {/* Basic Info */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input
              value={editedUser.full_name || ''}
              onChange={(e) => updateField('full_name', e.target.value)}
              className="bg-black/20 border-white/10 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={editedUser.email || ''}
              onChange={(e) => updateField('email', e.target.value)}
              className="bg-black/20 border-white/10 rounded-xl"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input
              value={editedUser.phone_number || ''}
              onChange={(e) => updateField('phone_number', e.target.value)}
              className="bg-black/20 border-white/10 rounded-xl"
            />
          </div>
        </div>

        {/* Subscription & Credits */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label>Niveau d'abonnement</Label>
            <Select
              value={editedUser.subscription_tier}
              onValueChange={(value) => updateField('subscription_tier', value)}
            >
              <SelectTrigger className="bg-black/20 border-white/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Gratuit</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Crédits disponibles</Label>
            <Input
              type="number"
              value={editedUser.credits_balance ?? 0}
              onChange={(e) => updateField('credits_balance', e.target.value)}
              min="0"
              className="bg-black/20 border-white/10 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label>Limite quotidienne de pubs</Label>
            <Input
              type="number"
              value={editedUser.daily_ads_limit ?? 0}
              onChange={(e) => updateField('daily_ads_limit', e.target.value)}
              min="0"
              className="bg-black/20 border-white/10 rounded-xl"
            />
          </div>
        </div>

        {/* Settings & Preferences */}
        <div className="space-y-4 sm:space-y-6 bg-black/10 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <Label>Notifications</Label>
            <Switch
              checked={editedUser.notifications_enabled}
              onCheckedChange={(checked) => updateField('notifications_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Emails marketing</Label>
            <Switch
              checked={editedUser.marketing_emails_enabled}
              onCheckedChange={(checked) => updateField('marketing_emails_enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label>Publicités</Label>
            <Switch
              checked={editedUser.ads_enabled}
              onCheckedChange={(checked) => updateField('ads_enabled', checked)}
            />
          </div>
        </div>

        {/* Language & Theme */}
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label>Langue</Label>
            <Select
              value={editedUser.language}
              onValueChange={(value) => updateField('language', value)}
            >
              <SelectTrigger className="bg-black/20 border-white/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Thème</Label>
            <Select
              value={editedUser.theme}
              onValueChange={(value) => updateField('theme', value)}
            >
              <SelectTrigger className="bg-black/20 border-white/10 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Sombre</SelectItem>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="system">Système</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </DialogWrapper>
  );
};

export default EditUserModal;
