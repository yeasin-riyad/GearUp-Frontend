// app/(dashboard)/provider/page.tsx
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Package, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/service/auth.service";

export default async function ProviderDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "PROVIDER") {
    redirect(`/dashboard/${user?.role.toLowerCase() || "customer"}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Provider Portal 🛠️</h1>
          <p className="text-muted-foreground">Track listings, earnings, and customer orders.</p>
        </div>
        <Link href="/dashboard/provider/gear/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" /> Add Gear
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,240.00</div>
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8 Products</div>
            <p className="text-xs text-muted-foreground">6 currently rented out</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Package className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 Orders</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}