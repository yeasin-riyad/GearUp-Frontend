// src/app/payment/success/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Brief local state resolve to avoid layout jump
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SuccessSkeleton />;
  }

  return (
    <div className="container mx-auto max-w-lg py-16 px-4 text-center space-y-6">
      <div className="flex justify-center">
        <div className="rounded-full bg-emerald-100 p-4 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle2 className="h-12 w-12" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Payment Successful!</h1>
        <p className="text-muted-foreground text-sm">
          Your rental order has been placed and confirmed.
        </p>
      </div>

      {sessionId && (
        <div className="p-4 rounded-xl border bg-card text-left text-xs space-y-2 text-muted-foreground">
          <p>
            <strong className="text-foreground">Session ID:</strong> {sessionId}
          </p>
          <p>
            A confirmation email with rental pickup instructions has been sent to
            your registered email address.
          </p>
        </div>
      )}

      {/* Taller Action Buttons using render prop */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
        <Button
          variant="outline"
          className="w-full sm:w-auto h-12 px-6 text-sm font-medium"
          render={(props) => (
            <Link {...props} href="/dashboard/customer/rentals">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>View My Rentals</span>
            </Link>
          )}
        />

        <Button
          className="w-full sm:w-auto h-12 px-6 text-sm font-medium"
          render={(props) => (
            <Link {...props} href="/gears">
              <span>Explore More Gear</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        />
      </div>
    </div>
  );
}

function SuccessSkeleton() {
  return (
    <div className="container mx-auto max-w-lg py-20 px-4 text-center space-y-4">
      <Skeleton className="h-16 w-16 rounded-full mx-auto" />
      <Skeleton className="h-7 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <Skeleton className="h-20 w-full rounded-xl mt-4" />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessContent />
    </Suspense>
  );
}