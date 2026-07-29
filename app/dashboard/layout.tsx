import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Dumbbell,
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ShieldAlert,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { getCurrentUser } from "@/service/auth.service";
import { logout } from "@/service/logout";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // 1. Unauthenticated Protection Guard
  if (!user) {
    redirect("/login");
  }

  // 2. Server Action for Logout
  async function handleLogout() {
    "use server";
    await logout();
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-border/60 bg-background flex flex-col justify-between p-4">
        <div className="space-y-6">
          {/* Logo Header */}
          <Link href="/" className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-4 w-4" />
            </div>
            <span className="font-bold text-lg">GearUp</span>
          </Link>

          {/* User Badge */}
          <div className="rounded-lg bg-muted p-3 text-xs">
            <p className="font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-muted-foreground capitalize">
              {user.role?.toLowerCase()} Account
            </p>
          </div>

          {/* Navigation Items based on Role */}
          <nav className="space-y-1">
            {user.role === "CUSTOMER" && (
              <>
                <SidebarLink href="/dashboard/customer" icon={LayoutDashboard} label="Overview" />
                <SidebarLink href="/dashboard/customer/rentals" icon={ShoppingBag} label="My Rentals" />
              </>
            )}

            {user.role === "PROVIDER" && (
              <>
                <SidebarLink href="/dashboard/provider" icon={LayoutDashboard} label="Overview" />
                <SidebarLink href="/dashboard/provider/gear" icon={Package} label="My Inventory" />
                <SidebarLink href="/dashboard/provider/orders" icon={ShoppingBag} label="Rental Requests" />
              </>
            )}

            {user.role === "ADMIN" && (
              <>
                <SidebarLink href="/dashboard/admin" icon={LayoutDashboard} label="Analytics" />
                <SidebarLink href="/dashboard/admin/users" icon={Users} label="User Management" />
                <SidebarLink href="/dashboard/admin/moderation" icon={ShieldAlert} label="Gear Moderation" />
              </>
            )}
          </nav>
        </div>

        {/* Footer Logout Action */}
        <form action={handleLogout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </form>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
    >
      <Icon className="h-4 w-4 text-primary" />
      <span>{label}</span>
    </Link>
  );
}