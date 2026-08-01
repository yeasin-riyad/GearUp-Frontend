// src/actions/checkout.ts
"use server";

import { getAuthHeaders } from "@/service/getAuthHeaders";

const API_BASE_URL = process.env.BACKEND_API_URL;

export interface CreateRentalPayload {
  startDate: string;
  endDate: string;
  providerId: string;
  items: {
    gearItemId: string;
    quantity: number;
  }[];
}

interface ActionResponse {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export async function processCheckoutAction(
  payload: CreateRentalPayload
): Promise<ActionResponse> {
  try {
    // Collect Auth Header from parameter or HTTP-only cookie
        const headers = await getAuthHeaders();
    

    // 1. Create Rental Order
    const rentalRes = await fetch(`${API_BASE_URL}/rentals`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const rentalData = await rentalRes.json();

    if (!rentalRes.ok) {
      throw new Error(rentalData.message || "Failed to create rental order.");
    }

    // Extract rentalOrderId (handles data wrapper or flat object)
    const rentalOrderId =
      rentalData.data?.id || rentalData.id || rentalData.rentalOrderId;

    if (!rentalOrderId) {
      throw new Error("Rental created, but no order ID was returned.");
    }

    // 2. Create Stripe Checkout Session using rentalOrderId
    const checkoutRes = await fetch(
      `${API_BASE_URL}/payments/checkout-session/${rentalOrderId}`,
      {
        method: "POST",
        headers,
      }
    );

    const checkoutData = await checkoutRes.json();

    if (!checkoutRes.ok) {
      throw new Error(
        checkoutData.message || "Failed to create checkout session."
      );
    }

    // Extract checkoutUrl
    const checkoutUrl =
      checkoutData.checkoutUrl ||
      checkoutData.url ||
      checkoutData.data?.checkoutUrl ||
      checkoutData.data?.url;

    if (!checkoutUrl) {
      throw new Error("No checkout URL returned from payment service.");
    }

    return {
      success: true,
      checkoutUrl,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      error: error.message || "An error occurred during checkout.",
    };
  }
}