// src/components/gear/BookingSidebar.tsx
"use client";

import { Calendar, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BookingSidebarProps {
  pricePerDay: number;
  deposit?: number;
}

export function BookingSidebar({ pricePerDay, deposit = 0 }: BookingSidebarProps) {
  // পরবর্তী সময়ে dynamic calculations ও form action এখানে যুক্ত করা যাবে
  const estimatedDays = 3;
  const subtotal = pricePerDay * estimatedDays;
  const serviceFee = Math.round(subtotal * 0.1); // sample 10% fee
  const grandTotal = subtotal + serviceFee + deposit;

  return (
    <div className="sticky top-6 rounded-2xl border bg-card p-6 shadow-md space-y-6">
      {/* Price Header */}
      <div className="flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-extrabold text-foreground">${pricePerDay}</span>
          <span className="text-muted-foreground text-sm"> / day</span>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
          Security Deposit: ${deposit}
        </span>
      </div>

      <hr className="border-border" />

      {/* Booking Dates Form */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Rental Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="date" className="pl-9 h-10 text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-foreground">Rental End Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="date" className="pl-9 h-10 text-sm" />
          </div>
        </div>
      </div>

      {/* Price Breakdown Calculation */}
      <div className="space-y-2 text-sm pt-2">
        <div className="flex justify-between text-muted-foreground">
          <span>${pricePerDay} × {estimatedDays} days</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Service fee</span>
          <span>${serviceFee}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Refundable deposit</span>
          <span>${deposit}</span>
        </div>
        <hr className="border-border pt-1" />
        <div className="flex justify-between font-bold text-base text-foreground">
          <span>Total Due</span>
          <span>${grandTotal}</span>
        </div>
      </div>

      {/* Action Button */}
      <Button className="w-full h-11 text-base font-semibold shadow-xs">
        Request to Rent
      </Button>

      <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
        <Info className="h-3.5 w-3.5" />
        You won't be charged until the owner accepts.
      </p>
    </div>
  );
}