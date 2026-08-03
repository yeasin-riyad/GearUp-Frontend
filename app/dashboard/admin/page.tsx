"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  Store,
  Layers,
  Package,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  Clock,
  CreditCard,
  Truck,
  RotateCcw,
  Ban,
  DollarSign,
  AlertTriangle,
  ShieldAlert,
  TrendingUp,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  getAdminDashboardAction,
  AdminDashboardData,
} from "@/actions/admin";

export default function AdminOverviewPage() {
  const [dashboard, setDashboard] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getAdminDashboardAction();
      if (res.success && res.data) {
        setDashboard(res.data);
      } else {
        const errorMsg = res.error || "Failed to load system-wide analytics.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <AdminDashboardSkeleton />;

  if (error || !dashboard) {
    return (
      <div className="container mx-auto max-w-4xl py-16 px-4 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-xl font-bold">Failed to load Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {error || "Could not retrieve system performance data."}
        </p>
        <Button onClick={loadDashboardData} className="h-10 px-6 font-medium">
          <RefreshCw className="mr-2 h-4 w-4" />
          <span>Try Again</span>
        </Button>
      </div>
    );
  }

  const { users, categories, gears, rentals, payments, revenue } = dashboard;

  // Calculate user distribution percentage
  const customerPct = users.totalUsers
    ? Math.round((users.totalCustomers / users.totalUsers) * 100)
    : 0;
  const providerPct = users.totalUsers
    ? Math.round((users.totalProviders / users.totalUsers) * 100)
    : 0;

  // Calculate gear availability percentage
  const availableGearPct = gears.totalGears
    ? Math.round((gears.availableGears / gears.totalGears) * 100)
    : 0;

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-sm text-muted-foreground">
            Platform-wide metrics, user distribution, revenue, and order pipeline statistics.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadDashboardData}
          className="w-fit gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Analytics</span>
        </Button>
      </div>

      {/* Hero KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Platform Revenue */}
        <Card className="border shadow-xs bg-linear-to-br from-card to-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${revenue.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>Gross processed payments</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Total Users
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {users.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {users.totalCustomers} Customers &bull; {users.totalProviders} Providers
            </p>
          </CardContent>
        </Card>

        {/* Total Gear Inventory */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Total Gear Items
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {gears.totalGears.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In {categories.totalCategories} Categories
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              Rental Orders
            </CardTitle>
            <div className="p-2 bg-amber-100 dark:bg-amber-950/50 rounded-xl text-amber-600 dark:text-amber-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {rentals.totalRentalOrders.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all fulfillment statuses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Platform Section Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Account Breakdown */}
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span>User Base Distribution</span>
            </CardTitle>
            <CardDescription>
              Registered accounts across roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-blue-500" />
                  <span>Customers</span>
                </span>
                <span className="font-semibold">
                  {users.totalCustomers}{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({customerPct}%)
                  </span>
                </span>
              </div>
              <Progress value={customerPct} className="h-2 bg-muted" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-indigo-500" />
                  <span>Providers</span>
                </span>
                <span className="font-semibold">
                  {users.totalProviders}{" "}
                  <span className="text-xs text-muted-foreground font-normal">
                    ({providerPct}%)
                  </span>
                </span>
              </div>
              <Progress value={providerPct} className="h-2 bg-muted" />
            </div>

            <div className="pt-2 border-t flex justify-between items-center text-xs text-muted-foreground">
              <span>Total Platform Users</span>
              <span className="font-mono font-bold text-foreground">
                {users.totalUsers}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Gear Catalog & Inventory Breakdown */}
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-500" />
              <span>Gear Inventory</span>
            </CardTitle>
            <CardDescription>
              Equipment availability & categories count.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-purple-100 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                  <Layers className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-xs">Categories</p>
                  <p className="text-xs text-muted-foreground">
                    Active catalog sections
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold">{categories.totalCategories}</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-xs">Available Gear</p>
                  <p className="text-xs text-muted-foreground">
                    Ready for rental
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {gears.availableGears}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                  <XCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium text-xs">Unavailable Gear</p>
                  <p className="text-xs text-muted-foreground">
                    Rented or inactive
                  </p>
                </div>
              </div>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                {gears.unavailableGears}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Transaction Analytics */}
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-500" />
              <span>Payment Transactions</span>
            </CardTitle>
            <CardDescription>
              Status of all gateway checkout transactions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>Completed</span>
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {payments.completedPayments}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs">
              <span className="flex items-center gap-2 font-medium">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span>Pending</span>
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {payments.pendingPayments}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-xs">
              <span className="flex items-center gap-2 font-medium">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
                <span>Failed</span>
              </span>
              <span className="font-bold text-rose-600 dark:text-rose-400">
                {payments.failedPayments}
              </span>
            </div>

            <div className="pt-2 border-t flex justify-between items-center text-xs text-muted-foreground">
              <span>Total Gateway Logs</span>
              <span className="font-mono font-bold text-foreground">
                {payments.totalPayments}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Rental Pipeline Status Breakdown */}
      <Card className="border shadow-xs">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-amber-500" />
            <span>Rental Order Lifecycle Pipeline</span>
          </CardTitle>
          <CardDescription>
            Live count of rental orders categorized by current state.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* PLACED */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <Clock className="h-3.5 w-3.5" />
                <span>Placed</span>
              </div>
              <p className="text-2xl font-bold">{rentals.placedRentals}</p>
              <p className="text-[10px] text-muted-foreground">Awaiting payment</p>
            </div>

            {/* PAID */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium">
                <CreditCard className="h-3.5 w-3.5" />
                <span>Paid</span>
              </div>
              <p className="text-2xl font-bold">{rentals.paidRentals}</p>
              <p className="text-[10px] text-muted-foreground">Payment verified</p>
            </div>

            {/* CONFIRMED */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Confirmed</span>
              </div>
              <p className="text-2xl font-bold">{rentals.confirmedRentals}</p>
              <p className="text-[10px] text-muted-foreground">Accepted by provider</p>
            </div>

            {/* PICKED UP */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                <Truck className="h-3.5 w-3.5" />
                <span>Picked Up</span>
              </div>
              <p className="text-2xl font-bold">{rentals.pickedUpRentals}</p>
              <p className="text-[10px] text-muted-foreground">In customer possession</p>
            </div>

            {/* RETURNED */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Returned</span>
              </div>
              <p className="text-2xl font-bold">{rentals.returnedRentals}</p>
              <p className="text-[10px] text-muted-foreground">Order completed</p>
            </div>

            {/* CANCELLED */}
            <div className="p-4 rounded-xl border bg-card space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                <Ban className="h-3.5 w-3.5" />
                <span>Cancelled</span>
              </div>
              <p className="text-2xl font-bold">{rentals.cancelledRentals}</p>
              <p className="text-[10px] text-muted-foreground">Order voided</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AdminDashboardSkeleton() {
  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <Skeleton key={n} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>

      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}