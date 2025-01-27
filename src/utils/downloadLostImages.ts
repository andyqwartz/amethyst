import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const downloadLostImages = async () => {
  let successCount = 0;
  let failCount = 0;
  const failedUrls: string[] = [];

  toast({
    title: "Starting downloads",
    description: "The images will be downloaded one by one...",
  });

  try {
    // Get all images for the current user from the database
    const { data: images, error } = await supabase
      .from('images')
      .select('url')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    if (!images || images.length === 0) {
      toast({
        title: "No images found",
        description: "There are no images to download in your history.",
        variant: "destructive",
      });
      return;
    }

    const downloadImage = async (imageUrl: string) => {
      try {
        const response = await fetch(imageUrl);
        if (!response.ok) {
          if (response.status === 404) {
            console.error(`Image not found (404): ${imageUrl}`);
            failedUrls.push(imageUrl);
            throw new Error('Image not found');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        successCount++;
      } catch (error) {
        console.error(`Failed to download image ${imageUrl}:`, error);
        failCount++;
      }
    };

    // Download each image
    for (const image of images) {
      await downloadImage(image.url);
    }

    if (failCount > 0) {
      toast({
        title: "Download partially complete",
        description: `Successfully downloaded ${successCount} images. ${failCount} failed because they were no longer available.`,
        variant: "destructive",
        duration: 5000,
      });
      
      console.error("Failed image URLs:", failedUrls);
    } else {
      toast({
        title: "Download complete",
        description: `Successfully downloaded ${successCount} images.`,
        duration: 3000,
      });
    }
  } catch (error) {
    console.error("Error fetching images:", error);
    toast({
      title: "Error",
      description: "Failed to fetch images from your history.",
      variant: "destructive",
    });
  }
};