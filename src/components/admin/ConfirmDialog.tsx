import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'default',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-[#1A1D27] border-white/10 text-white rounded-2xl overflow-hidden">
        <AlertDialogHeader>
          <AlertDialogTitle className={variant === 'destructive' ? 'text-red-500' : ''}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-white/70">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onClose}
            className="bg-transparent text-white border-white/20 hover:bg-white/10"
          >
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              variant === 'destructive' 
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }
          >
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
