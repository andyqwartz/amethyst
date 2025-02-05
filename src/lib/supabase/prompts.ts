import { supabase } from './client';
import type { GenerationSettings } from '@/types/generation';

export const savePrompt = async (settings: GenerationSettings) => {
  const { data, error } = await supabase
    .from('prompts')
    .insert([{
      ...settings,
      user_id: (await supabase.auth.getUser()).data.user?.id
    }]);

  if (error) {
    console.error('Error saving prompt:', error);
    throw error;
  }

  return data;
}; 