"use client";

import { useState, useRef } from "react";
import { Camera, Loader2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";

import { uploadImageAction } from "@/actions/upload";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  folder?: string;
  variant?: "avatar" | "dropzone";
}

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  folder = "avatars",
  variant = "avatar",
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Quick client-side check to prevent unnecessary request
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid File", { description: "Please upload an image file (PNG, JPG, WEBP)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File Too Large", { description: "Image size must be under 5MB." });
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Uploading image via server...");

    try {
      // Build FormData payload for Server Action
      const formData = new FormData();
      formData.append("file", file);

      // Call Server Action
      const result = await uploadImageAction(formData, folder);

      if (!result.success || !result.url) {
        throw new Error(result.error || "Failed to upload image.");
      }

      // Update Form Value
      onChange(result.url);
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (error: any) {
      toast.error("Upload Failed", {
        id: toastId,
        description: error.message || "Failed to upload image.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={disabled || isUploading}
        className="hidden"
      />

      {variant === "avatar" ? (
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <Camera className="mr-2 h-4 w-4" /> Change Photo
              </>
            )}
          </Button>

          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={handleRemove}
              disabled={disabled || isUploading}
            >
              Remove
            </Button>
          )}
        </div>
      ) : (
        /* Dropzone variant (for Gear Uploads later) */
        <div className="space-y-3">
          {value ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border group">
              <img src={value} alt="Uploaded gear preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemove}
                disabled={disabled || isUploading}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
              ) : (
                <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
              )}
              <p className="text-xs font-medium text-muted-foreground">
                {isUploading ? "Uploading image..." : "Click to upload gear picture"}
              </p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}