import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';

interface DeleteHistoryButtonProps {
  onDelete: () => void;
}

export const DeleteHistoryButton = ({ onDelete }: DeleteHistoryButtonProps) => {
  return (
    <div className="group h-24 flex items-center justify-center mt-8">
      <Button
        variant="outline"
        size="icon"
        className="w-12 h-12 rounded-full bg-[#D6BCFA] hover:bg-[#C4B5FD] border-none text-white 
                   transition-all duration-300 hover:scale-110 shadow-lg backdrop-blur-sm
                   opacity-0 group-hover:opacity-100"
        onClick={onDelete}
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};