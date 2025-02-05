import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

export function ToastComponent() {
  const { toast, dismiss } = useToast();

  return (
    <div>
      <Toast />
    </div>
  );
}