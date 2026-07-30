"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

export function CategorySearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set("searchTerm", term);
      params.set("page", "1"); // সার্চ করলে পেজ ১-এ নিয়ে যাবে
    } else {
      params.delete("searchTerm");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full sm:w-72">
      {isPending ? (
        <Loader2 className="absolute left-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        type="search"
        placeholder="Search categories..."
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-8"
      />
    </div>
  );
}