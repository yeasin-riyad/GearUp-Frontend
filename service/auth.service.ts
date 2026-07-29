import { User } from "@/types/auth";
import { cookies } from "next/headers";



export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value ;

    if (!accessToken) return null;

    const baseUrl =
      process.env.BACKEND_API_URL ;

    const response = await fetch(`${baseUrl}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie : `accessToken=${accessToken}`
      },
      cache: "no-store", // Ensure fresh user data on layout render
    });

    if (!response.ok) {
      return null;
    }

    const resData = await response.json();
    
    return resData.data;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}