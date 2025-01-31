import { useToast as useToastUI } from "@/components/ui/use-toast";
import { ToastActionElement } from "@/components/ui/toast";
import { ReactElement } from "react";

interface ToastOptions {
  duration?: number;
  action?: ToastActionElement;
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

  const success = (message: string, options?: ToastOptions) => {
    toast({
      description: message,
      variant: "success",
      duration: options?.duration || defaultToastOptions.duration,
      action: options?.action as ReactElement,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
    });
  };

  const error = (message: string, options?: ToastOptions) => {
    toast({
      description: message,
      variant: "error",
      duration: options?.duration || defaultToastOptions.duration + 1000,
      action: options?.action as ReactElement,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
    });
  };

  const show = (message: string, options?: ToastOptions) => {
    toast({
      description: message,
      duration: options?.duration || defaultToastOptions.duration,
      action: options?.action as ReactElement,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
    });
  };

  return {
    success,
    error,
    show,
  };
}