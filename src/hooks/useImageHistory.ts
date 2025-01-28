import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import type { Json } from '@/integrations/supabase/types';
import { useToast } from "@/hooks/use-toast";

interface HistoryImage {
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

interface ImageRecord {
  url: string;
  settings: Json;
  created_at: string;
  prompt: string;
  seed?: number;
  guidance_scale?: number;
  steps?: number;
  negative_prompt?: string;
}

export const useImageHistory = () => {
  const [history, setHistory] = useState<HistoryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = images.map(img => ({
        url: img.url,
        settings: {
          prompt: img.prompt || '',
          negativePrompt: img.negative_prompt || '',
          guidanceScale: img.guidance_scale || 7.5,
          steps: img.steps || 30,
          seed: img.seed,
          numOutputs: img.num_outputs || 1,
          aspectRatio: img.aspect_ratio || "1:1",
          outputFormat: img.output_format || "webp",
          outputQuality: img.output_quality || 80,
          promptStrength: img.prompt_strength || 0.8,
          hfLoras: [],
          loraScales: [],
          disableSafetyChecker: false
        } as GenerationSettings,
        timestamp: new Date(img.created_at).getTime()
      }));

      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching image history:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des images",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();

    const channel = supabase
      .channel('images_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'images' },
        (payload) => {
          const newImage = payload.new as ImageRecord;
          setHistory(prev => [{
            url: newImage.url,
            settings: {
              prompt: newImage.prompt || '',
              negativePrompt: newImage.negative_prompt || '',
              guidanceScale: newImage.guidance_scale || 7.5,
              steps: newImage.steps || 30,
              seed: newImage.seed,
              numOutputs: 1,
              aspectRatio: "1:1",
              outputFormat: "webp",
              outputQuality: 80,
              promptStrength: 0.8,
              hfLoras: [],
              loraScales: [],
              disableSafetyChecker: false
            } as GenerationSettings,
            timestamp: new Date(newImage.created_at).getTime()
          }, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addToHistory = async (url: string, settings: GenerationSettings) => {
    try {
      const { error } = await supabase
        .from('images')
        .insert({
          url,
          settings: settings as unknown as Json,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          prompt: settings.prompt,
          negative_prompt: settings.negativePrompt,
          guidance_scale: settings.guidanceScale,
          steps: settings.steps,
          seed: settings.seed,
          num_outputs: settings.numOutputs,
          aspect_ratio: settings.aspectRatio,
          output_format: settings.outputFormat,
          output_quality: settings.outputQuality,
          prompt_strength: settings.promptStrength
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding image to history:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'image à l'historique",
        variant: "destructive"
      });
    }
  };

  const getDashboardImages = () => history.slice(0, 10);
  const getAllImages = () => history;

  return { 
    history: getDashboardImages(), 
    allHistory: getAllImages(),
    addToHistory,
    isLoading 
  };
};