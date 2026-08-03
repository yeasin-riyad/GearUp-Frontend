"use client";

import { useState } from "react";
import Link from "next/link";
import { Dumbbell, LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { SidebarLink } from "@/components/dashboard/sidebar-link";

interface User {
  name: string;
  role: string;
}

interface DashboardSidebarProps {
  user: User;
  handleLogout: () => Promise<void>;
}

export function DashboardSidebar({ user, handleLogout }: DashboardSidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`sticky top-0 h-screen border-r border-border/60 bg-background flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64 p-4" : "w-16 p-3"
      }`}
    >
      {/* Top Header Section */}
      <div className="space-y-6 shrink-0 pb-4">
        {/* Header with Logo and Collapse Toggle */}
        <div className={`flex items-center ${isOpen ? "justify-between" : "flex-col gap-3 justify-center"}`}>
          <Link href="/" className="flex items-center gap-2 overflow-hidden shrink-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="h-4 w-4" />
            </div>
            {isOpen && <span className="font-bold text-lg truncate">GearUp</span>}
          </Link>

          {/* Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
          </button>
        </div>

        {/* User Badge */}
        {isOpen ? (
          <div className="rounded-lg bg-muted p-3 text-xs">
            <p className="font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-muted-foreground capitalize">
              {user.role?.toLowerCase()} Account
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div
              className="h-8 w-8 rounded-full bg-muted flex items-center justify-center font-bold text-xs shrink-0"
              title={`${user.name} (${user.role})`}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </div>

      {/* Scrollable Navigation Area */}
      <div className="flex-1 overflow-y-auto space-y-1">
        <nav className="space-y-1">
          {user.role === "CUSTOMER" && (
            <>
              <SidebarLink
                href="/dashboard/customer"
                iconName="dashboard"
                label={isOpen ? "Overview" : ""}
              />
              <SidebarLink
                href="/dashboard/customer/rentals"
                iconName="rentals"
                label={isOpen ? "My Rentals" : ""}
              />
              <SidebarLink
                href="/dashboard/customer/reviews"
                iconName="rentals"
                label={isOpen ? "My Reviews" : ""}
              />
            </>
          )}

          {user.role === "PROVIDER" && (
            <>
              <SidebarLink
                href="/dashboard/provider"
                iconName="dashboard"
                label={isOpen ? "Overview" : ""}
              />
              <SidebarLink
                href="/dashboard/provider/gear/new"
                iconName="inventory"
                label={isOpen ? "My Inventory" : ""}
              />
              <SidebarLink
                href="/dashboard/provider/orders"
                iconName="rentals"
                label={isOpen ? "Rental Requests" : ""}
              />
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <SidebarLink
                href="/dashboard/admin"
                iconName="dashboard"
                label={isOpen ? "Analytics" : ""}
              />
              <SidebarLink
                href="/dashboard/admin/categories"
                iconName="categories"
                label={isOpen ? "Categories" : ""}
              />
              <SidebarLink
                href="/dashboard/admin/users"
                iconName="users"
                label={isOpen ? "User Management" : ""}
              />
              <SidebarLink
                href="/dashboard/admin/moderation"
                iconName="moderation"
                label={isOpen ? "Gear Moderation" : ""}
              />
            </>
          )}
        </nav>
      </div>

      {/* Footer Logout Action */}
      <div className="shrink-0 pt-4 border-t border-border/40 flex justify-center">
        <form action={handleLogout} className="w-full flex justify-center">
          <button
            type="submit"
            className={`flex items-center text-sm font-medium text-destructive transition-all rounded-md bg-destructive/10 hover:bg-destructive hover:text-white cursor-pointer group ${
              isOpen ? "w-full gap-2 px-3 py-2" : "h-9 w-9 justify-center p-0"
            }`}
            title="Logout"
          >
            <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />
            {isOpen && <span>Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}