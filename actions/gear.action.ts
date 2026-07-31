"use server";

import { revalidatePath } from "next/cache";
import { GearFormValues, gearSchema } from "@/schemas/gear.schema";
import { getAuthHeaders } from "@/service/getAuthHeaders";

const API_BASE_URL = process.env.BACKEND_API_URL;

/**
 * CREATE GEAR
 */
export async function createGearAction(values: GearFormValues) {
  const validatedFields = gearSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid fields provided.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/gears`, {
      method: "POST",
      headers,
      body: JSON.stringify(validatedFields.data),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to create gear.",
      };
    }

    revalidatePath("/dashboard/provider/gear");
    revalidatePath("/gears");

    return {
      success: true,
      message: "Gear created successfully!",
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

/**
 * GET ALL GEARS
 */
export async function getAllGearsAction(queryParams?: Record<string, string>) {
  try {
    // Convert object parameters to query string (e.g. ?search=camera&categoryId=123&page=1)
    const queryString = queryParams
      ? "?" + new URLSearchParams(queryParams).toString()
      : "";

    const res = await fetch(`${process.env.BACKEND_API_URL}/gears${queryString}`, {
      method: "GET",
      cache: "no-store", // Ensures fresh data when search/page changes
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch gears.",
        data: [],
        meta: { total: 0, page: 1, limit: 10, totalPage: 1 },
      };
    }

    return {
      success: true,
      data: data.data || [],
      meta: data.meta || null,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while fetching gears.",
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPage: 1 },
    };
  }
}

/**
 * GET SINGLE GEAR
 */
export async function getSingleGearAction(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/gears/${id}`, {
      method: "GET",
      next: { revalidate: 60 }, // Cache for 60 seconds (optional)
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Gear not found.",
        data: null,
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong while fetching gear details.",
      data: null,
    };
  }
}

/**
 * UPDATE GEAR
 */
export async function updateGearAction(
  id: string,
  values: Partial<GearFormValues>
) {
  // Partial validation for updating specific fields
  const validatedFields = gearSchema.partial().safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid update payload.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/gears/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(validatedFields.data),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to update gear.",
      };
    }

    revalidatePath("/dashboard/provider/gear");
    revalidatePath(`/gears/${id}`);

    return {
      success: true,
      message: "Gear updated successfully!",
      data: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}

/**
 * DELETE GEAR
 */
export async function deleteGearAction(id: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/gears/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete gear.",
      };
    }

    revalidatePath("/dashboard/provider/gear");
    revalidatePath("/gears");

    return {
      success: true,
      message: "Gear deleted successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}