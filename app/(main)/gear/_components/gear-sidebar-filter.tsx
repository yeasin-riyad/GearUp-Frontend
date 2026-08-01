"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface CategoryItem {
  id: string;
  name: string;
}

interface GearSidebarFilterProps {
  categories?: CategoryItem[];
  brands?: string[];
}

export function GearSidebarFilter({
  categories = [],
  brands = [],
}: GearSidebarFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("searchTerm") || "",
  );

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");

  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  useEffect(() => {
    setSearchTerm(searchParams.get("searchTerm") || "");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const updateQueryParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (searchParams.get("searchTerm") || "")) {
        updateQueryParams({
          searchTerm: searchTerm || null,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

 useEffect(() => {
  const timer = setTimeout(() => {
    if (
      minPrice !== (searchParams.get("minPrice") || "") ||
      maxPrice !== (searchParams.get("maxPrice") || "")
    ) {
      updateQueryParams({
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
      });
    }
  }, 500);

  return () => clearTimeout(timer);
}, [minPrice, maxPrice]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setMinPrice("");
    setMaxPrice("");

    startTransition(() => {
      router.push(pathname);
    });
  };

  const selectedCategoryId = searchParams.get("categoryId");
  const selectedBrand = searchParams.get("brand");
  const isAvailable = searchParams.get("isAvailable") === "true";

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 rounded-xl border bg-card p-5">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>

        <Button variant="ghost" size="sm" onClick={handleResetFilters}>
          <RotateCcw className="mr-1 h-3 w-3" />
          Reset
        </Button>
      </div>

      {/* Search */}

      <div className="space-y-2">
        <Label>Search</Label>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />

          <Input
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {searchTerm && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Availability */}

      <div className="space-y-2 border-t pt-4">
        <Label>Availability</Label>

        <div className="flex items-center gap-2">
          <Checkbox
            checked={isAvailable}
            onCheckedChange={(checked) =>
              updateQueryParams({
                isAvailable: checked ? "true" : null,
              })
            }
          />

          <span className="text-sm">Available Only</span>
        </div>
      </div>

      {/* Category */}

      <div className="space-y-2 border-t pt-4">
        <Label>Category</Label>

        {categories.map((cat) => {
          const active = selectedCategoryId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() =>
                updateQueryParams({
                  categoryId: active ? null : cat.id,
                })
              }
              className={`block w-full rounded-md px-3 py-2 text-left text-sm ${
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Price */}

      <div className="space-y-2 border-t pt-4">
        <Label>Price Per Day</Label>

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      {/* Brand */}

      {brands.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <Label>Brand</Label>

          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => {
              const active = selectedBrand === brand;

              return (
                <Button
                  key={brand}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() =>
                    updateQueryParams({
                      brand: active ? null : brand,
                    })
                  }
                >
                  {brand}
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}
