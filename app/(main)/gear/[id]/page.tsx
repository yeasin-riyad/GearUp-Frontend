// app/gear/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  Star, 
  MapPin, 
  ShieldCheck, 
  ChevronLeft, 
  Share2, 
  Heart,
  CheckCircle2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// API Action & Sidebar Import
import { BookingSidebar } from "@/components/gear/BookingSidebar"; // Sidebar Component
import { getSingleGearAction } from "@/actions/gear.action";
import { getCurrentUser } from "@/service/auth.service";

// Backend API response TypeScript Type definition
interface GearDetail {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  deposit?: number;
  location?: string;
  rating?: number;
  reviewsCount?: number;
  images?: string[];
  features?: string[];
  category?: {
    name: string;
  };
  provider?: {
    name?: string;
    avatar?: string;
    createdAt?: string;
    rating?: number;
    isVerified?: boolean;
  };
}

export default async function GearDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const response = await getSingleGearAction(id);
  // Fetch user server-side
  const currentUser = await getCurrentUser();

  if (!response?.success || !response?.data) {
    notFound(); 
  }

  const gear: GearDetail = response.data;

  // ফালব্যাক বা ডিফল্ট ইমেজের ব্যবস্থা
  const mainImage = gear.images?.[0] || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop";
  const galleryImages = gear.images?.slice(1, 3) || [];


  return (
    <main className="min-h-screen py-6 md:py-10 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Navigation Breadcrumb & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/gears"
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
            {gear.category?.name && (
              <span className={cn(badgeVariants({ variant: "secondary" }), "text-xs font-medium")}>
                {gear.category.name}
              </span>
            )}
            <span className="flex items-center text-xs text-muted-foreground">
              <MapPin className="mr-1 h-3.5 w-3.5" />
              {gear.location || "Bangladesh"}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {gear.name}
          </h1>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center font-medium text-foreground">
              <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
              {gear.rating ?? 5.0} ({gear.reviewsCount ?? 0} reviews)
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
              src={mainImage}
              alt={gear.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>
          
          <div className="hidden md:grid grid-rows-2 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="relative aspect-[16/10] rounded-xl overflow-hidden border bg-muted shadow-xs">
                <Image
                  src={img}
                  alt={`${gear.name} detail ${index + 2}`}
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
              <p className="text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {gear.description}
              </p>
            </div>

            {/* What's Included / Features */}
            {gear.features && gear.features.length > 0 && (
              <>
                <hr className="border-border" />
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
              </>
            )}

            {/* Owner Details */}
            {gear.provider && (
              <>
                <hr className="border-border" />
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight">Gear Owner</h2>
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-card">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-muted">
                      <Image
                        src={gear.provider.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"}
                        alt={gear.provider.name || "Owner"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base">{gear.provider.name || "Anonymous Host"}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            Verified
                          </span>
                     
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Member
                      </p>
                      <p className="text-xs font-medium text-amber-500">
                        ★ {gear?.provider?.rating ?? 5.0} Owner Rating
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Right Column: Dynamic Booking Sidebar Component */}
          <div>
            <BookingSidebar gearItem={gear} currentUser={currentUser}
             
            />
          </div>

        </div>

      </div>
    </main>
  );
}