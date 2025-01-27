import { toast } from "@/components/ui/use-toast";

const predictionIds = [
  "cxxj29zwndrme0cmn7ft85eehw",
  "xtrz107wg1rmc0cmn7fs2g91rw",
  "0r0e54fwehrme0cmn7frmbxz50",
  // ... and all other IDs from your list
];

export const downloadLostImages = async () => {
  let successCount = 0;
  let failCount = 0;
  const failedIds: string[] = [];

  toast({
    title: "Starting downloads",
    description: "The images will be downloaded one by one...",
  });

  const downloadImage = async (id: string) => {
    try {
      const response = await fetch(`https://replicate.delivery/pbxt/${id}/output.png`);
      if (!response.ok) {
        if (response.status === 404) {
          console.error(`Image ${id} not found (404)`);
          failedIds.push(id);
          throw new Error('Image not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      successCount++;
    } catch (error) {
      console.error(`Failed to download image ${id}:`, error);
      failCount++;
    }
  };

  for (const id of predictionIds) {
    await downloadImage(id);
  }

  if (failCount > 0) {
    toast({
      title: "Download partially complete",
      description: `Successfully downloaded ${successCount} images. ${failCount} failed because they were no longer available.`,
      variant: "destructive",
      duration: 5000,
    });
    
    console.error("Failed prediction IDs:", failedIds);
  } else {
    toast({
      title: "Download complete",
      description: `Successfully downloaded ${successCount} images.`,
      duration: 3000,
    });
  }
};