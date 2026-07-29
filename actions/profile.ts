"use server";

import { ProfileFormValues, profileSchema } from "@/schemas/profile";

interface UpdateProfileResult {
  success: boolean;
  data?: any;
  error?: string;
}

export async function updateProfileAction(
  data: ProfileFormValues,
  token?: string,
): Promise<UpdateProfileResult> {
  // 1. Server-side Validation with Zod
  const validated = profileSchema.safeParse(data);

  if (!validated.success) {
    return {
      success: false,
      error: "Invalid fields provided. Please check your inputs.",
    };
  }

  try {
    // 2. Network Request to API
    const baseUrl = process.env.BACKEND_API_URL;
    const response = await fetch(`${baseUrl}/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${token}`,
      },
      body: JSON.stringify(validated.data),
    });

    const resData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: resData?.message || "Failed to update profile",
      };
    }

    return {
      success: true,
      data: resData.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "An unexpected network error occurred.",
    };
  }
}
