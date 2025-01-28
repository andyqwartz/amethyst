import { useState, useEffect } from 'react';
import type { GenerationSettings } from '@/types/replicate';
import { supabase } from '@/integrations/supabase/client';

export const useGenerationHandler = (
  status: string,
  setIsGenerating: (isGenerating: boolean) => void,
  resetSettings: () => void,
  toast: any
) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async (
    generate: (settings: GenerationSettings) => Promise<void>,
    settings: GenerationSettings,
    isGenerating: boolean
  ) => {
    if (isGenerating || isProcessing) {
      toast({
        title: "Génération en cours",
        description: "Veuillez attendre la fin de la génération en cours",
        variant: "destructive"
      });
      return;
    }

    if (!settings.prompt.trim()) {
      toast({
        title: "Erreur",
        description: "Le prompt ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si la clé API Replicate est configurée
    try {
      const { data, error } = await supabase.functions.invoke('check-replicate-key');
      
      if (error) throw error;
      
      if (!data.hasReplicateKey) {
        toast({
          title: "Configuration requise",
          description: "Veuillez configurer votre clé API Replicate pour générer des images",
          className: "bg-primary/10 text-primary border-primary/20 rounded-xl",
        });
        return;
      }

      setIsProcessing(true);
      setIsGenerating(true);
      
      await generate(settings);
    } catch (error) {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      setIsGenerating(false);
      localStorage.removeItem('generation_status');
      localStorage.removeItem('generation_progress');
      localStorage.removeItem('generation_timestamp');
      resetSettings();
    }
  }, [status, setIsGenerating, resetSettings]);

  return { handleGenerate };
};