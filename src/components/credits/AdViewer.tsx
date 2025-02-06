import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCredits } from "@/hooks/useCredits";
import { Loader2, Play, CheckCircle2, XCircle } from "lucide-react";

interface AdViewerProps {
  userId: string;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export const AdViewer = ({ userId, onComplete, onError }: AdViewerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds ad duration
  const [adCompleted, setAdCompleted] = useState(false);
  const { recordAdView } = useCredits(userId);
  const { toast } = useToast();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isWatching && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isWatching) {
      handleAdComplete();
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isWatching, timeLeft]);

  const startAd = () => {
    setIsWatching(true);
    setIsLoading(true);
    
    // Simulate ad loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleAdComplete = async () => {
    setIsWatching(false);
    setAdCompleted(true);

    try {
      await recordAdView({
        ad_id: 'test-ad-' + Date.now(), // In production, this would be a real ad ID
        view_duration: 30,
        completed: true,
        credits_earned: 5,
        metadata: {
          ad_type: 'video',
          platform: 'web'
        }
      });

      toast({
        title: "Succès !",
        description: "Vous avez gagné 5 crédits en regardant la publicité"
      });

      onComplete?.();
    } catch (err) {
      console.error('Error recording ad view:', err);
      const error = err instanceof Error ? err : new Error('Erreur lors de l\'enregistrement de la publicité');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message
      });
      onError?.(error);
    }
  };

  const formatTime = (seconds: number) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (adCompleted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-purple-50 rounded-lg">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h3 className="text-xl font-semibold text-green-700">Publicité terminée !</h3>
        <p className="text-green-600">Vous avez gagné 5 crédits</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      {isLoading ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <p className="text-purple-600">Chargement de la publicité...</p>
        </div>
      ) : isWatching ? (
        <div className="w-full space-y-4">
          <div className="aspect-video bg-purple-900 rounded-lg flex items-center justify-center">
            <div className="text-white text-xl">
              Simulation de publicité
            </div>
          </div>
          <div className="flex items-center justify-between px-4">
            <div className="text-sm text-purple-600">
              Temps restant
            </div>
            <div className="text-lg font-semibold text-purple-700">
              {formatTime(timeLeft)}
            </div>
          </div>
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / 30) * 100}%` }}
            />
          </div>
          <p className="text-sm text-center text-purple-600">
            Ne fermez pas cette fenêtre pendant la lecture de la publicité
          </p>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              Regardez une publicité
            </h3>
            <p className="text-sm text-purple-600 mb-4">
              Gagnez 5 crédits en regardant une publicité de 30 secondes
            </p>
            <Button
              onClick={startAd}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              Commencer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
