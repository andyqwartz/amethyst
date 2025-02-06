import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export async function updateProfile(userId: string, updates: {
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
}

export async function changePassword(userId: string, newPassword: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ password: newPassword })
    .eq('id', userId);

  if (error) throw error;
  return data;
}

export async function uploadProfileImage(file: File): Promise<string> {
  const fileName = `${uuidv4()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from('profile-images')
    .upload(fileName, file);

  if (error) throw error;
  return data.path;
}
