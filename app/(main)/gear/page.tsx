// src/app/gear/page.tsx
import Link from "next/link";
import Image from "next/image";
import { Search, Star, MapPin, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Mock All Gear Data
const ALL_GEAR = [
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
  {
    id: "5",
    title: "Canon RF 24-70mm f/2.8L Lens",
    category: "Photography",
    pricePerDay: 30,
    rating: 4.9,
    reviewsCount: 15,
    location: "Dhaka",
    imageUrl: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Portable Camping Stove & Cookset",
    category: "Camping",
    pricePerDay: 12,
    rating: 4.6,
    reviewsCount: 22,
    location: "Bandarban",
    imageUrl: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=600&auto=format&fit=crop",
  },
];

const CATEGORIES = ["All", "Photography", "Camping", "Trekking", "Electronics"];

export default function GearListingPage() {
  return (
    <main className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Explore Rental Gear</h1>
          <p className="text-muted-foreground text-sm">
            Find and book high-quality equipment shared by verified owners.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search by gear name, brand, or location..." 
              className="pl-9 h-10 w-full"
            />
          </div>
          
          {/* Category Badges */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {CATEGORIES.map((cat, idx) => (
              <Button
                key={cat}
                variant={idx === 0 ? "default" : "outline"}
                size="sm"
                className="rounded-full text-xs h-8 shrink-0"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {ALL_GEAR.map((item) => (
            <div 
              key={item.id}
              className="group rounded-xl border bg-card text-card-foreground overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                />
                <span className={cn(badgeVariants({ variant: "secondary" }), "absolute top-3 left-3 text-[11px] font-medium backdrop-blur-md bg-background/80")}>
                  {item.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
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

      </div>
    </main>
  );
}