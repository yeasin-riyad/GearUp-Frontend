"use client";

import { useState, useRef } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { uploadImageAction } from "@/actions/upload";

interface MultiImageUploadProps {
  value?: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  folder?: string;
  maxFiles?: number;
}

export function MultiImageUpload({
  value = [],
  onChange,
  disabled = false,
  folder = "gears",
  maxFiles = 5,
}: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    if (value.length + files.length > maxFiles) {
      toast.error("Limit Exceeded", {
        description: `You can only upload up to ${maxFiles} images.`,
      });
      return;
    }

    // Client-side validations
    const invalidType = files.some((file) => !file.type.startsWith("image/"));
    if (invalidType) {
      toast.error("Invalid File Type", {
        description: "Please upload valid image files (PNG, JPG, WEBP).",
      });
      return;
    }

    const overSized = files.some((file) => file.size > 5 * 1024 * 1024);
    if (overSized) {
      toast.error("File Too Large", {
        description: "Each image size must be under 5MB.",
      });
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image(s)...`);

    try {
      // Upload all files in parallel
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const result = await uploadImageAction(formData, folder);

        if (!result.success || !result.url) {
          throw new Error(result.error || `Failed to upload ${file.name}`);
        }
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Append new URLs to current array
      onChange([...value, ...uploadedUrls]);
      toast.success("Images uploaded successfully!", { id: toastId });
    } catch (error: any) {
      toast.error("Upload Failed", {
        id: toastId,
        description: error.message || "Failed to upload one or more images.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        disabled={disabled || isUploading || value.length >= maxFiles}
        className="hidden"
      />

      {/* Grid of existing uploaded images */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {value.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="relative aspect-square rounded-lg overflow-hidden border border-border group"
            >
              <img
                src={url}
                alt={`Gear image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                disabled={disabled || isUploading}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Dropzone Drop Area */}
      {value.length < maxFiles && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg transition-colors bg-muted/20 ${
            disabled || isUploading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-primary/50"
          }`}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mb-2" />
          ) : (
            <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
          )}
          <p className="text-xs font-medium text-muted-foreground text-center">
            {isUploading
              ? "Uploading images..."
              : `Click to select images (${value.length}/${maxFiles})`}
          </p>
          <p className="text-[10px] text-muted-foreground/70 mt-1">
            PNG, JPG up to 5MB (Select multiple files)
          </p>
        </div>
      )}
    </div>
  );
}