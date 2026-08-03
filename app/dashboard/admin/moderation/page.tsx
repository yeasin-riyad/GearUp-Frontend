"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Search,
  Package,
  ShoppingBag,
  Trash2,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  CreditCard,
  MapPin,
  Tag,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

// Server Actions Imports
import {
  getAllGearsAction,
  deleteGearAction,
  updateGearAction,
} from "@/actions/gear.action";
import {
  // getIncomingRentalsAction,
  updateRentalStatusAction,
} from "@/actions/provider-rental";
import { getAllIncomingRentalsForAdminAction } from "@/actions/admin.action";

// Data Types matching Prisma schema & API response
export interface GearItem {
  id: string;
  name: string;
  description?: string;
  brand?: string;
  pricePerDay: number;
  deposit?: number;
  stock: number;
  availability?: "AVAILABLE" | "UNAVAILABLE";
  images: string[];
  location?: string;
  features?: string[];
  category?: {
    id: string;
    name: string;
    slug?: string;
  };
  provider?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
}

export interface RentalOrderItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  quantity: number;
  pricePerDay: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  gearItem: GearItem;
}

export interface RentalPayment {
  id: string;
  amount: number;
  status: string;
  paidAt?: string;
  stripePaymentIntentId?: string;
}

export interface RentalOrder {
  id: string;
  customerId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: "PENDING" | "PAID" | "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  customer?: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
  };
  payment?: RentalPayment;
  items: RentalOrderItem[];
}

export interface MetaPagination {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export default function AdminModerationPage() {
  const [activeTab, setActiveTab] = useState<"gears" | "orders">("gears");

  // Gears State
  const [gears, setGears] = useState<GearItem[]>([]);
  const [gearMeta, setGearMeta] = useState<MetaPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [gearLoading, setGearLoading] = useState(true);
  const [gearSearch, setGearSearch] = useState("");

  // Orders State
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [orderMeta, setOrderMeta] = useState<MetaPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");

  // Modals & Inspection States
  const [inspectedGear, setInspectedGear] = useState<GearItem | null>(null);
  const [inspectedOrder, setInspectedOrder] = useState<RentalOrder | null>(null);
  const [selectedDeleteGear, setSelectedDeleteGear] = useState<GearItem | null>(null);
  
  // Loading indicators
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Load Gears
  const loadGears = useCallback(async (page = 1) => {
    setGearLoading(true);
    const queryParams: Record<string, string> = {
      page: page.toString(),
      limit: "10",
    };
    if (gearSearch.trim()) {
      queryParams.searchTerm = gearSearch.trim();
    }

    const res = await getAllGearsAction(queryParams);

    if (res.success) {
      setGears(res.data);
      if (res.meta) {
        setGearMeta({
          page: res.meta.page || page,
          limit: res.meta.limit || 10,
          total: res.meta.total || res.data.length,
          totalPage: res.meta.totalPage || 1,
        });
      }
    } else {
      toast.error(res.message || "Failed to fetch gears.");
    }
    setGearLoading(false);
  }, [gearSearch]);

