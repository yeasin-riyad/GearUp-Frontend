"use client";

import { useEffect, useState } from "react";
import { Star, Edit2, Trash2, Calendar, Package, Loader2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  fetchMyReviewsAction,
  updateReviewAction,
  deleteReviewAction,
} from "@/actions/review";

interface ReviewItem {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  gearItem: {
    id: string;
    name: string;
  };
  rentalOrder: {
    id: string;
    startDate: string;
    endDate: string;
  };
}

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit State
  const [editReview, setEditReview] = useState<ReviewItem | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editComment, setEditComment] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    const res = await fetchMyReviewsAction();
    if (res.success && res.data) {
      setReviews(res.data);
    } else {
      toast.error(res.error || "Failed to load reviews");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Update Review Handler
  const handleUpdate = async () => {
    if (!editReview) return;
    setIsUpdating(true);

    const res = await updateReviewAction(editReview.id, {
      rating: editRating,
      comment: editComment,
    });

    if (res.success) {
      toast.success(res.message);
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editReview.id
            ? { ...r, rating: editRating, comment: editComment }
            : r
        )
      );
      setEditReview(null);
    } else {
      toast.error(res.error);
    }
    setIsUpdating(false);
  };

  // Delete Review Handler
  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const res = await deleteReviewAction(deleteId);

    if (res.success) {
      toast.success(res.message);
      setReviews((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    } else {
      toast.error(res.error);
    }
    setIsDeleting(false);
  };

  if (loading) return <ReviewsSkeleton />;

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-muted-foreground text-sm">
          Manage your ratings and feedback for rented equipment.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card space-y-3">
          <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-medium">No reviews yet</h2>
          <p className="text-sm text-muted-foreground">
            You haven't left any reviews for your rentals.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 border rounded-xl bg-card space-y-4 shadow-sm hover:shadow-md transition-all"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-base">
                    {review.gearItem?.name || "Gear Item"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2.5 text-xs gap-1.5"
                    onClick={() => {
                      setEditReview(review);
                      setEditRating(review.rating);
                      setEditComment(review.comment || "");
                    }}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    className="h-8 px-2.5 text-xs gap-1.5"
                    onClick={() => setDeleteId(review.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>

              {/* Rating & Rental Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        review.rating >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>

                {review.rentalOrder && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      Rented: {new Date(review.rentalOrder.startDate).toLocaleDateString()} &mdash;{" "}
                      {new Date(review.rentalOrder.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {review.comment && (
                <p className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-lg">
                  "{review.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Review Modal */}
      <Dialog open={Boolean(editReview)} onOpenChange={() => setEditReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-medium block mb-1.5">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-all ${
                      editRating >= star
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/30"
                    }`}
                    onClick={() => setEditRating(star)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1.5">Your Feedback</label>
              <Textarea
                rows={4}
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                placeholder="Write your review here..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditReview(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={Boolean(deleteId)} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-6 border rounded-xl space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}