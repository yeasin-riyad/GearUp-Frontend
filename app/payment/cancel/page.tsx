// src/app/payment/cancel/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { XCircle, ShoppingCart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function CancelContent() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Brief local state resolve to prevent layout flickering
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CancelSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-lg py-16 px-4 text-center space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-amber-100 p-4 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <XCircle className="h-12 w-12" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Checkout Canceled</h1>
        <p className="text-muted-foreground text-sm">
          Your payment was not processed. No charges were made to your account.
        </p>
      </div>

      <div className="p-4 rounded-xl border bg-card text-left text-xs space-y-2 text-muted-foreground">
        <p className="font-medium text-foreground">Need help completing your rental?</p>
        <p>
          Your cart items have been saved so you can try checking out again whenever you're ready, or continue browsing gear.
        </p>
      </div>

      {/* Taller Action Buttons using render prop */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Button
          className="w-full sm:w-auto h-12 px-6 text-sm font-medium"
          render={(props) => (
            <Link {...props} href="/cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              <span>Return to Cart</span>
            </Link>
          )}
        />

        <Button
          variant="outline"
          className="w-full sm:w-auto h-12 px-6 text-sm font-medium"
          render={(props) => (
            <Link {...props} href="/gears">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Continue Browsing</span>
            </Link>
          )}
        />
      </div>
    </div>
  );
}

function CancelSkeleton() {
  return (
    <div className="container mx-auto max-w-lg py-20 px-4 text-center space-y-4">
      <Skeleton className="h-16 w-16 rounded-full mx-auto" />
      <Skeleton className="h-7 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <Skeleton className="h-20 w-full rounded-xl mt-4" />
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<CancelSkeleton />}>
      <CancelContent />
    </Suspense>
  );
}