// src/components/legal/TermsAndPrivacyContent.tsx
 "use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileText, ArrowRight } from "lucide-react";

export function TermsAndPrivacyContent() {
  const [activeTab, setActiveTab] = useState<"terms" | "privacy">("terms");

  return (
    <div className="space-y-6">
      {/* Tab Controls */}
      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl w-full max-w-md">
          <button
            type="button"
            onClick={() => setActiveTab("terms")}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "terms"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="h-4 w-4 text-primary" />
            Terms of Service
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "privacy"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-primary" />
            Privacy Policy
          </button>
        </div>
      </div>

      {/* Tab Content Box */}
      <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 text-foreground text-sm leading-relaxed">
        {activeTab === "terms" ? (
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to <strong>GearUp</strong>! By accessing or using our platform, mobile application, or services, you agree to comply with and be bound by these Terms of Service. GearUp connects gear owners (&quot;Providers&quot;) with individuals seeking to rent equipment (&quot;Customers&quot;).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">2. Account Registration & Eligibility</h2>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>You must be at least 18 years old to create an account on GearUp.</li>
                <li>You are responsible for maintaining the confidentiality of your account password and login details.</li>
                <li>You agree to provide accurate, up-to-date contact information, including your email and phone number.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">3. Gear Listings & Rental Rules</h2>
              <p className="text-muted-foreground">
                <strong>For Providers:</strong> You warrant that any gear you list is clean, fully functional, safe to use, and accurately represented in photos and descriptions.
              </p>
              <p className="text-muted-foreground">
                <strong>For Customers:</strong> You agree to treat rented equipment with care, inspect items upon receipt, return them on time, and pay for any loss or damage incurred during your rental period.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">4. Payments, Security Deposits & Fees</h2>
              <p className="text-muted-foreground">
                All rental transactions must be processed through GearUp&apos;s integrated payment processing system. GearUp charges a service fee on transactions to support platform security, maintenance, and user support. Late returns may result in additional charges.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">5. Cancellations & Refunds</h2>
              <p className="text-muted-foreground">
                Cancellations made more than 24 hours prior to the start of a rental period are eligible for a full refund minus processing fees. Specific provider policies may apply as specified on the listing page.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                GearUp is a marketplace platform. We do not manufacture or inspect rental gear directly. Outdoor activities carry inherent risks; users assume full risk and responsibility for physical injury or equipment failure during rentals.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
              <p className="text-muted-foreground">
                We collect personal information that you provide when creating an account, including:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Name, email address, and phone number</li>
                <li>Billing and payout information for rental orders</li>
                <li>Profile picture/avatar and location details (city/address)</li>
                <li>Reviews, ratings, and communication messages between users</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">2. How We Use Your Information</h2>
              <p className="text-muted-foreground">
                Your data is used strictly to facilitate the GearUp rental marketplace, including:
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>Creating and managing user accounts</li>
                <li>Processing rental bookings and secure payments</li>
                <li>Verifying user identities and preventing fraudulent activity</li>
                <li>Sending essential transactional updates and rental reminders</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">3. Data Sharing & Security</h2>
              <p className="text-muted-foreground">
                We never sell your personal data to third parties. We share limited information with payment gateways and verified counterparties (e.g., sharing a provider&apos;s pickup address with a customer after a confirmed booking).
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">4. Cookies & Analytics</h2>
              <p className="text-muted-foreground">
                We use secure HTTP-only cookies to maintain your login session and improve user experience across our website.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-foreground">5. Your Data Rights</h2>
              <p className="text-muted-foreground">
                You have the right to request access to your personal data, update incorrect information via your profile settings, or request account deletion by reaching out to our support team.
              </p>
            </section>
          </div>
        )}
      </div>

      {/* Footer Call to Action */}
      <div className="text-center pt-2 text-xs text-muted-foreground flex items-center justify-center gap-2">
        <span>Have questions about our legal policies?</span>
        <Link href="/contact" className="font-semibold text-primary hover:underline flex items-center gap-1">
          Contact Support <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}