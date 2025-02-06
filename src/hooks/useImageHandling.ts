import { useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { useImageGeneratorStore } from '@/state/imageGeneratorStore';
import { supabase } from '@/lib/supabase/client';

export const useImageHandling = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { settings, setIsGenerating, setError, clearError } = useImageGeneratorStore();

  const checkAuthStatus = useCallback(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate images",
        variant: "destructive"
      });
      return false;
    }
    return true;
  }, [user, toast]);

  const generateImage = useCallback(async () => {
    if (!checkAuthStatus()) return;

    try {
      setIsGenerating(true);
      clearError();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify({
          ...settings,
          user_id: user?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [user, settings, setIsGenerating, clearError]);

  const setGeneratedImage = useCallback(async (imageUrl: string) => {
    if (!user) return;

    try {
      // Store image metadata in Supabase
      const { error } = await supabase
        .from('generated_images')
        .insert({
          user_id: user.id,
          url: imageUrl,
          settings: settings,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image generated successfully"
      });
    } catch (err) {
      handleError(err);
    }
  }, [user, settings]);

  const handleError = useCallback((error: unknown) => {
    console.error('Image generation error:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    setError(message);
    toast({
      title: "Error",
      description: message,
      variant: "destructive"
    });
  }, [setError, toast]);

  return {
    generateImage,
    setGeneratedImage,
    handleError,
    checkAuthStatus
  };
};
