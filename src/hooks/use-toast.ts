import { useToast as useToastUI } from "@/components/ui/toast";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

export interface ToastOptions {
  duration?: number;
  action?: ToastActionElement;
  className?: string;
}

export function useToast() {
  const { toast } = useToastUI();

  const success = (message: string, options?: ToastOptions) => {
    toast({
      description: message,
      variant: "success",
      duration: options?.duration || 4000,
      className: options?.className,
      action: options?.action,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast({
      description: message,
      variant: "destructive",
      duration: options?.duration || 5000,
      className: options?.className,
      action: options?.action,
    });
  };

  const show = (message: string, options?: ToastOptions) => {
    toast({
      description: message,
      duration: options?.duration || 4000,
      className: options?.className,
      action: options?.action,
    });
  };

  return {
    success,
    error,
    show,
    toast,
  };
}

export { toast } from "@/components/ui/toast";