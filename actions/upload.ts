"use server";

// Environment variables on the server (never exposed to browser)
const CLOUDINARY_CLOUD_NAME =process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET =process.env.CLOUDINARY_UPLOAD_PRESET;

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadImageAction(formData: FormData, folder?: string): Promise<UploadResponse> {
  try {
    const file = formData.get("file") as File | null;

    if (!file) {
      return { success: false, error: "No file provided." };
    }

    // 1. Validate file type on the server
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Invalid file type. Please upload an image." };
    }

    // 2. Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size exceeds the 5MB limit." };
    }

    // Ensure Cloudinary env vars are present
    if (!CLOUDINARY_UPLOAD_PRESET || !CLOUDINARY_CLOUD_NAME) {
      return { success: false, error: "Cloudinary is not configured on the server." };
    }

    // 3. Prepare FormData payload for Cloudinary API
    const uploadPayload = new FormData();
    uploadPayload.append("file", file);
    uploadPayload.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    
    if (folder) {
      uploadPayload.append("folder", folder);
    }

    // 4. Send request to Cloudinary from the server
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadPayload,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.secure_url) {
      return {
        success: false,
        error: data.error?.message || "Failed to upload image to Cloudinary.",
      };
    }

    return {
      success: true,
      url: data.secure_url,
    };
  } catch (error: any) {
    console.error("Cloudinary Upload Error:", error);
    return {
      success: false,
      error: error.message || "An unexpected error occurred during upload.",
    };
  }
}