"use server";

import { getAuthHeaders } from "@/service/getAuthHeaders";

const API_BASE_URL = process.env.BACKEND_API_URL;


export interface GearItem {
  id: string;
  title: string;
  imageUrl?: string;
  pricePerDay: number;
}

export interface RentalOrderItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  gearItem: GearItem;
  quantity: number;
  pricePerDay: number;
  subtotal: number;
}

export interface PaymentInfo {
  id: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  amount: number;
}

export interface RentalOrder {
  id: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  totalAmount?: number;
  createdAt: string;
  items: RentalOrderItem[];
  payment?: PaymentInfo;
}


  // Collect Auth Header from parameter or HTTP-only cookie
export async function getMyRentalsAction() {
  try {
  
            const headers = await getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/rentals/my-rentals`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch rental orders.");
    }

    // Handles standard array or wrapped `{ data: [...] }` payload
    const rentals: RentalOrder[] = Array.isArray(data)
      ? data
      : data.data || [];

    return {
      success: true,
      rentals,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Could not load your rental history.",
      rentals: [],
    };
  }
}


// Add this to src/actions/rental.ts

export async function cancelRentalAction(rentalId: string) {
  try {
                const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/rentals/${rentalId}/cancel`, {
      method: "PATCH",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to cancel rental order.");
    }

    return {
      success: true,
      message: "Rental order cancelled successfully.",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Could not cancel the rental order.",
    };
  }
}