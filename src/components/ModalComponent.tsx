import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogClose,
} from "@/components/ui/dialog"

interface ModalComponentProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string | number;
  maxHeight?: string | number;
  title?: string;
  disableBackdropClick?: boolean;
  fullScreen?: boolean;
}

const ModalComponent: React.FC<ModalComponentProps> = ({
  open,
  onClose,
  children,
  maxWidth = '600px',
  maxHeight = '80vh',
  title,
  disableBackdropClick = false,
  fullScreen = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={disableBackdropClick ? undefined : onClose}>
      <DialogContent
        className={cn(
          "overflow-hidden flex flex-col",
          fullScreen ? "w-screen h-screen max-w-none max-h-none rounded-none" : "",
          !fullScreen ? "min-w-[280px]" : ""
        )}
        style={{
          maxWidth: fullScreen ? '100vw' : maxWidth,
          maxHeight: fullScreen ? '100vh' : maxHeight,
        }}
      >
        {!disableBackdropClick && (
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        )}
        
        {title && (
          <div className="text-xl font-semibold mb-4 pr-8">
            {title}
          </div>
        )}
        
        <div className="flex-1 overflow-auto overscroll-contain relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalComponent;
