import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import { useToast } from "@/hooks/use-toast";

interface HistoryImage {
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

export const useImageHistory = () => {
  const [history, setHistory] = useState<HistoryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isAddingToHistory = useRef(false);

  const fetchHistory = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.error('No authenticated user found');
        setHistory([]);
        setIsLoading(false);
        return;
      }

      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = images.map(img => ({
        url: img.url,
        settings: {
          prompt: img.prompt || '',
          negative_prompt: img.negative_prompt || '',
          guidance_scale: img.guidance_scale || 7.5,
          num_inference_steps: img.steps || 30,
          seed: img.seed,
          num_outputs: img.num_outputs || 1,
          aspect_ratio: img.aspect_ratio || "1:1",
          output_format: img.output_format || "webp",
          output_quality: img.output_quality || 80,
          prompt_strength: img.prompt_strength || 0.8,
          hf_loras: img.settings?.hf_loras || [],
          lora_scales: img.settings?.lora_scales || [],
          disable_safety_checker: false
        } as GenerationSettings,
        timestamp: new Date(img.created_at).getTime()
      }));

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast({
        title: "Error",
        description: "Unable to load image history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToHistory = async (url: string, settings: GenerationSettings) => {
    if (isAddingToHistory.current) {
      console.log('Already adding to history, skipping duplicate call');
      return;
    }

    isAddingToHistory.current = true;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        console.error('No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "Please log in to save images",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('images')
        .insert({
          url,
          user_id: session.user.id,
          settings: settings,
          prompt: settings.prompt,
          negative_prompt: settings.negative_prompt,
          guidance_scale: settings.guidance_scale,
          steps: settings.num_inference_steps,
          seed: settings.seed,
          num_outputs: settings.num_outputs,
          aspect_ratio: settings.aspect_ratio,
          output_format: settings.output_format,
          output_quality: settings.output_quality,
          prompt_strength: settings.prompt_strength,
          reference_image_url: settings.reference_image_url
        });

      if (error) throw error;

      await fetchHistory();
    } catch (error) {
      console.error('Error adding to history:', error);
      toast({
        title: "Error",
        description: "Unable to save image to history",
        variant: "destructive"
      });
    } finally {
      isAddingToHistory.current = false;
    }
  };

  useEffect(() => {
    fetchHistory();

    const authListener = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchHistory();
      } else if (event === 'SIGNED_OUT') {
        setHistory([]);
      }
    });

    return () => {
      authListener.data.subscription.unsubscribe();
    };
  }, []);

  return { 
    history, 
    allHistory: history,
    addToHistory,
    isLoading 
  };
};