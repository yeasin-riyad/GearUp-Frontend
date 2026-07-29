// src/app/privacy/page.tsx
import { Metadata } from "next";
import { TermsAndPrivacyContent } from "@/components/legal/TermsAndPrivacyContent";

export const metadata: Metadata = {
  title: "Terms of Service & Privacy Policy | GearUp",
  description: "Learn about GearUp's terms of service, user guidelines, and privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2 border-b pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Legal & Privacy Information
          </h1>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about using GearUp, renting gear, listing equipment, and how we handle your data.
          </p>
          <p className="text-xs text-muted-foreground pt-1">
            Last updated: July 2026
          </p>
        </div>

        {/* Tabbed Interactive Content */}
        <TermsAndPrivacyContent />
      </div>
    </div>
  );
}