  // Load Rental Orders
  const loadOrders = useCallback(async (page = 1) => {
  setOrderLoading(true);
  
  const queryParams = {
    page,
    limit: 10,
    ...(orderSearch.trim() && { searchTerm: orderSearch.trim() }),
  };

  // Call the dedicated admin server action
  const res = await getAllIncomingRentalsForAdminAction(queryParams);

  if (res.success) {
    setOrders(res.data);
    if (res.meta) {
      setOrderMeta({
        page: res.meta.page || page,
        limit: res.meta.limit || 10,
        total: res.meta.total || res.data.length,
        totalPage: res.meta.totalPage || 1,
      });
    }
  } else {
    toast.error(res.message || "Failed to fetch rental orders.");
  }
  
  setOrderLoading(false);
}, [orderSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === "gears") {
        loadGears(1);
      } else {
        loadOrders(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [activeTab, gearSearch, orderSearch, loadGears, loadOrders]);

  // Actions
  const handleDeleteGear = async () => {
    if (!selectedDeleteGear) return;
    setIsDeleting(true);

    const res = await deleteGearAction(selectedDeleteGear.id);
    if (res.success) {
      toast.success(res.message || "Gear deleted successfully");
      setGears((prev) => prev.filter((item) => item.id !== selectedDeleteGear.id));
    } else {
      toast.error(res.message || "Failed to delete gear.");
    }

    setIsDeleting(false);
    setSelectedDeleteGear(null);
  };

  const handleToggleStock = async (gear: GearItem) => {
    setIsTogglingStatus(gear.id);
    const newStock = gear.stock > 0 ? 0 : 1;

    const res = await updateGearAction(gear.id, { stock: newStock });
    if (res.success) {
      toast.success("Gear stock updated successfully!");
      setGears((prev) =>
        prev.map((item) =>
          item.id === gear.id
            ? {
                ...item,
                stock: newStock,
                availability: newStock > 0 ? "AVAILABLE" : "UNAVAILABLE",
              }
            : item
        )
      );
    } else {
      toast.error(res.message || "Failed to update gear stock.");
    }
    setIsTogglingStatus(null);
  };

  const handleUpdateOrderStatus = async (
    rentalId: string,
    actionType: "confirm" | "pick-up" | "return"
  ) => {
    setUpdatingOrderId(rentalId);
    const res = await updateRentalStatusAction(rentalId, actionType);

    if (res.success) {
      toast.success(res.message || "Rental order updated successfully.");
      loadOrders(orderMeta.page);
    } else {
      toast.error(res.error || res.message || "Failed to update rental status.");
    }
    setUpdatingOrderId(null);
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Admin Moderation Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage provider listings, stock availability, and process rental
            workflow status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            activeTab === "gears"
              ? loadGears(gearMeta.page)
              : loadOrders(orderMeta.page)
          }
          disabled={gearLoading || orderLoading}
          className="w-fit gap-1.5"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              gearLoading || orderLoading ? "animate-spin" : ""
            }`}
          />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "gears" | "orders")}
        className="w-full space-y-4"
      >
        <TabsList className="grid w-full sm:w-[360px] grid-cols-2">
          <TabsTrigger value="gears" className="gap-2">
            <Package className="h-4 w-4" />
            <span>Gear Listings</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>Rental Orders</span>
          </TabsTrigger>
        </TabsList>

        {/* GEARS TAB */}
        <TabsContent value="gears" className="space-y-4">
          <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gear by name, brand..."
                value={gearSearch}
                onChange={(e) => setGearSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-72">Gear Item</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Stock / Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gearLoading ? (
                  <TableSkeleton rows={5} colSpan={6} />
                ) : gears.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No gear listings found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  gears.map((gear) => (
                    <TableRow key={gear.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {gear.images && gear.images[0] ? (
                            <Image
                              src={gear.images[0]}
                              alt={gear.name}
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded-md object-cover border"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                              <Package className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm line-clamp-1 truncate">
                              {gear.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {gear.brand || "Generic"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium">
                            {gear.provider?.name || "Unknown Provider"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {gear.provider?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {gear.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div>
                          <strong className="text-foreground">
                            ${gear.pricePerDay}
                          </strong>{" "}
                          / day
                        </div>
                        {gear.deposit !== undefined && (
                          <div className="text-muted-foreground">
                            ${gear.deposit} deposit
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            gear.stock > 0
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300"
                          }
                        >
                          {gear.stock > 0
                            ? `In Stock (${gear.stock})`
                            : "Out of Stock"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setInspectedGear(gear)}
                            title="Inspect Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs"
                            disabled={isTogglingStatus === gear.id}
                            onClick={() => handleToggleStock(gear)}
                          >
                            {isTogglingStatus === gear.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : gear.stock > 0 ? (
                              "Disable"
                            ) : (
                              "Enable"
                            )}
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => setSelectedDeleteGear(gear)}
                            title="Delete Listing"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <PaginationFooter
              meta={gearMeta}
              loading={gearLoading}
              onPageChange={(page) => loadGears(page)}
            />
          </div>
        </TabsContent>

        {/* ORDERS TAB */}
        <TabsContent value="orders" className="space-y-4">
          <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by customer, provider, gear..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="pl-9 h-10"
              />
            </div>
          </div>

          <div className="rounded-xl border bg-card overflow-hidden shadow-xs">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items & Provider</TableHead>
                  <TableHead>Rental Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">
                    Admin Workflow Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderLoading ? (
                  <TableSkeleton rows={5} colSpan={7} />
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No rental orders found matching your search.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-mono text-xs font-semibold">
                            #{order.id.slice(-8)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-xs font-medium">
                            {order.customer?.name || "Guest Customer"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customer?.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs space-y-1">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="line-clamp-1">
                              <span className="font-medium">
                                {item.gearItem?.name}
                              </span>{" "}
                              <span className="text-muted-foreground">
                                (x{item.quantity})
                              </span>
                              {item.gearItem?.provider?.name && (
                                <p className="text-[11px] text-muted-foreground italic">
                                  Provider: {item.gearItem.provider.name}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(order.startDate).toLocaleDateString()} -{" "}
                            {new Date(order.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-sm">
                        ${order.totalAmount ?? order.payment?.amount ?? 0}
                      </TableCell>
                      <TableCell>
                        <OrderStatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => setInspectedOrder(order)}
                            title="Inspect Rental Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {order.status === "PAID" && (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              disabled={updatingOrderId === order.id}
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "confirm")
                              }
                            >
                              {updatingOrderId === order.id && (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              )}
                              Confirm
                            </Button>
                          )}
                          {order.status === "CONFIRMED" && (
                            <Button
                              size="sm"
                              className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                              disabled={updatingOrderId === order.id}
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "pick-up")
                              }
                            >
                              {updatingOrderId === order.id && (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              )}
                              Mark Picked Up
                            </Button>
                          )}
                          {order.status === "PICKED_UP" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs border-purple-300 text-purple-700 hover:bg-purple-50"
                              disabled={updatingOrderId === order.id}
                              onClick={() =>
                                handleUpdateOrderStatus(order.id, "return")
                              }
                            >
                              {updatingOrderId === order.id && (
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                              )}
                              Mark Returned
                            </Button>
                          )}
                          {order.status === "RETURNED" && (
                            <span className="text-xs text-muted-foreground italic pr-2">
                              Completed
                            </span>
                          )}
                          {order.status === "CANCELLED" && (
                            <span className="text-xs text-rose-500 italic pr-2">
                              Cancelled
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <PaginationFooter
              meta={orderMeta}
              loading={orderLoading}
              onPageChange={(page) => loadOrders(page)}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* INSPECT GEAR MODAL */}
      <Dialog
        open={Boolean(inspectedGear)}
        onOpenChange={(open) => !open && setInspectedGear(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Inspect Gear Details</DialogTitle>
            <DialogDescription>
              Review details regarding this provider listing.
            </DialogDescription>
          </DialogHeader>
          {inspectedGear && (
            <div className="space-y-4 pt-2">
              {inspectedGear.images?.[0] && (
                <div className="relative h-48 w-full overflow-hidden rounded-lg border">
                  <Image
                    src={inspectedGear.images[0]}
                    alt={inspectedGear.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{inspectedGear.name}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />{" "}
                  {inspectedGear.location || "N/A"}
                </p>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {inspectedGear.description || "No description provided."}
              </p>

              {inspectedGear.features && inspectedGear.features.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-semibold">Features:</p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-0.5">
                    {inspectedGear.features.map((feat, idx) => (
                      <li key={idx}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                <div>
                  <span className="text-muted-foreground">Provider:</span>
                  <p className="font-medium">{inspectedGear.provider?.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {inspectedGear.provider?.email}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Price Rate:</span>
                  <p className="font-medium">${inspectedGear.pricePerDay} / day</p>
                  <p className="text-[11px] text-muted-foreground">
                    Deposit: ${inspectedGear.deposit || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* INSPECT ORDER MODAL */}
      <Dialog
        open={Boolean(inspectedOrder)}
        onOpenChange={(open) => !open && setInspectedOrder(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Rental Order #{inspectedOrder?.id.slice(-8)}</DialogTitle>
            <DialogDescription>
              Complete details for this rental booking.
            </DialogDescription>
          </DialogHeader>
          {inspectedOrder && (
            <div className="space-y-4 pt-2 text-sm">
              <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg border">
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <OrderStatusBadge status={inspectedOrder.status} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-base">
                    ${inspectedOrder.totalAmount}
                  </p>
                </div>
              </div>

              {/* Customer */}
              <div className="border-t pt-3 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Customer Details
                </p>
                <p className="font-medium">{inspectedOrder.customer?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {inspectedOrder.customer?.email}
                </p>
              </div>

              {/* Items List */}
              <div className="border-t pt-3 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Rented Items ({inspectedOrder.items?.length || 0})
                </p>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {inspectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 border rounded-md"
                    >
                      {item.gearItem?.images?.[0] && (
                        <Image
                          src={item.gearItem.images[0]}
                          alt={item.gearItem.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 rounded-md object-cover border"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {item.gearItem?.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          Provider: {item.gearItem?.provider?.name}
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-medium">${item.subtotal}</p>
                        <p className="text-[10px] text-muted-foreground">
                          x{item.quantity} (${item.pricePerDay}/day)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Details */}
              {inspectedOrder.payment && (
                <div className="border-t pt-3 space-y-1 text-xs">
                  <p className="font-semibold text-muted-foreground uppercase tracking-wider">
                    Payment Information
                  </p>
                  <p>
                    <span className="text-muted-foreground">Stripe ID:</span>{" "}
                    <code className="font-mono text-[11px]">
                      {inspectedOrder.payment.stripePaymentIntentId || "N/A"}
                    </code>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <Badge variant="outline" className="text-[10px]">
                      {inspectedOrder.payment.status}
                    </Badge>
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE GEAR CONFIRMATION DIALOG */}
      <AlertDialog
        open={Boolean(selectedDeleteGear)}
        onOpenChange={(open) => !open && setSelectedDeleteGear(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              gear listing <strong>&quot;{selectedDeleteGear?.name}&quot;</strong>{" "}
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-white"
              onClick={handleDeleteGear}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete Listing"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Order Status Badge Subcomponent
function OrderStatusBadge({ status }: { status: RentalOrder["status"] }) {
  switch (status) {
    case "PAID":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" /> Paid
        </Badge>
      );
    case "CONFIRMED":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300"
        >
          <Clock className="mr-1 h-3 w-3" /> Confirmed
        </Badge>
      );
    case "PICKED_UP":
      return (
        <Badge
          variant="outline"
          className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300"
        >
          <Package className="mr-1 h-3 w-3" /> Picked Up
        </Badge>
      );
    case "RETURNED":
      return (
        <Badge
          variant="outline"
          className="bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" /> Returned
        </Badge>
      );
    case "CANCELLED":
      return (
        <Badge
          variant="outline"
          className="bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <XCircle className="mr-1 h-3 w-3" /> Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// Table Skeleton Subcomponent
function TableSkeleton({ rows = 5, colSpan = 6 }: { rows?: number; colSpan?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow key={i}>
          <TableCell colSpan={colSpan}>
            <Skeleton className="h-8 w-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

// Pagination Footer Subcomponent
function PaginationFooter({
  meta,
  loading,
  onPageChange,
}: {
  meta: MetaPagination;
  loading: boolean;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t bg-card text-xs">
      <p className="text-muted-foreground">
        Showing Page <strong className="text-foreground">{meta.page}</strong> of{" "}
        <strong className="text-foreground">{meta.totalPage}</strong> ({meta.total}{" "}
        total items)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={loading || meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={loading || meta.page >= meta.totalPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}