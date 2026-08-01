// src/app/cart/page.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Calendar,
  ShieldAlert,
} from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { processCheckoutAction } from "@/actions/checkout";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart, updateQuantity, isInitialized } =
    useCart();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Minimum date selection constraint (Today)
  const todayStr = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split("T")[0];
  }, []);

  // Calculate rental duration in days
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start >= end) return 0;

    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // Calculations
  const dailySubtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + item.pricePerDay * item.quantity,
      0
    );
  }, [cart]);

  const totalRentalPrice = dailySubtotal * (rentalDays > 0 ? rentalDays : 1);

  // Handle quantity adjustment safely
  const handleQuantityChange = (
    gearItemId: string,
    newQty: number,
    currentStock: number
  ) => {
    if (isNaN(newQty) || newQty < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    if (newQty > currentStock) {
      toast.error(`Only ${currentStock} units available in stock.`);
      updateQuantity(gearItemId, currentStock);
      return;
    }

    updateQuantity(gearItemId, newQty);
  };

  // Submit order & initiate Stripe Checkout
 const handleCheckout = async () => {
  if (cart.length === 0) {
    toast.error("Your cart is empty.");
    return;
  }

  if (!startDate || !endDate) {
    toast.error("Please select both start and end rental dates.");
    return;
  }

  if (rentalDays <= 0) {
    toast.error("End date must be after the start date.");
    return;
  }

  try {
    setIsSubmitting(true);

 

    const payload = {
      startDate,
      endDate,
      providerId: cart[0].providerId,
      items: cart.map((item) => ({
        gearItemId: item.gearItemId,
        quantity: item.quantity,
      })),
    };

    // Call Server Action
    const result = await processCheckoutAction(payload);

    if (!result.success || !result.checkoutUrl) {
      throw new Error(result.error || "Failed to initiate checkout.");
    }

    toast.success("Redirecting to Stripe...");
    clearCart();

    // Redirect user to Stripe Hosted Checkout
    window.location.href = result.checkoutUrl;
  } catch (err: unknown) {
    const error = err as Error;
    toast.error(error.message || "Checkout failed.");
    setIsSubmitting(false);
  }
};

  if (!isInitialized) {
    return <CartSkeleton />;
  }

  if (cart.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rental Cart</h1>
          <p className="text-sm text-muted-foreground">
            Review your selected equipment and choose rental dates.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <CartItemCard
              key={item.gearItemId}
              item={item}
              onQuantityChange={handleQuantityChange}
              onRemove={removeFromCart}
            />
          ))}

          <Link
            href="/gears"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline pt-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" /> Continue browsing gear
          </Link>
        </div>

        {/* Order Summary & Date Picker */}
        <CartSummary
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          todayStr={todayStr}
          dailySubtotal={dailySubtotal}
          rentalDays={rentalDays}
          totalRentalPrice={totalRentalPrice}
          isSubmitting={isSubmitting}
          cartCount={cart.length}
          onCheckout={handleCheckout}
        />
      </div>
    </div>
  );
}

// Sub-component: Cart Item Card
function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange: (
    gearItemId: string,
    newQty: number,
    currentStock: number
  ) => void;
  onRemove: (gearItemId: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card shadow-xs">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{item.name}</h3>
          <p className="text-sm font-medium text-primary">
            ${item.pricePerDay}{" "}
            <span className="text-xs text-muted-foreground">/ day</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Available Stock: {item.stock}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0">
        <div className="flex items-center gap-2">
          <label
            htmlFor={`qty-${item.gearItemId}`}
            className="text-xs text-muted-foreground sm:hidden"
          >
            Qty:
          </label>
          <Input
            id={`qty-${item.gearItemId}`}
            type="number"
            min={1}
            max={item.stock}
            value={item.quantity}
            onChange={(e) =>
              onQuantityChange(
                item.gearItemId,
                parseInt(e.target.value) || 1,
                item.stock
              )
            }
            className="w-16 h-9 text-center text-sm"
          />
        </div>

        <div className="text-right min-w-[80px]">
          <p className="text-sm font-semibold">
            ${item.pricePerDay * item.quantity}
          </p>
          <p className="text-[10px] text-muted-foreground">/ day total</p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.gearItemId)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Sub-component: Rental Summary Sidebar
function CartSummary({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  todayStr,
  dailySubtotal,
  rentalDays,
  totalRentalPrice,
  isSubmitting,
  cartCount,
  onCheckout,
}: {
  startDate: string;
  endDate: string;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  todayStr: string;
  dailySubtotal: number;
  rentalDays: number;
  totalRentalPrice: number;
  isSubmitting: boolean;
  cartCount: number;
  onCheckout: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-6">
        <h2 className="font-semibold text-lg border-b pb-3">Rental Summary</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                min={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              End Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                min={startDate || todayStr}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 h-10 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Daily rate subtotal</span>
            <span>${dailySubtotal} / day</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Rental duration</span>
            <span>
              {rentalDays > 0 ? `${rentalDays} day(s)` : "Select dates"}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between font-bold text-base text-foreground">
            <span>Estimated Total</span>
            <span>${totalRentalPrice}</span>
          </div>
        </div>

        <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground flex gap-2">
          <ShieldAlert className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>
            All items in your cart are restricted to a single provider to
            streamline handover.
          </span>
        </div>

        <Button
          onClick={onCheckout}
          disabled={isSubmitting || cartCount === 0}
          className="w-full h-11 font-semibold"
        >
          {isSubmitting ? "Redirecting to Stripe..." : "Request to Rent All"}
        </Button>
      </div>
    </div>
  );
}

// Sub-component: Empty State
function EmptyCartState() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 text-center space-y-4">
      <div className="flex justify-center">
        <div className="rounded-full bg-muted p-6 text-muted-foreground">
          <ShoppingBag className="h-12 w-12" />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Your Cart is Empty</h1>
      <p className="text-muted-foreground max-w-md mx-auto">
        Looks like you haven't added any gear to your cart yet. Explore
        available gear and rent equipment today.
      </p>
      <Button
        className="mt-4 my-2 px-4 py-2.5 flex items-center justify-center gap-2"
        render={(props) => (
          <Link {...props} href="/gears">
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Gear</span>
          </Link>
        )}
      />
    </div>
  );
}

// Sub-component: Loading Skeleton
function CartSkeleton() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 space-y-8 animate-in fade-in-50 duration-300">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-card shadow-xs"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-20 w-20 rounded-lg flex-shrink-0" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
              <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0">
                <Skeleton className="h-9 w-16 rounded-md" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-6 space-y-6">
          <Skeleton className="h-6 w-36 border-b pb-3" />
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between pt-2 border-t">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}