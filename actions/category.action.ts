"use server";

import { revalidatePath } from "next/cache";
import { categorySchema, CategoryFormValues } from "@/schemas/category.schema";
import { getAuthHeaders } from "@/service/getAuthHeaders";

const API_BASE_URL =
  process.env.BACKEND_API_URL ;

// const API_BASE_URL ="http://localhost:5000/api";


export type ActionResponse<T = any> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  meta?: any;
};

/**
 * Helper to fetch stored Auth Token from cookies
 */
// async function getAuthHeaders(): Promise<Record<string, string>> {
//   const cookieStore = await cookies();
//   // Adjust "accessToken" to match the exact key name you store your JWT in
//   const token = cookieStore.get("accessToken")?.value;

//   return {
//     "Content-Type": "application/json",
//     Cookie: `accessToken=${token}`,
//   };
// }

/**
 * CREATE Category Action -> POST https://gearup-1-9p45.onrender.com/api/categories
 */
export async function createCategoryAction(
  rawData: CategoryFormValues
): Promise<ActionResponse> {
  // 1. Client-side Zod validation
  const validation = categorySchema.safeParse(rawData);
  if (!validation.success) {
    return {
      success: false,
      statusCode: 400,
      message:"Invalid input data",
    };
  }

  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers,
      body: JSON.stringify(validation.data),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        message: result.message || "Failed to create category",
      };
    }

    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/gears");

    return {
      success: true,
      statusCode: res.status,
      message: result.message || "Category created successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error?.message || "Failed to connect to backend server.",
    };
  }
}

/**
 * GET All Categories Action -> GET https://gearup-1-9p45.onrender.com/api/categories
 */
export async function getCategoriesAction(
  query: Record<string, unknown> = {}
): Promise<ActionResponse> {
  try {
    const queryString = new URLSearchParams(query as any).toString();
    const url = `${API_BASE_URL}/categories${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      next: { tags: ["categories"] },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        message: result.message || "Failed to retrieve categories",
      };
    }

    return {
      success: true,
      statusCode: res.status,
      message: result.message || "Categories retrieved successfully",
      data: result.data,
      meta: result.meta,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error?.message || "Failed to retrieve categories.",
    };
  }
}

/**
 * GET Single Category Action -> GET https://gearup-1-9p45.onrender.com/api/categories/:id
 */
export async function getSingleCategoryAction(id: string): Promise<ActionResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        message: result.message || "Category not found",
      };
    }

    return {
      success: true,
      statusCode: res.status,
      message: result.message || "Category retrieved successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error?.message || "Category not found.",
    };
  }
}

/**
 * UPDATE Category Action -> PATCH https://gearup-1-9p45.onrender.com/api/categories/:id
 */
export async function updateCategoryAction(
  id: string,
  rawData: Partial<CategoryFormValues>
): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(rawData),
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        message:"Failed to update category",
      };
    }

    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/gears");

    return {
      success: true,
      statusCode: res.status,
      message: result.message || "Category updated successfully",
      data: result.data,
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error?.message || "Failed to update category.",
    };
  }
}

/**
 * DELETE Category Action -> DELETE https://gearup-1-9p45.onrender.com/api/categories/:id
 */
export async function deleteCategoryAction(id: string): Promise<ActionResponse> {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: "DELETE",
      headers,
    });

    const result = await res.json();

    if (!res.ok) {
      return {
        success: false,
        statusCode: res.status,
        message: result.message || "Failed to delete category",
      };
    }

    revalidatePath("/dashboard/admin/categories");
    revalidatePath("/gears");

    return {
      success: true,
      statusCode: res.status,
      message: result.message || "Category deleted successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: 500,
      message: error?.message || "Failed to delete category.",
    };
  }
}