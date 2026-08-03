"use server";

import { getAuthHeaders } from "@/service/getAuthHeaders";


export interface AdminDashboardData {
  users: {
    totalUsers: number;
    totalCustomers: number;
    totalProviders: number;
  };
  categories: {
    totalCategories: number;
  };
  gears: {
    totalGears: number;
    availableGears: number;
    unavailableGears: number;
  };
  rentals: {
    totalRentalOrders: number;
    placedRentals: number;
    paidRentals: number;
    confirmedRentals: number;
    pickedUpRentals: number;
    returnedRentals: number;
    cancelledRentals: number;
  };
  payments: {
    totalPayments: number;
    completedPayments: number;
    pendingPayments: number;
    failedPayments: number;
  };
  revenue: {
    totalRevenue: number;
  };
}

export interface AdminDashboardResponse {
  success: boolean;
  data?: AdminDashboardData;
  error?: string;
}

const API_BASE_URL = process.env.BACKEND_API_URL;

export async function getAdminDashboardAction(): Promise<AdminDashboardResponse> {
  try {
                    const headers = await getAuthHeaders();
    
   

    const response = await fetch(
       `${API_BASE_URL}/admin/dashboard`,
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
        error:
          errorData.message ||
          `Error ${response.status}: Failed to fetch admin dashboard metrics`,
      };
    }

    const result = await response.json();

    // Support responses wrapped in { data: {...} } or direct object return
    const dashboardData: AdminDashboardData = result.data || result;

    return {
      success: true,
      data: dashboardData,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error:
        error.message ||
        "An unexpected error occurred while fetching admin dashboard metrics.",
    };
  }
}