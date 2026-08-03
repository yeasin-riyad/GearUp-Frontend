"use server";

import { getAuthHeaders } from "@/service/getAuthHeaders";
import { cookies } from "next/headers";

export interface ProviderDashboardData {
  totalGears: number;
  availableGears: number;
  unavailableGears: number;
  placedRentals: number;
  paidRentals: number;
  confirmedRentals: number;
  pickedUpRentals: number;
  returnedRentals: number;
  cancelledRentals: number;
  totalRevenue: number;
}

export interface DashboardResponse {
  success: boolean;
  data?: ProviderDashboardData;
  error?: string;
}

const API_BASE_URL = process.env.BACKEND_API_URL;
export async function getProviderDashboardAction(): Promise<DashboardResponse> {
  try {
                const headers = await getAuthHeaders();
    

    const response = await fetch(
      `${API_BASE_URL}/providers/dashboard`,
      {
        method: "GET",
        headers,
        cache: "no-store", // Ensure fresh analytics data
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Error ${response.status}: Failed to fetch dashboard data`,
      };
    }

    const result = await response.json();

    // Support responses wrapped in { data: {...} } or direct object return
    const dashboardData: ProviderDashboardData = result.data || result;

    return {
      success: true,
      data: dashboardData,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "An unexpected error occurred fetching dashboard analytics.",
    };
  }
}