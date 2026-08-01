// src/app/provider/rentals/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ProviderRentalsLoading() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Skeleton className="h-10 w-full max-w-2xl" />

      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="rounded-xl border p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex items-center gap-4 py-2">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="pt-4 border-t flex justify-between items-center">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}