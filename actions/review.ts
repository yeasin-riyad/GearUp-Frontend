"use server";

import { getAuthHeaders } from "@/service/getAuthHeaders";
import { revalidatePath } from "next/cache";

export interface ICreateReviewPayload {
  rentalOrderId: string;
  gearItemId: string;
  rating: number;
  comment?: string;
}

export async function createReviewAction(payload: ICreateReviewPayload) {
  try {
        const headers = await getAuthHeaders();
    
    // আপনার ব্যাকএন্ড API এন্ডপয়েন্টে কল করুন
    const res = await fetch(`${process.env.BACKEND_API_URL}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to submit review.",
      };
    }

    revalidatePath("/rentals");
    return { success: true, data: data.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An error occurred while submitting review.",
    };
  }
}