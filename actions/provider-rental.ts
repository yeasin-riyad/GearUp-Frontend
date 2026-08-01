// src/actions/provider-rental.ts
"use server";

import { getAuthHeaders } from "@/service/getAuthHeaders";

const API_BASE_URL = process.env.BACKEND_API_URL;

export interface ProviderRentalItem {
  id: string;
  quantity: number;
  pricePerDay: number;
  subtotal: number;
  gearItem: {
    id: string;
    title: string;
    imageUrl?: string;
    category?: {
      name: string;
    };
  };
}

export interface ProviderRentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  status: "PAID" | "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED";
  totalAmount?: number;
  createdAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
    paidAt: string;
  };
  items: ProviderRentalItem[];
}

/**
 * Fetch incoming rentals for the logged-in provider
 */
export async function getIncomingRentalsAction() {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/rentals/provider`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch provider rentals.");
    }

    return {
      success: true,
      rentals: (data.data || data) as ProviderRentalOrder[],
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Could not fetch provider rentals.",
    };
  }
}

/**
 * Update Rental Order Status (Confirm, Pick Up, Return)
 */
export async function updateRentalStatusAction(
  rentalId: string,
  actionType: "confirm" | "pick-up" | "return",
) {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${API_BASE_URL}/rentals/${rentalId}/${actionType}`,
      {
        method: "PATCH",
        headers,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Failed to ${actionType} rental order.`);
    }

    return {
      success: true,
      message: `Rental order status updated to ${actionType} successfully.`,
      rental: data.data || data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || `Could not ${actionType} rental order.`,
    };
  }
}
