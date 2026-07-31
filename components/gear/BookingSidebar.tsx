// src/components/gear/BookingSidebar.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Calendar, Info, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface GearItem {
  id: string;
  name: string;
  pricePerDay: number;
  deposit?: number;
  stock: number;
  providerId: string;
  availability: string;
  image?: string;
}

interface BookingSidebarProps {
  gearItem: GearItem;
  currentUser?: Record<string, unknown> | null;
}

export function BookingSidebar({
  gearItem,
  currentUser = null,
}: BookingSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { addToCart } = useCart();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);

  console.log(gearItem,"Gear...")

  // Today's date string (YYYY-MM-DD)
  const todayStr = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split("T")[0];
  }, []);

  // Calculate rental days based on start and end dates
  const rentalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (start >= end) return 0;

    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  // Price calculations
  const pricePerDay = gearItem?.pricePerDay ?? 0;
  const deposit = gearItem?.deposit ?? 0;
  const stock = gearItem?.stock ?? 0;
  const isAvailable = gearItem?.availability === "AVAILABLE";

  const subtotal = pricePerDay * quantity * (rentalDays || 1);
  const grandTotal = subtotal + deposit;

  // Add item to local cart
  const handleAddToCart = () => {
    if (!isAvailable) {
      toast.error("This gear item is currently unavailable.");
      return;
    }

    addToCart({
      gearItemId: gearItem.id,
      name: gearItem.name,
      pricePerDay: gearItem.pricePerDay,
      stock: gearItem.stock,
      providerId: gearItem.providerId,
      quantity: quantity,
      image: gearItem.images[0],
    });
  };

  // Direct rental submission matching backend validation rules
  const handleRentalRequest = async () => {
    // 1. Authentication check
    if (!currentUser) {
      toast.info("Please log in to make a rental request.");
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // 2. Date presence check
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 3. Date validity checks
    if (start < today) {
      toast.error("Start date cannot be in the past.");
      return;
    }

    if (start >= end) {
      toast.error("End date must be after the start date.");
      return;
    }

    // 4. Quantity and stock checks
    if (quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }

    if (quantity > stock) {
      toast.error(`Only ${stock} unit(s) available in stock.`);
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        startDate,
        endDate,
        items: [
          {
            gearItemId: gearItem.id,
            quantity: quantity,
          },
        ],
      };

      // Call your backend Server Action or API endpoint here:
      // await createRentalOrderAction(payload);

      toast.success("Rental request submitted successfully!");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to submit rental request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="sticky top-20 rounded-2xl border bg-card p-6 shadow-md space-y-6">
      {/* Price Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-extrabold text-foreground">
            ${pricePerDay}
          </span>
          <span className="text-muted-foreground text-sm"> / day</span>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
          Deposit: ${deposit}
        </span>
      </div>

      <hr className="border-border" />

      {/* Date & Quantity Inputs */}
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

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">
            Quantity (Stock: {stock})
          </label>
          <Input
            type="number"
            min={1}
            max={stock}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="h-10 text-sm"
          />
        </div>
      </div>

      {/* Dynamic Price Breakdown */}
      <div className="space-y-2 text-sm pt-2">
        <div className="flex justify-between text-muted-foreground">
          <span>
            ${pricePerDay} × {quantity} item(s) × {rentalDays || 1} day(s)
          </span>
          <span>${subtotal}</span>
        </div>
        {deposit > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Refundable Deposit</span>
            <span>${deposit}</span>
          </div>
        )}
        <hr className="border-border pt-1" />
        <div className="flex justify-between font-bold text-base text-foreground">
          <span>Total Amount</span>
          <span>${grandTotal}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          onClick={handleRentalRequest}
          disabled={isLoading || !isAvailable}
          className="w-full h-11 text-base font-semibold shadow-xs"
        >
          {isLoading ? "Processing..." : "Request to Rent"}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className="w-full h-10 text-sm font-medium border-primary/30 text-primary hover:bg-primary/5"
        >
          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Info className="h-3.5 w-3.5" />
        You won't be charged until the owner approves your request.
      </p>
    </div>
  );
}