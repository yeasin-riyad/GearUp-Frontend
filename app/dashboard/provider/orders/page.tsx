// src/app/provider/rentals/page.tsx
import { getIncomingRentalsAction } from "@/actions/provider-rental";
import { ProviderRentalsClient } from "./_components/provider-rentals-client";
import { AlertCircle } from "lucide-react";

export default async function ProviderRentalsPage() {
  // While this server action / DB call is fetching, 
  // Next.js automatically renders loading.tsx instantly
  const res = await getIncomingRentalsAction();

  if (!res.success) {
    return (
      <div className="container mx-auto max-w-4xl py-16 px-4 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-xl font-bold">Failed to load incoming rentals</h1>
        <p className="text-muted-foreground text-sm">
          {res.error || "Failed to load incoming rentals."}
        </p>
      </div>
    );
  }

  return <ProviderRentalsClient initialRentals={res.rentals} />;
}