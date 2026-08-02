"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getMyRentalsAction, RentalOrder } from "@/actions/rental";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export default function AddReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rentalId = params.rentalId as string;
  const gearItemId = searchParams.get("gearItemId");

  const [rental, setRental] = useState<RentalOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const res = await getMyRentalsAction();
        if (res.success) {
          const found = res.rentals.find((r: RentalOrder) => r.id === rentalId);
          setRental(found || null);
        }
      } catch (err) {
        toast.error("Failed to fetch rental details.");
      } finally {
        setLoading(false);
      }
    };

    fetchRental();
  }, [rentalId]);

  if (loading) return <ReviewSkeleton />;

  const targetItem = rental?.items?.find((item) => item.gearItemId === gearItemId);

  if (!rental || !targetItem || !gearItemId) {
    return (
      <div className="container mx-auto max-w-xl py-20 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">Item Not Found</h1>
        <p className="text-muted-foreground text-sm">
          Could not find the rental item associated with this review request.
        </p>
        <Button
          onClick={() => router.push("/dashboard/customer/rentals")}
          className="mt-4"
        >
          Back to My Rentals
        </Button>
      </div>
    );
  }

  return (
    <ReviewForm
      rental={rental}
      targetItem={targetItem}
      rentalId={rentalId}
      gearItemId={gearItemId}
    />
  );
}

function ReviewSkeleton() {
  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 space-y-6">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}