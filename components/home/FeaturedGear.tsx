// src/components/home/FeaturedGear.tsx
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock Data (Replace with API/Database data later)
const FEATURED_GEAR = [
  {
    id: "1",
    title: "Sony A7 IV Camera Body",
    category: "Photography",
    pricePerDay: 45,
    rating: 4.9,
    reviewsCount: 28,
    location: "Dhaka",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "4-Person Waterproof Camping Tent",
    category: "Camping",
    pricePerDay: 20,
    rating: 4.8,
    reviewsCount: 42,
    location: "Sylhet",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "DJI Mini 3 Pro Drone",
    category: "Electronics",
    pricePerDay: 35,
    rating: 5.0,
    reviewsCount: 19,
    location: "Chittagong",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Osprey 65L Hiking Backpack",
    category: "Trekking",
    pricePerDay: 15,
    rating: 4.7,
    reviewsCount: 31,
    location: "Sreemangal",
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
  },
];

export function FeaturedGear() {
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
            href="/gear" 
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex group text-primary")}
          >
            Explore all items
            <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Gear Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_GEAR.map((item) => (
            <div 
              key={item.id}
              className="group rounded-xl border bg-card text-card-foreground overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className={cn(badgeVariants({ variant: "secondary" }), "absolute top-3 left-3 text-[11px] font-medium backdrop-blur-md bg-background/80")}>
                  {item.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {item.rating} ({item.reviewsCount})
                    </span>
                  </div>

                  <h3 className="font-semibold text-base line-clamp-1 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                </div>

                {/* Footer / Price */}
                <div className="flex items-center justify-between pt-2 border-t text-sm">
                  <div>
                    <span className="font-bold text-base text-foreground">${item.pricePerDay}</span>
                    <span className="text-xs text-muted-foreground"> / day</span>
                  </div>

                  <Link 
                    href={`/gear/${item.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-8 text-xs font-medium")}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 text-center sm:hidden">
          <Link 
            href="/gear" 
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