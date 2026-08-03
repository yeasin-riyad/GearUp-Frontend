"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, Dumbbell } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service (e.g., Sentry, Datadog)
    console.error("Runtime Exception Captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-destructive/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full flex flex-col items-center space-y-6 relative z-10">
        
        {/* Animated Error Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-destructive/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-card border border-destructive/20 shadow-lg p-6 rounded-2xl">
            <AlertTriangle className="h-16 w-16 text-destructive stroke-[1.5]" />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <span className="text-xs font-semibold tracking-widest text-destructive uppercase bg-destructive/10 px-3 py-1 rounded-full">
            Application Error
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Something Went Wrong
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
            An unexpected error occurred while processing your request. Don&apos;t worry, our team has been notified.
          </p>
        </div>

        {/* Technical Digest / Dev Context (Selective Display) */}
        {error.digest && (
          <div className="w-full bg-muted/50 border border-border/80 rounded-lg p-3 text-left">
            <p className="text-[11px] font-mono text-muted-foreground break-all">
              <span className="font-semibold text-foreground">Error Digest:</span> {error.digest}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-all border border-border/60 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Back Home</span>
          </Link>
        </div>

        {/* Brand Footer */}
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