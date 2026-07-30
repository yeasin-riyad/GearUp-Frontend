// src/app/(auth)/layout.tsx
import Link from "next/link";
import { Compass } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/30 p-2 sm:p-6">
      {/* Brand Header */}
      <div className="mb-2 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-foreground font-bold text-xl"
        >
          <Compass className="h-6 w-6 text-primary" />
          <span>GearUp</span>
        </Link>
      </div>

      {/* Auth Card Shell */}
      <div className="w-full max-w-md bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
        {children}
      </div>

      {/* Footer Disclaimer */}
      <p className="mt-6 text-center text-xs text-muted-foreground">
        By continuing, you agree to GearShare&#39;s{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}
