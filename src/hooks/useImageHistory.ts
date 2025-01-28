import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import { useToast } from "@/hooks/use-toast";
import type { Json } from '@/integrations/supabase/types';

interface ImageSettings extends Json {
  hf_loras?: string[];
  lora_scales?: number[];
  disable_safety_checker?: boolean;
}

export const useImageHistory = () => {
  const [history, setHistory] = useState<{
    url: string;
    settings: GenerationSettings;
    timestamp: number;
  }[]>([]);
  const [allHistory, setAllHistory] = useState<{
    url: string;
    settings: GenerationSettings;
    timestamp: number;
  }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.log('No authenticated user found');
        setHistory([]);
        setAllHistory([]);
        setIsLoading(false);
        return;
      }

      console.log('Fetching history for user:', session.session.user.id);
      
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = images.map(img => {
        const imgSettings = img.settings as ImageSettings;
        return {
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
            hf_loras: imgSettings?.hf_loras || [],
            lora_scales: imgSettings?.lora_scales || [],
            disable_safety_checker: imgSettings?.disable_safety_checker || false,
            reference_image_url: img.reference_image_url || null
          } as GenerationSettings,
          timestamp: new Date(img.created_at).getTime()
        };
      });

      setHistory(formattedHistory.slice(0, 4));
      setAllHistory(formattedHistory);
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
  }, [toast]);

  const addToHistory = async (url: string, settings: GenerationSettings) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.error('No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "Please log in to save images",
          variant: "destructive"
        });
        return;
      }

      console.log('Adding image to history for user:', session.session.user.id);
      console.log('Settings being saved:', settings);

      const { error } = await supabase
        .from('images')
        .insert({
          url,
          user_id: session.session.user.id,
          settings: {
            hf_loras: settings.hf_loras,
            lora_scales: settings.lora_scales,
            disable_safety_checker: settings.disable_safety_checker
          },
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

      if (error) {
        console.error('Error adding to history:', error);
        throw error;
      }

      await fetchHistory();
    } catch (error) {
      console.error('Error adding to history:', error);
      toast({
        title: "Error",
        description: "Unable to save image to history",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchHistory();

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        fetchHistory();
      } else if (event === 'SIGNED_OUT') {
        setHistory([]);
        setAllHistory([]);
      }
    });

    const channel = supabase
      .channel('images_changes')
      .on(
        'postgres_changes',
        { 
          event: '*',
          schema: 'public',
          table: 'images'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          fetchHistory();
        }
      )
      .subscribe();

    return () => {
      authSubscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [fetchHistory]);

  return { 
    history, 
    allHistory,
    addToHistory,
    isLoading 
  };
};