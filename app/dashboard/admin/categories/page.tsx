import Link from "next/link";
import { getCategoriesAction } from "@/actions/category.action";
import { CategoryModal } from "@/components/dashboard/category-modal";
import { DeleteCategoryDialog } from "@/components/dashboard/delete-category-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { CategorySearch } from "@/components/dashboard/category-search";

interface AdminCategoriesPageProps {
  searchParams: Promise<{
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    page?: string;
    limit?: string;
    [key: string]: string | undefined;
  }>;
}

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const resolvedSearchParams = await searchParams;

  // 1. Extract query params from URL
  const query = {
    searchTerm: resolvedSearchParams.searchTerm || "",
    sortBy: resolvedSearchParams.sortBy || "createdAt",
    sortOrder: resolvedSearchParams.sortOrder || "desc",
    page: resolvedSearchParams.page || "1",
    limit: resolvedSearchParams.limit || "10",
  };

  // 2. Fetch categories passing query parameters to QueryBuilder backend
  const res = await getCategoriesAction(query);
  const categories = res.data || [];
  const meta = res.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  const currentPage = Number(meta.page) || 1;
  const totalPages = Number(meta.totalPage) || 1;

  // Helper to build URL query strings for sorting/pagination
  const createQueryString = (
    paramsToUpdate: Record<string, string | number>,
  ) => {
    const currentParams = new URLSearchParams(
      resolvedSearchParams as Record<string, string>,
    );
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value) {
        currentParams.set(key, String(value));
      } else {
        currentParams.delete(key);
      }
    });
    return currentParams.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gear Categories</h2>
          <p className="text-sm text-muted-foreground">
            Manage product categories for gear rentals.
          </p>
        </div>
        <CategoryModal />
      </div>

      {/* Query Controls: Search & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* নতুন Client Search Component */}
        <CategorySearch defaultValue={query.searchTerm} />

        {/* Sort Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-sm text-muted-foreground">Sort:</span>
          <Link
            href={`?${createQueryString({
              sortBy: "name",
              sortOrder: query.sortOrder === "asc" ? "desc" : "asc",
            })}`}
          >
            <Button variant="outline" size="sm">
              Name ({query.sortOrder === "asc" ? "A-Z" : "Z-A"})
            </Button>
          </Link>
          <Link
            href={`?${createQueryString({
              sortBy: "createdAt",
              sortOrder: query.sortOrder === "asc" ? "desc" : "asc",
            })}`}
          >
            <Button variant="outline" size="sm">
              Date ({query.sortOrder === "asc" ? "Oldest" : "Newest"})
            </Button>
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-lg bg-background shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              categories?.map((cat: any) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-semibold">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {cat.slug}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {cat.description || "N/A"}
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Edit Modal Trigger */}
                    <CategoryModal
                      initialData={cat}
                      trigger={
                        <Button type="button" size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />

                    {/* Delete Alert Dialog */}
                    <DeleteCategoryDialog
                      categoryId={cat.id}
                      categoryName={cat.name}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2">
        <div>
          Showing Page{" "}
          <span className="font-medium text-foreground">{currentPage}</span> of{" "}
          <span className="font-medium text-foreground">{totalPages}</span>{" "}
          (Total: {meta.total || 0})
        </div>

        <div className="flex items-center gap-2">
          {/* Previous Page Link */}
          {currentPage > 1 ? (
            <Link href={`?${createQueryString({ page: currentPage - 1 })}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
          )}

          {/* Next Page Link */}
          {currentPage < totalPages ? (
            <Link href={`?${createQueryString({ page: currentPage + 1 })}`}>
              <Button variant="outline" size="sm">
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
