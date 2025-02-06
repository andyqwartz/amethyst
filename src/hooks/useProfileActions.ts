import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Profile } from './useProfile';

export const useProfileActions = (userId: string | undefined, onUpdate?: () => void) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const updateAvatar = async (file: File) => {
    if (!userId) return;

    try {
      setIsUploading(true);

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${userId}/${Math.random()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Succès",
        description: "Avatar mis à jour"
      });

      onUpdate?.();
    } catch (err) {
      console.error('Error updating avatar:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour l'avatar"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const updatePhoneNumber = async (phoneNumber: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          phone_number: phoneNumber,
          phone_verified: false 
        })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Numéro de téléphone mis à jour"
      });

      onUpdate?.();
    } catch (err) {
      console.error('Error updating phone number:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le numéro de téléphone"
      });
    }
  };

  const updateName = async (name: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: name })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Nom mis à jour"
      });

      onUpdate?.();
    } catch (err) {
      console.error('Error updating name:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le nom"
      });
    }
  };

  const updatePreferences = async (updates: Partial<Profile>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Préférences mises à jour"
      });

      onUpdate?.();
    } catch (err) {
      console.error('Error updating preferences:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences"
      });
    }
  };

  const deleteAccount = async () => {
    if (!userId) return;

    try {
      // Delete profile first (RLS policies will handle related data)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      // Delete auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);

      if (authError) throw authError;

      toast({
        title: "Compte supprimé",
        description: "Votre compte a été supprimé avec succès"
      });
    } catch (err) {
      console.error('Error deleting account:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le compte"
      });
      throw err;
    }
  };

  return {
    isUploading,
    updateAvatar,
    updatePhoneNumber,
    updateName,
    updatePreferences,
    deleteAccount
  };
};
