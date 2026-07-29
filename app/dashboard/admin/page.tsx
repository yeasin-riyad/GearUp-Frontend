// app/(dashboard)/admin/page.tsx
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldAlert, Activity, DollarSign } from "lucide-react";
import { getCurrentUser } from "@/service/auth.service";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    redirect(`/dashboard/${user?.role.toLowerCase() || "customer"}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview 🛡️</h1>
        <p className="text-muted-foreground">System-wide platform metrics and management controls.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,842</div>
            <p className="text-xs text-muted-foreground">+12% this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Platform GMV</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,850</div>
            <p className="text-xs text-muted-foreground">Gross Merchandise Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-emerald-600">All APIs Operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Flagged Items</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4 Requests</div>
            <p className="text-xs text-destructive">Needs moderation</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}