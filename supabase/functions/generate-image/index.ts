import { serve } from "https://deno.fresh.run/std@0.168.0/http/server.ts";

const REPLICATE_API_TOKEN = Deno.env.get('REPLICATE_API_KEY')!;
const MODEL_VERSION = "lucataco/flux-dev-multi-lora:2389224e115448d9a77c07d7d45672b3f0aa45acacf1c5bcf51857ac295e3aec";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { input } = await req.json();
    console.log('Received input:', input);

    if (!REPLICATE_API_TOKEN) {
      throw new Error('REPLICATE_API_KEY is not configured');
    }

    // Appel initial à l'API Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: MODEL_VERSION,
        input,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Replicate API error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const prediction = await response.json();
    console.log('Initial prediction:', prediction);
    
    // Polling pour obtenir le résultat
    let result = prediction;
    while (result.status !== "succeeded" && result.status !== "failed") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const pollResponse = await fetch(
        `https://api.replicate.com/v1/predictions/${prediction.id}`,
        {
          headers: {
            Authorization: `Token ${REPLICATE_API_TOKEN}`,
          },
        }
      );
      result = await pollResponse.json();
      console.log('Polling result:', result);
    }

    if (result.status === "failed") {
      console.error('Generation failed:', result.error);
      throw new Error(result.error);
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});