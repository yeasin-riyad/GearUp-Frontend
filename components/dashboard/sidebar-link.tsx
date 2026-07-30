"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ShieldAlert,
  FolderTree,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

// আইকনের নামের ম্যাপ
const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  rentals: ShoppingBag,
  inventory: Package,
  users: Users,
  moderation: ShieldAlert,
  categories: FolderTree,
};

interface SidebarLinkProps {
  href: string;
  iconName: keyof typeof iconMap; // String ID হিসেবে আইকনের নাম গ্রহণ করবে
  label: string;
}

export function SidebarLink({ href, iconName, label }: SidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const Icon = iconMap[iconName] || LayoutDashboard;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      />
      <span>{label}</span>
    </Link>
  );
}