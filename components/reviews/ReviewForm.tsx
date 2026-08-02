"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star, ArrowLeft, Loader2, Package, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { createReviewAction } from "@/actions/review";
import { RentalOrder } from "@/actions/rental";

interface ReviewFormProps {
  rental: RentalOrder;
  targetItem: any;
  rentalId: string;
  gearItemId: string;
}

export function ReviewForm({ rental, targetItem, rentalId, gearItemId }: ReviewFormProps) {
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gearItemId) {
      toast.error("Gear item ID is missing.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await createReviewAction({
        rentalOrderId: rentalId,
        gearItemId,
        rating,
        comment: comment.trim() || undefined,
      });

      if (res.success) {
        setShowSuccessModal(true);
      } else {
        toast.error(res.error || "Failed to submit review.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4 space-y-8">
      {/* Top Navigation */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-muted-foreground -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Rentals
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Write a Review</h1>
        <p className="text-muted-foreground text-sm">
          Share your experience with this gear to help other renters.
        </p>
      </div>

      {/* Product Summary Card */}
      <div className="rounded-xl border bg-card p-5 flex items-center gap-4 shadow-sm">
        {targetItem.gearItem?.imageUrl ? (
          <div className="relative h-20 w-20 rounded-lg overflow-hidden border">
            <Image
              src={targetItem.gearItem.imageUrl}
              alt={targetItem.gearItem.title || "Gear Image"}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <div className="space-y-1">
          <h2 className="font-semibold text-base">{targetItem.gearItem?.title || "Gear Item"}</h2>
          <p className="text-xs text-muted-foreground">
            Order #{rental.id.slice(0, 8)} &bull; Returned on{" "}
            {new Date(rental.endDate).toLocaleDateString()}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Verified Rental</span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-6 space-y-6 shadow-sm">
        {/* Rating Stars Input */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Overall Rating</Label>
          <div className="flex items-center gap-2 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1 transition-transform hover:scale-110 focus:outline-none"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <Star
                  className={`h-8 w-8 ${
                    (hoverRating || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-medium text-muted-foreground">
              {rating} of 5 Stars
            </span>
          </div>
        </div>

        {/* Comment Input */}
        <div className="space-y-2">
          <Label htmlFor="comment" className="text-sm font-semibold">
            Your Review <span className="text-muted-foreground font-normal">(Optional)</span>
          </Label>
          <Textarea
            id="comment"
            placeholder="How was the condition of the gear? Did it work well for your project?"
            rows={5}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-[120px]">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </form>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md text-center p-6 space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>

          <DialogHeader className="space-y-2 text-center">
            <DialogTitle className="text-xl font-bold">Review Submitted!</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Thank you for your feedback. Your review will help other community members make better rental choices.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center pt-2">
            <Button
              className="w-full sm:w-auto px-6 font-medium"
              onClick={() => router.push("/dashboard/customer/rentals")}
            >
              Back to My Rentals
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}