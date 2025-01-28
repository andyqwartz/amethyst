import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const { predictionId } = await req.json()
    if (!predictionId) {
      console.error("Missing predictionId in request")
      return new Response(
        JSON.stringify({ error: "predictionId is required" }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    console.log("Checking progress for prediction:", predictionId)
    const prediction = await replicate.predictions.get(predictionId)
    console.log("Progress response:", prediction)

    // Ensure we're sending a properly formatted response
    const response = {
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
      logs: prediction.logs
    }

    return new Response(
      JSON.stringify(response), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error("Error checking progress:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'failed'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})