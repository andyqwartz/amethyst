import { useCallback } from "react";
import { useToast as useToastUI } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface ToastOptions {
  duration?: number;
  action?: React.ReactNode;
  position?: "top" | "bottom";
  swipeDirection?: "up" | "down" | "left" | "right";
  className?: string;
}

const defaultToastOptions = {
  duration: 4000,
  position: "top" as const,
  swipeDirection: "up" as const,
  className: "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[swipe=end]:animate-out data-[swipe=end]:fade-out-0 data-[swipe=end]:zoom-out-95 fixed top-4 left-1/2 -translate-x-1/2 max-w-[90vw] md:max-w-[420px]",
};

export function useToast() {
  const { toast } = useToastUI();

  const success = useCallback((message: string, options?: ToastOptions) => {
    toast({
      description: message,
      variant: "default",
      duration: options?.duration || defaultToastOptions.duration,
      action: options?.action && <Button>{options.action}</Button>,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
    });
  }, [toast]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    toast({
      description: message,
      variant: "destructive",
      duration: options?.duration || defaultToastOptions.duration + 1000,
      action: options?.action && <Button variant="destructive">{options.action}</Button>,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
    });
  }, [toast]);

  const show = useCallback((message: string, options?: ToastOptions) => {
    toast({
      description: message,
      duration: options?.duration || defaultToastOptions.duration,
      action: options?.action && <Button>{options.action}</Button>,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
    });
  }, [toast]);

  return {
    success,
    error,
    show,
  };
}