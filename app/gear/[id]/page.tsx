// app/gear/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  User, 
  Calendar, 
  ChevronLeft, 
  Share2, 
  Heart,
  CheckCircle2,
  Info
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Mock Data Function (Replace with DB query or API call)
async function getGearItem(id: string) {
  return {
    id,
    title: "Sony A7 IV Full-Frame Mirrorless Camera Body",
    category: "Photography",
    pricePerDay: 45,
    deposit: 200,
    rating: 4.9,
    reviewsCount: 28,
    location: "Dhanmondi, Dhaka",
    description:
      "The Sony A7 IV is an ideal all-rounder for both still photography and video recording. Features a 33MP Exmor R CMOS sensor, 4K 60p video recording, advanced autofocus with real-time Eye AF, and 5-axis image stabilization. Comes with two 128GB high-speed SD cards and 3 original batteries.",
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?q=80&w=800&auto=format&fit=crop",
    ],
    features: [
      "33MP Full-Frame Exmor R CMOS Sensor",
      "4K 60p Video in 10-Bit 4:2:2",
      "Includes 3x NP-FZ100 Batteries + Dual Charger",
      "Includes 2x 128GB Sandisk Extreme Pro SD Cards",
      "Padded Camera Bag Included",
    ],
    owner: {
      name: "Tanvir Ahmed",
      joinedDate: "Member since Jan 2023",
      rating: 5.0,
      verified: true,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop",
    },
  };
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gear = await getGearItem(id);

  return (
    <main className="min-h-screen py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/gear"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-muted-foreground hover:text-foreground pl-0"
            )}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Gear
          </Link>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Save to Wishlist</span>
            </Button>
          </div>
        </div>

        {/* Top Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <span className={cn(badgeVariants({ variant: "secondary" }), "text-xs font-medium")}>
              {gear.category}
            </span>
            <span className="flex items-center text-xs text-muted-foreground">
              <MapPin className="mr-1 h-3.5 w-3.5" />
              {gear.location}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {gear.title}
          </h1>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center font-medium text-foreground">
              <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
              {gear.rating} ({gear.reviewsCount} reviews)
            </span>
            <span>•</span>
            <span className="flex items-center text-emerald-600 dark:text-emerald-500 font-medium">
              <ShieldCheck className="mr-1 h-4 w-4" />
              Verified Insurance Covered
            </span>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="md:col-span-2 relative aspect-[16/10] rounded-xl overflow-hidden border bg-muted shadow-xs">
            <Image
              src={gear.images[0]}
              alt={gear.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-4">
            {gear.images.slice(1, 3).map((img, index) => (
              <div key={index} className="relative aspect-[16/10] rounded-xl overflow-hidden border bg-muted shadow-xs">
                <Image
                  src={img}
                  alt={`${gear.title} detail ${index + 2}`}
                  fill
                  className="object-cover"
                  sizes="33vw"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Details & Specs */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight">About this item</h2>
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                {gear.description}
              </p>
            </div>

            <hr className="border-border" />

            {/* What's Included */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Included in Rental</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gear.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-foreground">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <hr className="border-border" />

            {/* Owner Details */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Gear Owner</h2>
              <div className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={gear.owner.avatar}
                    alt={gear.owner.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">{gear.owner.name}</h3>
                    {gear.owner.verified && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{gear.owner.joinedDate}</p>
                  <p className="text-xs font-medium text-amber-500">
                    ★ {gear.owner.rating} Owner Rating
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Booking Sidebar */}
          <div>
            <div className="sticky top-6 rounded-2xl border bg-card p-6 shadow-md space-y-6">
              
              {/* Price Header */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-foreground">${gear.pricePerDay}</span>
                  <span className="text-muted-foreground text-sm"> / day</span>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                  Security Deposit: ${gear.deposit}
                </span>
              </div>

              <hr className="border-border" />

              {/* Booking Dates Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Rental Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9 h-10 text-sm" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Rental End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="date" className="pl-9 h-10 text-sm" />
                  </div>
                </div>
              </div>

              {/* Price Breakdown Calculation */}
              <div className="space-y-2 text-sm pt-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>$45 × 3 days</span>
                  <span>$135</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Service fee</span>
                  <span>$12</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Refundable deposit</span>
                  <span>${gear.deposit}</span>
                </div>
                <hr className="border-border pt-1" />
                <div className="flex justify-between font-bold text-base text-foreground">
                  <span>Total Due</span>
                  <span>$347</span>
                </div>
              </div>

              {/* Action Button */}
              <Button className="w-full h-11 text-base font-semibold shadow-xs">
                Request to Rent
              </Button>

              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <Info className="h-3.5 w-3.5" />
                You won't be charged until the owner accepts.
              </p>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
}