// app/profile/page.tsx
import { ProfileForm } from "@/components/auth/profile-form";
import { getCurrentUser } from "@/service/auth.service";
import { User } from "@/types/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Helper function to fetch initial profile on server side


export default async function ProfilePage() {
  // Retrieve token from cookies (adjust key name if your app uses something else)
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // Redirect to login if user is not authenticated
  if (!token) {
    redirect("/login");
  }

   const user = await getCurrentUser();
 

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="container max-w-4xl mx-auto py-10 px-4">
      <ProfileForm user={user} token={token} />
    </main>
  );
}