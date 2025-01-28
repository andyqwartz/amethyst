import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export const DeleteHistoryModal = ({
  open,
  onOpenChange,
  onConfirm
}: DeleteHistoryModalProps) => {
  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#1a1a1a]/95 border-[#7E69AB]/20 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Delete History</DialogTitle>
          <DialogDescription className="text-gray-300">
            Are you sure you want to delete all your generation history? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-[#7E69AB]/50 text-white hover:bg-[#7E69AB]/20 transition-all duration-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#7E69AB]/80 hover:bg-[#7E69AB] text-white border-none transition-all duration-300"
          >
            Delete History
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};