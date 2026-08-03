// src/components/public/Footer.tsx
import Link from "next/link";
import { Dumbbell, Globe, Share2, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="#" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold">
                Gear<span className="text-primary">Up</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Rent top-quality sports and outdoor equipment directly from verified providers in your area.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">All Gear Items</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Camping & Hiking</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Cycling & Biking</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Water Sports</Link></li>
            </ul>
          </div>

          {/* Roles & Portal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Join GearUp
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Rent Equipment</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Become a Provider</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Partner Dashboard</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">
              Connect With Us
            </h4>
            <div className="flex gap-3 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors" title="Website"><Globe className="h-4 w-4" /></a>
              <a href="#" className="hover:text-primary transition-colors" title="Community"><Share2 className="h-4 w-4" /></a>
              <a href="#" className="hover:text-primary transition-colors" title="Contact"><MessageCircle className="h-4 w-4" /></a>
            </div>
          </div>

        </div>

        <div className="mt-8 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} GearUp Rental Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}