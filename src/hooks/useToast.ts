import { useCallback } from "react"
import { useToast as useToastUI } from "@/components/ui/use-toast"

interface ToastOptions {
  duration?: number
  action?: React.ReactNode
  position?: "top" | "bottom"
  swipeDirection?: "up" | "down" | "left" | "right"
  className?: string
}

const defaultToastOptions = {
  duration: 4000,
  position: "top" as const,
  swipeDirection: "up" as const,
  className: "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[swipe=end]:animate-out data-[swipe=end]:fade-out-0 data-[swipe=end]:zoom-out-95 fixed top-4 left-1/2 -translate-x-1/2 max-w-[90vw] md:max-w-[420px]",
}

export function useToast() {
  const { toast } = useToastUI()

  const success = useCallback((message: string, options?: ToastOptions) => {
    toast({
      description: message,
      variant: "success",
      duration: options?.duration || defaultToastOptions.duration,
      action: options?.action,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
      position: options?.position || defaultToastOptions.position,
      swipeDirection: options?.swipeDirection || defaultToastOptions.swipeDirection,
    })
  }, [toast])

  const error = useCallback((message: string, options?: ToastOptions) => {
    toast({
      description: message,
      variant: "error",
      duration: options?.duration || defaultToastOptions.duration + 1000, // Errors shown slightly longer
      action: options?.action,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
      position: options?.position || defaultToastOptions.position,
      swipeDirection: options?.swipeDirection || defaultToastOptions.swipeDirection,
    })
  }, [toast])

  const show = useCallback((message: string, options?: ToastOptions) => {
    toast({
      description: message,
      duration: options?.duration || defaultToastOptions.duration,
      action: options?.action,
      className: `${defaultToastOptions.className} ${options?.className || ''}`,
      position: options?.position || defaultToastOptions.position,
      swipeDirection: options?.swipeDirection || defaultToastOptions.swipeDirection,
    })
  }, [toast])

  return {
    success,
    error,
    show,
  }
}
