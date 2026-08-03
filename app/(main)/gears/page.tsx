// src/app/gear/page.tsx

import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  PackageSearch,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAllGearsAction } from "@/actions/gear.action";
import { getCategoriesAction } from "@/actions/category.action"; // নিশ্চিত করুন আপনার Category Action এর সঠিক পাথটি এখানে আছে
import { GearSidebarFilter } from "../gear/_components/gear-sidebar-filter";

interface Category {
  id: string;
  name: string;
}

interface GearItem {
  id: string;
  name: string;
  brand?: string;
  category?: Category;
  pricePerDay: number;

  averageRating: number;
  reviewCount: number;

  location?: string;
  images?: string[];
  availability: "AVAILABLE" | "UNAVAILABLE";
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function GearListingPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  // ব্যাকএন্ডে URLSearchParams এবং ক্যাটাগরি প্যারালালে ফেচ করা হচ্ছে
  const [gearsResponse, categoriesResponse] = await Promise.all([
    getAllGearsAction(resolvedSearchParams),
    getCategoriesAction().catch(() => ({ data: [] })),
  ]);

  const gears: GearItem[] = gearsResponse?.data || [];
  const meta = gearsResponse?.meta;
  const categories: Category[] = categoriesResponse?.data || [];
  console.log(gears, "Gears..");

  // ফেচ করা গিয়ার্স ডাটা থেকে ইউনিক ব্র্যান্ড লিস্ট তৈরি করা
  const availableBrands = Array.from(
    new Set(
      gears
        .map((item) => item.brand)
        .filter((brand): brand is string => Boolean(brand)),
    ),
  );

  return (
    <main className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Explore Rental Gear
          </h1>
          <p className="text-muted-foreground text-sm">
            Find and book high-quality equipment shared by verified owners.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Dynamic Sidebar Filter Component */}
          <GearSidebarFilter categories={categories} brands={availableBrands} />

          {/* Dynamic Gear Grid */}
          <div className="flex-1 space-y-4">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {gears.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {meta?.total ?? gears.length}
              </span>{" "}
              items
            </div>

            {gears.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-card space-y-3">
                <PackageSearch className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">No equipment found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search query, price ranges, or categories.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gears.map((item) => {
                  // Category String বা Object দুটোই নিরাপদে এক্সট্র্যাক্ট করা
                  const categoryName =
                    typeof item.category === "object"
                      ? item.category?.name
                      : item.category;

                  // imgUrl array থেকে প্রথম ইমেজ বেছে নেয়া
                  const primaryImage =
                    Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : null;

                  return (
                    <div
                      key={item.id}
                      className="group rounded-xl border bg-card text-card-foreground overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
                    >
                      {/* Image Preview Container */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        {primaryImage ? (
                          <Image
                            alt={item.name || "Gear Image"}
                            src={primaryImage}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No image available
                          </div>
                        )}

                        {/* Category Badge */}
                        {categoryName && (
                          <span
                            className={cn(
                              badgeVariants({ variant: "secondary" }),
                              "absolute top-3 left-3 text-[11px] font-medium backdrop-blur-md bg-background/80",
                            )}
                          >
                            {categoryName}
                          </span>
                        )}

                        {/* Availability Status */}
                        <span
                          className={cn(
                            "absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-md",
                            item.isAvailable !== false
                              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                              : "bg-destructive/10 text-destructive border border-destructive/20",
                          )}
                        >
                          {item.isAvailable !== false ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Available
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" /> Booked
                            </>
                          )}
                        </span>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {item.location || "N/A"}
                            </span>
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />

                              {Number(item.averageRating).toFixed(1)}

                              <span className="text-muted-foreground">
                                ({item.reviewCount})
                              </span>
                            </span>
                          </div>

                          <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {item.name}
                          </h3>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t text-sm">
                          <div>
                            <span className="font-bold text-base text-foreground">
                              ${item.pricePerDay}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {" "}
                              / day
                            </span>
                          </div>

                          <Link
                            href={`/gear/${item.id}`}
                            className={cn(
                              buttonVariants({
                                variant: "outline",
                                size: "sm",
                              }),
                              "h-8 text-xs font-medium",
                            )}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
