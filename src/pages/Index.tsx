import { ImageGenerator } from "@/components/image-generator/ImageGenerator";
import { Header } from "@/components/image-generator/Header";

export const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ImageGenerator />
    </div>
  );
};

export default Index;
