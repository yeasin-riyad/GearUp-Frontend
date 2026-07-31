import Image from "next/image";
import { getCategoriesAction } from "@/actions/category.action";
import { getAllGearsAction } from "@/actions/gear.action";
import { GearModal } from "@/components/dashboard/gear-modal";
import { EditGearModal } from "@/components/dashboard/EditGearModal";
import { DeleteGearModal } from "@/components/dashboard/DeleteGearModal";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Package } from "lucide-react";
import { InventoryFilters } from "@/components/dashboard/InventoryFilters";
import { InventoryPagination } from "@/components/dashboard/InventoryPagination";

export interface GearItem {
  id: string;
  name: string;
  description: string;
  location: string;
  brand?: string;
  images: string[];
  features: string[];
  pricePerDay: number;
  deposit: number;
  stock: number;
  availability: "AVAILABLE" | "UNAVAILABLE";
  categoryId: string;
  category?: {
    id: string;
    name: string;
  };
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function ProviderInventoryPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const queryParams: Record<string, string> = {
    ...(params.search && { searchTerm: params.search }),
    ...(params.category && params.category !== "all" && { categoryId: params.category }),
    sortBy: params.sortBy || "createdAt",
    sortOrder: params.sortOrder || "desc",
    page: params.page || "1",
    limit: params.limit || "8",
  };

  const [categoryRes, gearRes] = await Promise.all([
    getCategoriesAction(),
    getAllGearsAction(queryParams),
  ]);

  const categories = categoryRes?.data || [];
  const gearItems: GearItem[] = gearRes?.data || [];
  
  // Extract Express QueryBuilder pagination metadata
  const meta = gearRes?.meta || {
    total: 0,
    page: 1,
    limit: 8,
    totalPage: 1,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Manage your equipment rentals and stock levels.
          </p>
        </div>

        {/* Create Gear Modal */}
        <GearModal categories={categories} />
      </div>

      {/* Dynamic Search, Category, and Sort Bar */}
      <InventoryFilters categories={categories} />

      {/* Gear List / Table */}
      <Card>
        <CardContent className="p-0">
          {gearItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-semibold">No gear items found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                No equipment items matched your current search or filter criteria.
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price / Day</TableHead>
                    <TableHead>Deposit</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gearItems.map((gear) => (
                    <TableRow key={gear.id}>
                      {/* Thumbnail Image */}
                      <TableCell>
                        <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                          {gear.images?.[0] ? (
                            <Image
                              src={gear.images[0]}
                              alt={gear.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Name & Brand */}
                      <TableCell>
                        <div className="font-medium">{gear.name}</div>
                        {gear.brand && (
                          <span className="text-xs text-muted-foreground">
                            {gear.brand}
                          </span>
                        )}
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="outline">
                          {gear.category?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>

                      {/* Location */}
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          {gear.location}
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="font-medium">
                        ${gear.pricePerDay}
                      </TableCell>

                      {/* Security Deposit */}
                      <TableCell className="text-muted-foreground">
                        ${gear.deposit}
                      </TableCell>

                      {/* Stock Count */}
                      <TableCell>{gear.stock}</TableCell>

                      {/* Availability Status */}
                      <TableCell>
                        <Badge
                          variant={
                            gear.availability === "AVAILABLE"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {gear.availability}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <EditGearModal
                            gear={gear}
                            categories={categories}
                          />
                          <DeleteGearModal
                            gearId={gear.id}
                            gearName={gear.name}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Express Server Pagination */}
              <InventoryPagination
                currentPage={meta.page}
                totalPages={meta.totalPage}
                totalItems={meta.total}
                pageSize={meta.limit}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}