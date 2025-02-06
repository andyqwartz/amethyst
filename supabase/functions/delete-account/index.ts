import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400 }
      )
    }

    // Supprimer les données associées
    const deleteData = async () => {
      // Supprimer les images générées
      await supabaseAdmin
        .from('generated_images')
        .delete()
        .eq('user_id', userId)

      // Supprimer l'historique des crédits
      await supabaseAdmin
        .from('credit_transactions')
        .delete()
        .eq('profile_id', userId)

      // Supprimer l'historique des publicités
      await supabaseAdmin
        .from('ads_history')
        .delete()
        .eq('profile_id', userId)

      // Supprimer le profil
      await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId)
    }

    // Supprimer l'utilisateur et ses données
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteError) throw deleteError

    // Supprimer les données associées
    await deleteData()

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting account:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
})
