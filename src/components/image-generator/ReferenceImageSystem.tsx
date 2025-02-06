import React, { useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Upload } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabase/client";

interface ReferenceImageSystemProps {
  referenceImage: string | null;
  onReferenceImageChange: (url: string | null) => void;
  onReferenceImageStrengthChange: (strength: number) => void;
  referenceImageStrength: number;
  className?: string;
}

export const ReferenceImageSystem: React.FC<ReferenceImageSystemProps> = ({
  referenceImage,
  onReferenceImageChange,
  onReferenceImageStrengthChange,
  referenceImageStrength,
  className
}) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `reference-images/${user.id}/${Date.now()}.${fileExt}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('references')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('references')
        .getPublicUrl(filePath);

      // Save reference to database
      const { error: dbError } = await supabase
        .from('active_reference_images')
        .insert({
          user_id: user.id,
          original_filename: file.name,
          public_url: publicUrl,
          purpose: 'generation',
          preprocessing_applied: {},
          created_at: new Date().toISOString(),
          last_used_at: new Date().toISOString(),
          usage_count: 0
        });

      if (dbError) throw dbError;

      onReferenceImageChange(publicUrl);
      toast({
        title: "Success",
        description: "Reference image uploaded successfully"
      });
    } catch (err) {
      console.error('Error uploading reference image:', err);
      toast({
        title: "Error",
        description: "Failed to upload reference image",
        variant: "destructive"
      });
    }
  }, [user, toast, onReferenceImageChange]);

  const handleRemoveReference = useCallback(async () => {
    if (!referenceImage || !user) return;

    try {
      // Delete from active references
      const { error: dbError } = await supabase
        .from('active_reference_images')
        .delete()
        .eq('user_id', user.id)
        .eq('public_url', referenceImage);

      if (dbError) throw dbError;

      // Extract filename from URL
      const filename = referenceImage.split('/').pop();
      if (filename) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('references')
          .remove([`reference-images/${user.id}/${filename}`]);

        if (storageError) throw storageError;
      }

      onReferenceImageChange(null);
      toast({
        title: "Success",
        description: "Reference image removed"
      });
    } catch (err) {
      console.error('Error removing reference image:', err);
      toast({
        title: "Error",
        description: "Failed to remove reference image",
        variant: "destructive"
      });
    }
  }, [referenceImage, user, toast, onReferenceImageChange]);

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Reference Image</h3>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </label>
            {referenceImage && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveReference}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
        </div>

        {referenceImage && (
          <div className="space-y-4">
            <div className="relative aspect-square w-full max-w-[300px] mx-auto overflow-hidden rounded-lg border border-border">
              <img
                src={referenceImage}
                alt="Reference"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Reference Strength: {referenceImageStrength}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={referenceImageStrength}
                onChange={(e) => onReferenceImageStrengthChange(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
