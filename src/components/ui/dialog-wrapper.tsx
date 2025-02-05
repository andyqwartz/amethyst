import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface DialogWrapperProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

const DialogWrapper: React.FC<DialogWrapperProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-2xl bg-[#1A1D27] border-white/10 text-white rounded-2xl p-0 gap-0 overflow-hidden"
      >
        <DialogHeader className="p-6 border-b border-white/10">
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-white/70">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <DialogFooter className="p-6 border-t border-white/10">
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWrapper;
