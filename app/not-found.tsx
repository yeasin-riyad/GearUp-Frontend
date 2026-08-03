"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dumbbell, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full flex flex-col items-center space-y-6 relative z-10">
        
        {/* Animated Dumbbell / Icon Header */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-card border border-border/80 shadow-lg p-6 rounded-2xl animate-bounce duration-1000">
            <Dumbbell className="h-16 w-16 text-primary stroke-[1.5]" />
          </div>
        </div>

        {/* Big 404 & Text Content */}
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
            Error 404
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Page Not Found
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Looks like you&apos;ve ventured off the track. The page or gear request you were looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          {/* Go Back Button */}
          <button
            onClick={() => router.back()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-all border border-border/60 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          {/* Home Link */}
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Footer Brand Identity */}
        <div className="pt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-primary text-primary-foreground">
            <Dumbbell className="h-3 w-3" />
          </div>
          <span className="font-semibold text-foreground">GearUp</span> &bull; Fitness & Rental Platform
        </div>
      </div>
    </div>
  );
}