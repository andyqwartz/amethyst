import { toast } from "@/components/ui/use-toast";

const predictionIds = [
  "cxxj29zwndrme0cmn7ft85eehw",
  "xtrz107wg1rmc0cmn7fs2g91rw",
  "0r0e54fwehrmc0cmn7frmbxz50",
  // ... and all other IDs from your list
];

export const downloadLostImages = async () => {
  const { toast } = useToast();
  
  let successCount = 0;
  let failCount = 0;

  const downloadImage = async (id: string) => {
    try {
      const response = await fetch(`https://replicate.delivery/pbxt/${id}/output.png`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
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

  toast({
    title: "Starting downloads",
    description: "The images will be downloaded one by one...",
  });

  for (const id of predictionIds) {
    await downloadImage(id);
  }

  toast({
    title: "Download complete",
    description: `Successfully downloaded ${successCount} images. ${failCount} failed.`,
  });
};