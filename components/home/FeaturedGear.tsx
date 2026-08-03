// src/components/home/FeaturedGear.tsx
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllGearsAction } from "@/actions/gear.action";

// API response data type definition
interface GearItem {
  id: string;
  name: string;
  pricePerDay: number;
  averageRating: number;
  reviewCount: number;
  images?: string[];
  location?: string;
  rating?: number;
  reviewsCount?: number;
  category?: {
    name: string;
  };
}

export async function FeaturedGear() {
  const res = await getAllGearsAction({
    limit: "4",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const featuredGears: GearItem[] = res?.success ? res.data : [];

  // যদি কোনো ডেটা না থাকে, তবে সেকশন রেন্ডার হবে না
  if (!featuredGears || featuredGears.length === 0) {
    return null;
  }

  return (
    <section className="py-10 md:py-14 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Featured Gear for Rent
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Top-rated equipment available for your next trip.
            </p>
          </div>

          <Link
            href="/gears"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden sm:inline-flex group text-primary",
            )}
          >
            Explore all items
            <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dynamic Gear Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredGears.map((item) => {
            // ইমেজ পার্সিং হ্যান্ডলার (ফোলব্যাকসহ)
            const displayImage =
              item.images && item.images.length > 0
                ? item.images[0]
                : "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop";

            return (
              <div
                key={item.id}
                className="group rounded-xl border bg-card text-card-foreground overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                  <Image
                    src={displayImage}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {item.category?.name && (
                    <span
                      className={cn(
                        badgeVariants({ variant: "secondary" }),
                        "absolute top-3 left-3 text-[11px] font-medium backdrop-blur-md bg-background/80",
                      )}
                    >
                      {item.category.name}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {item.location || "Bangladesh"}
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

                  {/* Footer / Price */}
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
                        buttonVariants({ variant: "outline", size: "sm" }),
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

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/gears"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Explore all items
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
