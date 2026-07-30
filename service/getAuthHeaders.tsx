import { cookies } from "next/headers";

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  // Adjust "accessToken" to match the exact key name you store your JWT in
  const token = cookieStore.get("accessToken")?.value;

  return {
    "Content-Type": "application/json",
    Cookie: `accessToken=${token}`,
  };
}