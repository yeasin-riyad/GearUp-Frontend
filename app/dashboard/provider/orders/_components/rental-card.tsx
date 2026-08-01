"use client";

import Image from "next/image";
import {
  Calendar,
  Package,
  Clock,
  CheckCircle2,
  User,
  ArrowRight,
  Loader2,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProviderRentalOrder } from "@/actions/provider-rental";
import { getActionConfig } from "./provider-rentals-client";

const STATUS_CONFIG: Record<
  string,
  { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: any }
> = {
  PAID: { label: "Payment Received", variant: "outline", icon: Clock },
  CONFIRMED: { label: "Confirmed", variant: "secondary", icon: CheckCircle2 },
  PICKED_UP: { label: "Picked Up", variant: "default", icon: CheckCircle2 },
  RETURNED: { label: "Returned", variant: "secondary", icon: CheckCircle2 },
};

interface RentalCardProps {
  rental: ProviderRentalOrder;
  isUpdating: boolean;
  onActionTrigger: (rental: ProviderRentalOrder) => void;
}

export function RentalCard({ rental, isUpdating, onActionTrigger }: RentalCardProps) {
  const statusConfig = STATUS_CONFIG[rental.status] || {
    label: rental.status,
    variant: "outline",
    icon: Clock,
  };
  const StatusIcon = statusConfig.icon;
  const actionConfig = getActionConfig(rental.status);

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="text-xs font-mono font-medium text-muted-foreground">
              Order #{rental.id.slice(0, 8)}
            </p>
            <Badge variant={statusConfig.variant} className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs">
              <StatusIcon className="h-3 w-3" />
              <span>{statusConfig.label}</span>
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {new Date(rental.startDate).toLocaleDateString()} &mdash;{" "}
              {new Date(rental.endDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Customer Info */}
        {rental.customer && (
          <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 border text-xs">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <div>
              <p className="font-medium">{rental.customer.name}</p>
              <p className="text-muted-foreground text-[11px]">{rental.customer.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="divide-y">
        {rental.items?.map((item) => (
          <div
            key={item.id}
            className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
          >
            <div className="flex items-center gap-3">
              {item.gearItem?.imageUrl ? (
                <Image
                  src={item.gearItem.imageUrl}
                  alt={item.gearItem.title}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg object-cover border"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
              )}

              <div>
                <p className="font-medium text-sm">
                  {item.gearItem?.title || "Gear Item"}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${item.pricePerDay}/day &times; Qty {item.quantity}
                </p>
              </div>
            </div>

            <p className="font-semibold text-sm">
              ${item.subtotal.toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          Received on {new Date(rental.createdAt).toLocaleDateString()}
        </div>

        <div className="flex items-center gap-4">
          {actionConfig && (
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={() => onActionTrigger(rental)}
              className="h-9 px-4 text-xs font-medium"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <span>{actionConfig.buttonLabel}</span>
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          )}

          {rental.status === "RETURNED" && (
            <Badge variant="secondary" className="px-3 py-1 text-xs">
              <Check className="mr-1 h-3 w-3 text-green-600" /> Complete
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}