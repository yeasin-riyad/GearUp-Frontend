"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  CalendarCheck,
  ShieldCheck,
  Dumbbell,
  Upload,
  HandCoins,
  CheckCircle2,
  ArrowRight,
  UserPlus,
} from "lucide-react";

export default function HowItWorksPage() {
  const [userRole, setUserRole] = useState<"renter" | "provider">("renter");

  const renterSteps = [
    {
      step: "01",
      title: "Browse & Find Gear",
      description:
        "Search through thousands of verified fitness equipment, camping gear, and sports items near you.",
      icon: Search,
    },
    {
      step: "02",
      title: "Book Your Dates",
      description:
        "Select your preferred rental period, check live availability, and lock in seamless online payment.",
      icon: CalendarCheck,
    },
    {
      step: "03",
      title: "Pick Up & Gear Up",
      description:
        "Coordinate pickup or delivery with the owner, inspect your gear, and enjoy your workout or adventure.",
      icon: Dumbbell,
    },
    {
      step: "04",
      title: "Easy Return & Review",
      description:
        "Return the equipment at the agreed time and leave a review to help strengthen our community trust.",
      icon: ShieldCheck,
    },
  ];

  const providerSteps = [
    {
      step: "01",
      title: "List Your Gear",
      description:
        "Upload photos, set daily/weekly rental prices, and add details about your unused sports equipment.",
      icon: Upload,
    },
    {
      step: "02",
      title: "Accept Requests",
      description:
        "Receive booking requests from verified local fitness enthusiasts and manage your schedule easily.",
      icon: CheckCircle2,
    },
    {
      step: "03",
      title: "Hand Over Equipment",
      description:
        "Meet the renter for quick handoff or coordinate secure local drop-off with verified user verification.",
      icon: Dumbbell,
    },
    {
      step: "04",
      title: "Earn Securely",
      description:
        "Receive direct automatic payouts once the rental period starts, backed by GearUp insurance policies.",
      icon: HandCoins,
    },
  ];

  const currentSteps = userRole === "renter" ? renterSteps : providerSteps;

  return (
    <div className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
          Simple & Transparent
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          How <span className="text-primary">GearUp</span> Works
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Whether you want to rent premium sports equipment or earn extra income from gear sitting in your garage, getting started takes just minutes.
        </p>

        {/* Role Switcher Toggle */}
        <div className="pt-6 flex justify-center">
          <div className="inline-flex p-1.5 rounded-xl bg-muted border border-border/60">
            <button
              onClick={() => setUserRole("renter")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                userRole === "renter"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              I Want to Rent Gear
            </button>
            <button
              onClick={() => setUserRole("provider")}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                userRole === "provider"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              I Want to List My Gear
            </button>
          </div>
        </div>
      </div>

      {/* Step Grid Cards */}
      <div className="max-w-7xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentSteps.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative group bg-card border border-border/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-3xl font-extrabold text-muted-foreground/30 group-hover:text-primary/30 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Section */}
      <div className="max-w-5xl mx-auto mt-20 bg-muted/40 border border-border/60 rounded-2xl p-8 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-1">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm">Gear Coverage</h4>
            <p className="text-xs text-muted-foreground">
              Equipment protection plans safeguard your items against accidental damages.
            </p>
          </div>

          <div className="space-y-2">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-1">
              <UserPlus className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm">Verified Profiles</h4>
            <p className="text-xs text-muted-foreground">
              Identity checks and community ratings ensure a safe, trusted network.
            </p>
          </div>

          <div className="space-y-2">
            <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-1">
              <HandCoins className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-sm">Secure Payments</h4>
            <p className="text-xs text-muted-foreground">
              Escrow-backed transactions ensure fair transfers for both renters and owners.
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="max-w-4xl mx-auto mt-16 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Ready to Get Started?
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/gears"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
          >
            <span>Explore All Gear</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-secondary/80 transition-all border border-border/60 cursor-pointer"
          >
            <span>Become a Provider</span>
          </Link>
        </div>
      </div>
    </div>
  );
}