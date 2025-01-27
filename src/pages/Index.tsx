import { ImageGenerator } from "@/components/ImageGenerator";
import { Button } from "@/components/ui/button";
import { downloadLostImages } from "@/utils/downloadLostImages";
import { Download } from "lucide-react";

const Index = () => {
  return (
    <div className="relative">
      <ImageGenerator />
      <Button
        className="fixed bottom-4 right-4 bg-primary/20 hover:bg-primary/30 rounded-full"
        size="icon"
        onClick={() => downloadLostImages()}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Index;