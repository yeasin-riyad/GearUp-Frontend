// app/(dashboard)/customer/page.tsx
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Clock, CheckCircle } from "lucide-react";
import { getCurrentUser } from "@/service/auth.service";

export default async function CustomerDashboardPage() {
  const user = await getCurrentUser();

  // Strict Role Verification
  if (!user || user.role !== "CUSTOMER") {
    redirect(`/dashboard/${user?.role.toLowerCase() || "customer"}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}! 👋</h1>
        <p className="text-muted-foreground">Manage your gear rentals and active reservations.</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Items</div>
            <p className="text-xs text-muted-foreground">Due for return this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Bookings</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14</div>
            <p className="text-xs text-muted-foreground">Total successful rentals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saved Gear</CardTitle>
            <ShoppingBag className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Items in wishlist</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}