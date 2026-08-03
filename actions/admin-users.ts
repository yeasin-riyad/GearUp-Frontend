"use server";

import { getAuthHeaders } from "@/service/getAuthHeaders";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  _count: {
    rentalOrders: number;
    reviews: number;
  };
}

export interface MetaData {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface GetUsersResponse {
  success: boolean;
  data?: UserItem[];
  meta?: MetaData;
  error?: string;
}

export interface UpdateStatusResponse {
  success: boolean;
  message?: string;
  error?: string;
}
const API_BASE_URL = process.env.BACKEND_API_URL;

export async function getAllUsersAction(queryParams: {
  searchTerm?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
  sort?: string;
}): Promise<GetUsersResponse> {
  try {
        const headers = await getAuthHeaders();
    

    const params = new URLSearchParams();
    if (queryParams.searchTerm) params.set("searchTerm", queryParams.searchTerm);
    if (queryParams.role && queryParams.role !== "ALL") params.set("role", queryParams.role);
    if (queryParams.status && queryParams.status !== "ALL") params.set("status", queryParams.status);
    if (queryParams.page) params.set("page", queryParams.page.toString());
    if (queryParams.limit) params.set("limit", queryParams.limit.toString());
    if (queryParams.sort) params.set("sort", queryParams.sort);

    const response = await fetch(
      `${API_BASE_URL}/admin/all-users?${params.toString()}`,
      {
        method: "GET",
        headers,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}: Failed to fetch users`,
      };
    }

    const result = await response.json();

    return {
      success: true,
      data: result.data || result.data?.data || [],
      meta: result.meta || result.data?.meta,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "An unexpected error occurred while fetching users.",
    };
  }
}

export async function updateUserStatusAction(
  userId: string,
  status: "ACTIVE" | "SUSPENDED"
): Promise<UpdateStatusResponse> {
  try {
        const headers = await getAuthHeaders();


    const response = await fetch(
      `${API_BASE_URL}/admin/${userId}/status`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || "Failed to update user status",
      };
    }

    revalidatePath("/dashboard/admin/users");

    return {
      success: true,
      message: `User status successfully updated to ${status}.`,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "An unexpected error occurred updating user status.",
    };
  }
}