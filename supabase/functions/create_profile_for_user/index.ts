 import { createClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

const handler = async (req: any, res: any) => {
  const { user } = req.body;

  try {
    const { error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name || user.email.split('@')[0],
        auth_provider: user.app_metadata.provider || 'email',
        created_at: new Date(),
        last_sign_in_at: new Date(),
        language: 'fr',
        theme: 'light',
      });

    if (error) {
      console.error('Error creating profile:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Profile created successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default handler;
