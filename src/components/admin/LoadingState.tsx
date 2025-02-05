import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Chargement..." 
}) => {
  return (
    <Card className="p-8 bg-[#1A1D27] border-white/10">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-white/50" />
          <div className="absolute inset-0 h-8 w-8 animate-ping rounded-full bg-white/5" />
        </div>
        <p className="text-white/70 text-sm font-medium">{message}</p>
      </div>
    </Card>
  );
};

export default LoadingState;
