import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return new Response('No signature', { status: 400 })
  }

  try {
    const body = await req.text()
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      // Get user ID and credits from metadata
      const { userId, credits } = session.metadata as { userId: string; credits: string }

      // Add credits to user's balance
      const { error: creditsError } = await supabaseClient.rpc('add_credits', {
        p_user_id: userId,
        p_amount: parseInt(credits),
        p_type: 'purchase',
        p_description: `Purchase of ${credits} credits`,
      })

      if (creditsError) {
        console.error('Error adding credits:', creditsError)
        return new Response(JSON.stringify({ error: creditsError.message }), { status: 400 })
      }

      // Record the transaction
      const { error: transactionError } = await supabaseClient
        .from('credit_transactions')
        .insert({
          profile_id: userId,
          amount: parseInt(credits),
          type: 'purchase',
          description: `Purchase of ${credits} credits`,
          metadata: {
            stripe_session_id: session.id,
            payment_status: session.payment_status,
          },
        })

      if (transactionError) {
        console.error('Error recording transaction:', transactionError)
        return new Response(JSON.stringify({ error: transactionError.message }), { status: 400 })
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: `Webhook Error: ${err.message}` }),
      { status: 400 }
    )
  }
})
