'use server';

import { getAuthHeaders } from "@/service/getAuthHeaders";


// Update this interface or import it from your shared types/config
export interface GetAdminRentalsQueryParams {
  page?: string | number;
  limit?: string | number;
  searchTerm?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Server Action to fetch all incoming rental orders across all providers for admin moderation.
 */
export async function getAllIncomingRentalsForAdminAction(
  queryParams?: GetAdminRentalsQueryParams
) {
  try {
    // 1. Build search query parameters for Express API
    const params = new URLSearchParams();

    if (queryParams?.page) params.append('page', queryParams.page.toString());
    if (queryParams?.limit) params.append('limit', queryParams.limit.toString());
    if (queryParams?.searchTerm) params.append('searchTerm', queryParams.searchTerm.trim());
    if (queryParams?.status) params.append('status', queryParams.status);
    if (queryParams?.sortBy) params.append('sortBy', queryParams.sortBy);
    if (queryParams?.sortOrder) params.append('sortOrder', queryParams.sortOrder);

    const queryString = params.toString();
    const apiUrl = `${process.env.BACKEND_API_URL}/rentals/get-all-rentals${
      queryString ? `?${queryString}` : ''
    }`;

    // 2. Fetch data from your Express backend
    // Ensure you pass your Admin Authentication Token in headers
    const headers=await getAuthHeaders()
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      // Ensure fresh data on every request or use tags for revalidation
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to fetch incoming rentals for admin.',
        data: [],
        meta: null,
      };
    }

    return {
      success: true,
      message: result.message || 'Rentals fetched successfully.',
      data: result.data || result.rentals || [],
      meta: result.meta || null,
    };
  } catch (error: any) {
    console.error('Error in getAllIncomingRentalsForAdminAction:', error);
    return {
      success: false,
      message: error.message || 'An internal server error occurred.',
      data: [],
      meta: null,
    };
  }
}