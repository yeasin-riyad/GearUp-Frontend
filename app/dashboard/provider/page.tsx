"use client";

import { useEffect, useState } from "react";
import {
  Package,
  CheckCircle2,
  XCircle,
  DollarSign,
  Clock,
  Truck,
  RotateCcw,
  ShieldAlert,
  Loader2,
  TrendingUp,
  Box,
  CreditCard,
  Ban,
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
import { Badge } from "@/components/ui/badge";

import {
  getProviderDashboardAction,
  ProviderDashboardData,
} from "@/actions/provider";

export default function ProviderOverviewPage() {
  const [dashboard, setDashboard] = useState<ProviderDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getProviderDashboardAction();
      if (res.success && res.data) {
        setDashboard(res.data);
      } else {
        const errorMsg = res.error || "Failed to load provider metrics.";
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

  if (loading) return <DashboardSkeleton />;

  if (error || !dashboard) {
    return (
      <div className="container mx-auto max-w-4xl py-16 px-4 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-xl font-bold">Failed to load Dashboard</h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          {error || "Could not retrieve performance metrics."}
        </p>
        <Button onClick={loadDashboardData} className="h-10 px-6 font-medium">
          Try Again
        </Button>
      </div>
    );
  }

  // Calculate total rental orders count across all statuses
  const totalRentalOrders =
    dashboard.placedRentals +
    dashboard.paidRentals +
    dashboard.confirmedRentals +
    dashboard.pickedUpRentals +
    dashboard.returnedRentals +
    dashboard.cancelledRentals;

  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Provider Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor equipment inventory, revenue analytics, and order fulfillment.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadDashboardData}
          className="w-fit"
        >
          Refresh Data
        </Button>
      </div>

      {/* Top Level Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Revenue */}
        <Card className="border shadow-xs bg-linear-to-br from-card to-emerald-500/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/50 rounded-xl text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${dashboard.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span>Earnings from completed payments</span>
            </p>
          </CardContent>
        </Card>

        {/* Total Gear Items */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gear Items
            </CardTitle>
            <div className="p-2 bg-blue-100 dark:bg-blue-950/50 rounded-xl text-blue-600 dark:text-blue-400">
              <Package className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {dashboard.totalGears}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboard.availableGears} Available &bull; {dashboard.unavailableGears} Unavailable
            </p>
          </CardContent>
        </Card>

        {/* Total Orders */}
        <Card className="border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders Processed
            </CardTitle>
            <div className="p-2 bg-purple-100 dark:bg-purple-950/50 rounded-xl text-purple-600 dark:text-purple-400">
              <Box className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {totalRentalOrders}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all lifecycle statuses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory Availability Breakdown */}
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg">Inventory Status</CardTitle>
            <CardDescription>
              Current availability status of your listed gear items.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Available */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Available Gear</p>
                  <p className="text-xs text-muted-foreground">
                    Ready for customers to rent
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold">{dashboard.availableGears}</span>
            </div>

            {/* Unavailable */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-sm">Unavailable Gear</p>
                  <p className="text-xs text-muted-foreground">
                    Currently rented or unlisted
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold">{dashboard.unavailableGears}</span>
            </div>
          </CardContent>
        </Card>

        {/* Rental Order Breakdown */}
        <Card className="border shadow-xs">
          <CardHeader>
            <CardTitle className="text-lg">Rental Orders Breakdown</CardTitle>
            <CardDescription>
              Distribution of orders across fulfillment stages.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {/* PLACED */}
            <div className="p-3 rounded-lg border bg-card flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Placed</span>
                </div>
                <p className="text-2xl font-bold">{dashboard.placedRentals}</p>
              </div>
            </div>

            {/* PAID */}
            <div className="p-3 rounded-lg border bg-card flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 font-medium">
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Paid</span>
                </div>
                <p className="text-2xl font-bold">{dashboard.paidRentals}</p>
              </div>
            </div>

            {/* CONFIRMED */}
            <div className="p-3 rounded-lg border bg-card flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Confirmed</span>
                </div>
                <p className="text-2xl font-bold">{dashboard.confirmedRentals}</p>
              </div>
            </div>

            {/* PICKED UP */}
            <div className="p-3 rounded-lg border bg-card flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <Truck className="h-3.5 w-3.5" />
                  <span>Picked Up</span>
                </div>
                <p className="text-2xl font-bold">{dashboard.pickedUpRentals}</p>
              </div>
            </div>

            {/* RETURNED */}
            <div className="p-3 rounded-lg border bg-card flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Returned</span>
                </div>
                <p className="text-2xl font-bold">{dashboard.returnedRentals}</p>
              </div>
            </div>

            {/* CANCELLED */}
            <div className="p-3 rounded-lg border bg-card flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  <Ban className="h-3.5 w-3.5" />
                  <span>Cancelled</span>
                </div>
                <p className="text-2xl font-bold">{dashboard.cancelledRentals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl py-8 px-4 space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <Skeleton key={n} className="h-32 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}