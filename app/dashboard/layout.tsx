import { redirect } from "next/navigation";
import { getCurrentUser } from "@/service/auth.service";
import { logout } from "@/service/logout";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // 1. Unauthenticated Protection Guard
  if (!user) {
    redirect("/auth/login");
  }

  // 2. Server Action for Logout
  async function handleLogout() {
    "use server";
    await logout();
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Client Sidebar Component */}
      <DashboardSidebar user={user} handleLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}