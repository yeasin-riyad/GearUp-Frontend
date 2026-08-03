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

    revalidatePath("/dashboard/customer/rentals");
    return { success: true, data: data.data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An error occurred while submitting review.",
    };
  }
}

export async function fetchMyReviewsAction(query: Record<string, unknown> = {}) {
  try {
    const headers = await getAuthHeaders();

    // Query parameters build করা (যেমন: rating, sort, page, limit ইত্যাদি)
    const queryString = new URLSearchParams(
      query as Record<string, string>
    ).toString();

    const url = `${process.env.BACKEND_API_URL}/reviews/me${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(url, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to fetch reviews.",
      };
    }

    return {
      success: true,
      data: data.data || [],
      meta: data.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to fetch reviews.",
    };
  }
}

export async function updateReviewAction(
  reviewId: string,
  payload: { rating?: number; comment?: string }
) {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/reviews/${reviewId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to update review.",
      };
    }

    revalidatePath("/dashboard/customer/reviews");
    return {
      success: true,
      message: "Review updated successfully!",
      data: data.data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update review.",
    };
  }
}

export async function deleteReviewAction(reviewId: string) {
  try {
    const headers = await getAuthHeaders();

    const res = await fetch(
      `${process.env.BACKEND_API_URL}/reviews/${reviewId}`,
      {
        method: "DELETE",
        headers,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        error: data.message || "Failed to delete review.",
      };
    }

    revalidatePath("/dashboard/customer/reviews");
    return {
      success: true,
      message: "Review deleted successfully!",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to delete review.",
    };
  }
}