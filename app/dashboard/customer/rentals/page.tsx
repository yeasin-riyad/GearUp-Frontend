// src/app/rentals/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  getMyRentalsAction,
  cancelRentalAction,
  RentalOrder,
} from "@/actions/rental";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: any }
> = {
  PLACED: { label: "Placed", variant: "outline", icon: Clock },
  PENDING: { label: "Pending", variant: "outline", icon: Clock },
  APPROVED: { label: "Approved", variant: "secondary", icon: CheckCircle2 },
  ACTIVE: { label: "Active", variant: "default", icon: CheckCircle2 },
  COMPLETED: { label: "Completed", variant: "secondary", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", variant: "destructive", icon: XCircle },
};

export default function MyRentalsPage() {
  const [rentals, setRentals] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadRentals = async () => {
    try {
      const res = await getMyRentalsAction();
      if (res.success) {
        setRentals(res.rentals);
      } else {
        setError(res.error || "Failed to load rentals.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRentals();
  }, []);

  const handleCancelRental = async () => {
    if (!selectedRentalId) return;

    const rentalId = selectedRentalId;
    setSelectedRentalId(null); // Close modal right away
    setCancellingId(rentalId);

    try {
      const res = await cancelRentalAction(rentalId);

      if (res.success) {
        toast.success("Rental order cancelled successfully.");
        // Optimistically update status to CANCELLED
        setRentals((prev) =>
          prev.map((item) =>
            item.id === rentalId ? { ...item, status: "CANCELLED" } : item
          )
        );
      } else {
        toast.error(res.error || "Failed to cancel order.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while cancelling.");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) return <RentalsSkeleton />;

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl py-16 px-4 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-xl font-bold">Failed to load rentals</h1>
        <p className="text-muted-foreground text-sm">{error}</p>
        <Button onClick={() => window.location.reload()} className="h-12 px-6 text-sm font-medium">
          Try Again
        </Button>
      </div>
    );
  }

  if (rentals.length === 0) {
    return (
      <div className="container mx-auto max-w-lg py-20 px-4 text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-4">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">No Rentals Found</h1>
          <p className="text-muted-foreground text-sm">
            You haven't placed any rental orders yet. Explore our gear collection to start renting.
          </p>
        </div>
        <Button
          className="h-12 px-6 text-sm font-medium"
          render={(props) => (
            <Link {...props} href="/gear">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Browse Available Gear</span>
            </Link>
          )}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Rental Orders</h1>
        <p className="text-muted-foreground text-sm">
          Track and manage your current and past gear rentals.
        </p>
      </div>

      <div className="space-y-6">
        {rentals.map((rental) => {
          const statusConfig = STATUS_CONFIG[rental.status] || {
            label: rental.status,
            variant: "outline",
            icon: Clock,
          };
          const StatusIcon = statusConfig.icon;
          const isCancelable = rental.status === "PLACED";
          const isCancellingThis = cancellingId === rental.id;

          return (
            <div
              key={rental.id}
              className="rounded-xl border bg-card p-6 space-y-4 shadow-sm transition-all hover:shadow-md"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
                <div className="space-y-1">
                  <p className="text-xs font-mono text-muted-foreground">
                    Order #{rental.id.slice(0, 8)}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {new Date(rental.startDate).toLocaleDateString()} &mdash;{" "}
                      {new Date(rental.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Badge variant={statusConfig.variant} className="flex items-center gap-1.5 px-3 py-1 text-xs">
                  <StatusIcon className="h-3.5 w-3.5" />
                  <span>{statusConfig.label}</span>
                </Badge>
              </div>

              {/* Items List */}
              <div className="divide-y">
                {rental.items?.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      {item.gearItem?.imageUrl ? (
                        <img
                          src={item.gearItem.imageUrl}
                          alt={item.gearItem.title}
                          className="h-12 w-12 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}

                      <div>
                        <p className="font-medium text-sm">{item.gearItem?.title || "Gear Item"}</p>
                        <p className="text-xs text-muted-foreground">
                          ${item.pricePerDay}/day &times; Qty {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="font-semibold text-sm">${item.subtotal.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4 text-sm">
                <div className="text-xs text-muted-foreground">
                  Booked on {new Date(rental.createdAt).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-4">
                  {rental.totalAmount !== undefined && (
                    <p className="text-sm">
                      <span className="text-muted-foreground">Total: </span>
                      <strong className="text-base font-bold">${rental.totalAmount.toFixed(2)}</strong>
                    </p>
                  )}

                  {/* Cancel Button */}
                  {isCancelable && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isCancellingThis}
                      onClick={() => setSelectedRentalId(rental.id)}
                      className="h-9 px-4 text-xs font-medium"
                    >
                      {isCancellingThis ? (
                        <>
                          <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <span>Cancel Order</span>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Shadcn Cancel Confirmation Dialog */}
      <AlertDialog
        open={Boolean(selectedRentalId)}
        onOpenChange={(open) => !open && setSelectedRentalId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Rental Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRental}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RentalsSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-xl border p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center gap-4 py-2">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}