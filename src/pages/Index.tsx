import { ImageGenerator } from "@/components/ImageGenerator";
import { Button } from "@/components/ui/button";
import { downloadLostImages } from "@/utils/downloadLostImages";
import { importLostImages } from "@/utils/importLostImages";
import { Download, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();

  const handleImportImages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to import images",
        variant: "destructive",
      });
      return;
    }

    importLostImages();
  };

  return (
    <div className="relative">
      <ImageGenerator />
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Button
          className="bg-primary/20 hover:bg-primary/30 rounded-full"
          size="icon"
          onClick={() => downloadLostImages()}
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          className="bg-primary/20 hover:bg-primary/30 rounded-full"
          size="icon"
          onClick={handleImportImages}
        >
          <History className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;