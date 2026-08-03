"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { toast } from "sonner";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  updateRentalStatusAction,
  ProviderRentalOrder,
} from "@/actions/provider-rental";
import { RentalCard } from "./rental-card";

export type ActionConfig = {
  type: "confirm" | "ready" | "pick-up" | "return";
  title: string;
  description: string;
  buttonLabel: string;
  badgeLabel: string;
  variant: "default" | "secondary" | "outline";
};

export function getActionConfig(status: string): ActionConfig | null {
  switch (status) {
    case "PAID":
      return {
        type: "ready",
        title: "Mark as Ready for Pickup",
        description:
          "Confirm that the gear is prepared and ready for customer pickup.",
        buttonLabel: "Ready for Pickup",
        badgeLabel: "Payment Received",
        variant: "default",
      };
    case "CONFIRMED":
      return {
        type: "pick-up",
        title: "Mark as Picked Up",
        description:
          "Confirm that the customer has picked up the rental equipment.",
        buttonLabel: "Confirm Pick Up",
        badgeLabel: "Awaiting Pickup",
        variant: "secondary",
      };
    case "PICKED_UP":
      return {
        type: "return",
        title: "Mark as Returned",
        description:
          "Confirm that the equipment has been returned in good condition. Stock levels will be restored automatically.",
        buttonLabel: "Confirm Return",
        badgeLabel: "Active Rental",
        variant: "outline",
      };
    default:
      return null;
  }
}

interface ProviderRentalsClientProps {
  initialRentals: ProviderRentalOrder[];
}

export function ProviderRentalsClient({
  initialRentals,
}: ProviderRentalsClientProps) {
  const [rentals, setRentals] = useState<ProviderRentalOrder[]>(initialRentals);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("ALL");

  // Modal State
  const [selectedRental, setSelectedRental] =
    useState<ProviderRentalOrder | null>(null);
  const [pendingAction, setPendingAction] = useState<ActionConfig | null>(null);

  const triggerActionModal = (rental: ProviderRentalOrder) => {
    const config = getActionConfig(rental.status);
    if (!config) return;

    setSelectedRental(rental);
    setPendingAction(config);
  };

  const handleExecuteStatusChange = async () => {
    if (!selectedRental || !pendingAction) return;

    const rentalId = selectedRental.id;
    const actionTypeForRequest: "confirm" | "pick-up" | "return" =
      pendingAction.type === "ready" ? "confirm" : pendingAction.type;
    const actionType = pendingAction.type;

    setSelectedRental(null);
    setPendingAction(null);
    setUpdatingId(rentalId);

    try {
      const res = await updateRentalStatusAction(rentalId, actionTypeForRequest);

      if (res.success) {
        toast.success(res.message);

        const nextStatusMap: Record<string, ProviderRentalOrder["status"]> = {
          confirm: "CONFIRMED",
          ready: "CONFIRMED",
          "pick-up": "PICKED_UP",
          return: "RETURNED",
        };

        const newStatus = nextStatusMap[actionType];

        setRentals((prev) =>
          prev.map((item) =>
            item.id === rentalId ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error(res.error || "Action failed.");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredRentals = rentals.filter((rental) => {
    if (activeTab === "ALL") return true;
    return rental.status === activeTab;
  });

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Incoming Rental Orders
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage rental fulfillment, handovers, and equipment returns.
        </p>
      </div>

      {/* Filter Tabs */}
      <Tabs defaultValue="ALL" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 max-w-3xl">
          <TabsTrigger value="ALL">All ({rentals.length})</TabsTrigger>
          <TabsTrigger value="PAID">
            Paid ({rentals.filter((r) => r.status === "PAID").length})
          </TabsTrigger>
          <TabsTrigger value="CONFIRMED">
            Confirmed ({rentals.filter((r) => r.status === "CONFIRMED").length})
          </TabsTrigger>
          <TabsTrigger value="PICKED_UP">
            Active ({rentals.filter((r) => r.status === "PICKED_UP").length})
          </TabsTrigger>
          <TabsTrigger value="RETURNED">
            Returned ({rentals.filter((r) => r.status === "RETURNED").length})
          </TabsTrigger>
          <TabsTrigger value="CANCELLED">
            Cancelled ({rentals.filter((r) => r.status === "CANCELLED").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredRentals.length === 0 ? (
        <div className="container mx-auto max-w-md py-16 text-center space-y-4 border rounded-xl bg-card">
          <Package className="h-10 w-10 text-muted-foreground mx-auto" />
          <h2 className="text-lg font-medium">No rentals found</h2>
          <p className="text-sm text-muted-foreground">
            {activeTab === "ALL"
              ? "You don't have any incoming rental requests right now."
              : `No rental orders matching '${activeTab}' status.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredRentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              isUpdating={updatingId === rental.id}
              onActionTrigger={triggerActionModal}
            />
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog
        open={Boolean(selectedRental && pendingAction)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRental(null);
            setPendingAction(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pendingAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction?.description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleExecuteStatusChange}>
              {pendingAction?.buttonLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}