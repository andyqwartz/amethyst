import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const MODEL_VERSION = "lucataco/sdxl:c86579ac5193b3d184651424d6c766f9b699c05b5d8360e3f6c6c5c6e01013c5";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY')
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set')
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    })

    const { input, predictionId } = await req.json()
    console.log("Request received:", { input, predictionId })

    if (predictionId) {
      console.log("Checking status for prediction:", predictionId)
      try {
        const prediction = await replicate.predictions.get(predictionId)
        console.log("Status check response:", prediction)
        
        if (prediction.status === 'succeeded') {
          return new Response(JSON.stringify({ 
            status: 'success',
            output: prediction.output,
            settings: input,
            predictionId 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        } else if (prediction.status === 'failed') {
          return new Response(JSON.stringify({ 
            status: 'error',
            error: prediction.error,
            predictionId 
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }
        
        return new Response(JSON.stringify({ 
          status: 'processing',
          predictionId 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } catch (error) {
        console.error("Error checking prediction status:", error)
        return new Response(JSON.stringify({ 
          status: 'error',
          error: error.message,
          predictionId
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        })
      }
    }

    if (!input?.prompt) {
      return new Response(JSON.stringify({ 
        error: "Missing required field: prompt" 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }

    console.log("Starting new generation with input:", input)
    
    try {
      const prediction = await replicate.predictions.create({
        version: MODEL_VERSION,
        input: {
          prompt: input.prompt,
          negative_prompt: input.negative_prompt,
          guidance_scale: input.guidance_scale,
          num_inference_steps: input.num_inference_steps,
          num_outputs: input.num_outputs || 1,
          seed: input.seed,
          image: input.image,
          hf_loras: input.hf_loras,
          lora_scales: input.lora_scales,
          aspect_ratio: input.aspect_ratio || "1:1",
          output_format: input.output_format || "webp",
          output_quality: input.output_quality || 80,
          prompt_strength: input.prompt_strength || 0.8,
          disable_safety_checker: input.disable_safety_checker || false
        }
      })

      console.log("Generation started, prediction:", prediction)
      
      return new Response(JSON.stringify({ 
        status: 'started',
        predictionId: prediction.id 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } catch (error) {
      console.error("Error starting generation:", error)
      return new Response(JSON.stringify({ 
        status: 'error',
        error: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }
  } catch (error) {
    console.error("Error in generate-image function:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})