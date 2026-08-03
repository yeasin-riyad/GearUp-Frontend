"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Loader2 } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export function InventoryFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Local state for Search (Debounced)
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search")?.toString() || ""
  );

  const handleParamChange = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      // Reset to page 1 on filter/search change
      params.set("page", "1");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch = searchParams.get("search") ?? "";
      if (searchTerm !== currentSearch) {
        handleParamChange("search", searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, searchParams, handleParamChange]);

  // 2. Frontend driven sortBy and sortOrder handling
  const handleSortChange = (value: string | null) => {
  if (!value) return;

  const params = new URLSearchParams(searchParams.toString());

  switch (value) {
    case "price-asc":
      params.set("sortBy", "pricePerDay");
      params.set("sortOrder", "asc");
      break;

    case "price-desc":
      params.set("sortBy", "pricePerDay");
      params.set("sortOrder", "desc");
      break;

    case "name-asc":
      params.set("sortBy", "name");
      params.set("sortOrder", "asc");
      break;

    case "newest":
    default:
      params.set("sortBy", "createdAt");
      params.set("sortOrder", "desc");
      break;
  }

  params.set("page", "1");

  startTransition(() => {
    router.push(`${pathname}?${params.toString()}`);
  });
};

  // Determine current selected sort option
  const currentSortBy = searchParams.get("sortBy") || "createdAt";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  let selectedSortValue = "newest";
  if (currentSortBy === "pricePerDay" && currentSortOrder === "asc") {
    selectedSortValue = "price-asc";
  } else if (currentSortBy === "pricePerDay" && currentSortOrder === "desc") {
    selectedSortValue = "price-desc";
  } else if (currentSortBy === "name" && currentSortOrder === "asc") {
    selectedSortValue = "name-asc";
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search gear name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <Select
          value={searchParams.get("category") || "all"}
          onValueChange={(val) => handleParamChange("category", val!)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Frontend Driven Sort Dropdown */}
        <Select value={selectedSortValue} onValueChange={handleSortChange}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}