// src/components/home/HeroSection.tsx
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroImg from "@/public/images/hero-camping.avif"; 

export function HeroSection() {
  return (
    <section className="relative bg-background py-8 md:py-12 overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

      <div className="container mx-auto px-4 md:px-6 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Side: Text Content & Call to Actions */}
        <div className="flex-1 space-y-5 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Rent the Best Gear for Your Next{" "}
            <span className="text-primary">Adventure</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
            Discover a wide range of high-quality equipment shared by a trusted
            community. Save money, reduce waste, and gear up easily for your
            next journey.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Link
              href="/gear"
              className={cn(
                buttonVariants({ size: "default" }),
                "w-full sm:w-auto h-10 px-6 text-sm",
              )}
            >
              <Search className="mr-2 h-4 w-4" />
              Explore Gear
            </Link>

            <Link
              href="/dashboard/provider/gear/new"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "w-full sm:w-auto h-10 px-6 text-sm group",
              )}
            >
              List Your Gear
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Right Side: Natural Hero Image */}
        <div className="flex-1 w-full relative">
          {/* Added max-h-[350px] and adjusted aspect ratios for sleeker height */}
          <div className="relative aspect-video sm:aspect-21/9 lg:aspect-video max-h-80 md:max-h-95 rounded-2xl border bg-muted overflow-hidden shadow-md">
            <Image
              src={heroImg}
              alt="Authentic camping tent and outdoor gear setup in the forest"
              fill
              priority
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
