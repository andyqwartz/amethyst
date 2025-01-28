import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Replicate from "https://esm.sh/replicate@0.25.2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
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

    const body = await req.json()

    // If it's a status check request
    if (body.predictionId) {
      console.log("Checking status for prediction:", body.predictionId)
      const prediction = await replicate.predictions.get(body.predictionId)
      console.log("Status check response:", prediction)
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If it's a generation request
    if (!body.input?.prompt) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required field: prompt is required" 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Prepare the input
    const input = {
      prompt: body.input.prompt,
      negative_prompt: body.input.negative_prompt || "",
      guidance_scale: body.input.guidance_scale || 3.5,
      num_inference_steps: body.input.num_inference_steps || 28,
      num_outputs: body.input.num_outputs || 1,
      aspect_ratio: body.input.aspect_ratio || "1:1",
      output_format: body.input.output_format || "webp",
      output_quality: body.input.output_quality || 80,
      prompt_strength: body.input.prompt_strength || 0.8,
      hf_loras: body.input.hf_loras || [],
      lora_scales: body.input.lora_scales || [],
      disable_safety_checker: true
    }

    // If there's a reference image, fetch it and convert to base64
    if (body.input.reference_image_url) {
      console.log("Reference image URL detected:", body.input.reference_image_url)
      try {
        const imageResponse = await fetch(body.input.reference_image_url)
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`)
        }
        
        const imageBuffer = await imageResponse.arrayBuffer()
        const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)))
        const contentType = imageResponse.headers.get('content-type') || 'image/png'
        input.image = `data:${contentType};base64,${base64Image}`
        console.log("Successfully converted image to base64")
      } catch (error) {
        console.error("Error processing reference image:", error)
        return new Response(
          JSON.stringify({ error: "Failed to process reference image", details: error.message }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        )
      }
    }

    console.log("Starting generation with input:", {
      ...input,
      image: input.image ? "Base64 image present" : "No reference image"
    })
    
    try {
      const prediction = await replicate.predictions.create({
        version: "2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec",
        input: input
      })

      console.log("Generation started:", prediction)
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } catch (error) {
      console.error("Error creating prediction:", error)
      return new Response(
        JSON.stringify({ 
          error: "Failed to create prediction", 
          details: error.message 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500,
        }
      )
    }
  } catch (error) {
    console.error("Error in generate-image function:", error)
    return new Response(
      JSON.stringify({ 
        error: "An unexpected error occurred", 
        details: error.message 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})