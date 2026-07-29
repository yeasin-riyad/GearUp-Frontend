"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserMenu } from "./UserMenu";
import { User } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { logout } from "@/service/logout";

interface NavbarProps {
  currentUser?: User | null;
}

export function Navbar({ currentUser = null }: NavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const user = currentUser;

  const publicNavLinks = [
    { name: "Home", href: "/" },
    { name: "Browse Gear", href: "/gear" },
    { name: "Categories", href: "/gear?view=categories" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <Dumbbell className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Gear<span className="text-primary">Up</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {publicNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive(link.href)
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Action Section (Auth vs Public) */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "PROVIDER" && (
                <Link href="/dashboard/provider/gear/new">
                  <Button
                    size="sm"
                    variant="outline"
                    className="hidden lg:flex border-primary/30 text-primary hover:bg-primary/5"
                  >
                    + Add Gear
                  </Button>
                </Link>
              )}

              <UserMenu user={user} onLogout={logout} />
            </div>
          ) : (
            /* Public Guest State */
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="shadow-sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Drawer */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              }
            />

            <SheetContent side="right" className="w-75 sm:w-87.5 p-6">
              <SheetHeader className="text-left border-b pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Dumbbell className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-lg">GearUp</span>
                </SheetTitle>
              </SheetHeader>

              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-4 py-6">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1">
                    Navigation
                  </p>
                  {publicNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(link.href)
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>

                {/* Mobile User / Auth State */}
                <div className="border-t pt-4 mt-2">
                  {user ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 px-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {user.name?.[0]?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-semibold">{user.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {user.role?.toLowerCase()}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={
                          user.role === "ADMIN"
                            ? "/dashboard/admin"
                            : user.role === "PROVIDER"
                              ? "/dashboard/provider"
                              : "/dashboard/customer"
                        }
                        onClick={() => setIsOpen(false)}
                        className="block w-full"
                      >
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                        >
                          Go to Dashboard
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Link
                        href="/register"
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        <Button className="w-full">Register</Button>
                      </Link>
                      <Link
                        href="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full"
                      >
                        <Button className="w-full" variant="outline">
                          Log In
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}