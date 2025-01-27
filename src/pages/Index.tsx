import { ImageGenerator } from "@/components/ImageGenerator";
import { Button } from "@/components/ui/button";
import { downloadLostImages } from "@/utils/downloadLostImages";
import { importLostImages } from "@/utils/importLostImages";
import { Download, History } from "lucide-react";

const Index = () => {
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
          onClick={() => importLostImages()}
        >
          <History className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Index;