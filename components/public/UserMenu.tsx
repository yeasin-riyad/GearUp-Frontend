"use client";

import Link from "next/link";
import { 
  User as UserIcon, 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  LogOut, 
  ShieldAlert,
  PlusCircle
} from "lucide-react";

import { User } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface UserMenuProps {
  user: User;
  onLogout?: () => void;
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  // Get Initials for Avatar Fallback
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "GU";

  // Role Base Dashboard Link Routing
  const getDashboardPath = () => {
    switch (user.role) {
      case "ADMIN":
        return "/dashboard/admin";
      case "PROVIDER":
        return "/dashboard/provider";
      case "CUSTOMER":
      default:
        return "/dashboard/customer";
    }
  };

  return (
    <DropdownMenu>
      {/* render প্রপস ব্যবহার করায় অতিরিক্ত <button> ট্যাগ বা Hydration Issue তৈরি হবে না */}
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/50 transition-all focus-visible:outline-none"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />

      <DropdownMenuContent className="w-56" align="end">
        {/* User Info Header */}
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-none text-foreground">{user.name}</p>
              <Badge 
                variant={user.role === "ADMIN" ? "destructive" : user.role === "PROVIDER" ? "default" : "secondary"}
                className="text-[10px] px-1.5 py-0 uppercase tracking-wider"
              >
                {user.role}
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />

        {/* Main Dashboard CTA */}
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="cursor-pointer font-medium"
            render={
              <Link href={getDashboardPath()} className="flex items-center w-full">
                <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                <span>Main Dashboard</span>
              </Link>
            }
          />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Dynamic Menu Options Based on Role */}
        <DropdownMenuGroup>
          {user.role === "CUSTOMER" && (
            <DropdownMenuItem
              className="cursor-pointer"
              render={
                <Link href="/dashboard/customer" className="flex items-center w-full">
                  <ShoppingBag className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>My Rentals</span>
                </Link>
              }
            />
          )}

          {user.role === "PROVIDER" && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                render={
                  <Link href="/dashboard/provider/gear/new" className="flex items-center w-full">
                    <PlusCircle className="mr-2 h-4 w-4 text-emerald-500" />
                    <span>Add New Gear</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                className="cursor-pointer"
                render={
                  <Link href="/dashboard/provider/orders" className="flex items-center w-full">
                    <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Incoming Orders</span>
                  </Link>
                }
              />
            </>
          )}

          {user.role === "ADMIN" && (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                render={
                  <Link href="/dashboard/admin/users" className="flex items-center w-full">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Manage Users</span>
                  </Link>
                }
              />
              <DropdownMenuItem
                className="cursor-pointer"
                render={
                  <Link href="/dashboard/admin" className="flex items-center w-full">
                    <ShieldAlert className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Moderation</span>
                  </Link>
                }
              />
            </>
          )}

          <DropdownMenuItem
            className="cursor-pointer"
            render={
              <Link href="/profile" className="flex items-center w-full">
                <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Profile Settings</span>
              </Link>
            }
          />
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Logout */}
        <DropdownMenuItem 
          onClick={onLogout} 
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}