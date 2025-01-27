import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { GenerationSettings } from '@/types/replicate';
import type { Json } from '@/integrations/supabase/types';

interface HistoryImage {
  url: string;
  settings: GenerationSettings;
  timestamp: number;
}

interface DatabaseImageRecord {
  url: string;
  settings: Json;
  created_at: string;
  prompt: string | null;
  negative_prompt: string | null;
  guidance_scale: number | null;
  steps: number | null;
  seed: number | null;
  num_outputs: number | null;
  aspect_ratio: string | null;
  output_format: string | null;
  output_quality: number | null;
  prompt_strength: number | null;
}

const formatDatabaseImage = (img: DatabaseImageRecord): HistoryImage => {
  const outputFormat = (img.output_format || 'webp') as 'webp' | 'jpg' | 'png';
  
  return {
    url: img.url,
    settings: {
      prompt: img.prompt || '',
      negativePrompt: img.negative_prompt || '',
      guidanceScale: img.guidance_scale || 7.5,
      steps: img.steps || 30,
      seed: img.seed || undefined,
      numOutputs: img.num_outputs || 1,
      aspectRatio: img.aspect_ratio || '1:1',
      outputFormat,
      outputQuality: img.output_quality || 90,
      promptStrength: img.prompt_strength || 0.8,
      hfLoras: [],
      loraScales: [],
      disableSafetyChecker: false
    },
    timestamp: new Date(img.created_at).getTime()
  };
};

export const useImageHistory = () => {
  const [history, setHistory] = useState<HistoryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const { data: images, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedHistory = (images as DatabaseImageRecord[]).map(formatDatabaseImage);
      setHistory(formattedHistory);
    } catch (error) {
      console.error('Error fetching image history:', error);
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
          const newImage = payload.new as DatabaseImageRecord;
          const formattedImage = formatDatabaseImage(newImage);
          setHistory(prev => [formattedImage, ...prev]);
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
    }
  };

  const bulkImportImages = async (predictionIds: string[]) => {
    const defaultSettings: GenerationSettings = {
      prompt: "Restored image",
      negativePrompt: "",
      guidanceScale: 7.5,
      steps: 30,
      seed: undefined,
      numOutputs: 1,
      aspectRatio: "1:1",
      outputFormat: "webp",
      outputQuality: 90,
      promptStrength: 0.8,
      hfLoras: [],
      loraScales: [],
      disableSafetyChecker: false
    };

    for (const id of predictionIds) {
      const url = `https://replicate.delivery/pbxt/${id}/output.png`;
      await addToHistory(url, defaultSettings);
    }
  };

  const getDashboardImages = () => history.slice(0, 10);
  const getAllImages = () => history;

  return { 
    history: getDashboardImages(), 
    allHistory: getAllImages(),
    addToHistory,
    bulkImportImages,
    isLoading 
  };
};