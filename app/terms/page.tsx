import Link from "next/link";
import { Dumbbell, ShieldCheck, Scale, AlertCircle, RefreshCw, FileText } from "lucide-react";

export default function TermsPage() {
  const sections = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "user-accounts", label: "2. User Accounts & Roles" },
    { id: "rentals", label: "3. Rental & Listing Rules" },
    { id: "payments", label: "4. Payments, Fees & Security Deposit" },
    { id: "cancellations", label: "5. Cancellations & Refunds" },
    { id: "liability", label: "6. Gear Condition & Liability" },
    { id: "conduct", label: "7. Prohibited Conduct" },
    { id: "termination", label: "8. Account Termination" },
    { id: "contact", label: "9. Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
          Legal Agreement
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Terms of Service
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
          Last updated: <span className="font-medium text-foreground">August 3, 2026</span>. Please read these terms carefully before using GearUp.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents - Sticky Sidebar */}
        <aside className="lg:col-span-1 hidden lg:block">
          <div className="sticky top-8 bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              On This Page
            </h3>
            <nav className="flex flex-col space-y-2 text-xs">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {sec.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Body */}
        <main className="lg:col-span-3 space-y-10 text-sm leading-relaxed text-muted-foreground">
          {/* Section 1 */}
          <section id="acceptance" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary shrink-0" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the GearUp platform (&quot;Service&quot;), including our website, mobile application, and related services, you agree to comply with and be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, you may not access or use the Service.
            </p>
            <p>
              GearUp reserves the right to update or modify these Terms at any time. Continued use of the platform after changes take effect constitutes acceptance of the modified Terms.
            </p>
          </section>

          {/* Section 2 */}
          <section id="user-accounts" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              2. User Accounts & Verification
            </h2>
            <p>
              To rent or list equipment on GearUp, you must register for an account. You agree to provide accurate, current, and complete information during registration.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Users must be at least 18 years of age to register or initiate rentals.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>GearUp reserves the right to require government-issued ID verification prior to processing transactions.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="rentals" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary shrink-0" />
              3. Rental & Listing Rules
            </h2>
            <p>
              GearUp operates as a peer-to-peer marketplace connecting equipment owners (&quot;Providers&quot;) with users seeking to rent equipment (&quot;Renters&quot;).
            </p>
            <div className="space-y-2 pt-2">
              <h3 className="font-semibold text-foreground">For Providers:</h3>
              <p>
                You warrant that you own or have full legal authorization to rent out listed equipment. Equipment must be clean, fully functional, safe, and accurately represented in text and photos.
              </p>
              <h3 className="font-semibold text-foreground pt-2">For Renters:</h3>
              <p>
                You agree to treat rented equipment with care and use it strictly for its intended purpose. Equipment must be returned on time and in the condition received.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="payments" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground">4. Payments, Fees & Security Deposit</h2>
            <p>
              All payments are processed securely through GearUp&apos;s authorized payment processor. Renters agree to pay the daily or weekly rental rate, platform service fees, and any applicable taxes.
            </p>
            <p>
              A temporary authorization hold (security deposit) may be placed on the Renter&apos;s payment method for the duration of the rental. This hold will be released upon successful and undamaged return of the gear.
            </p>
          </section>

          {/* Section 5 */}
          <section id="cancellations" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary shrink-0" />
              5. Cancellations & Refunds
            </h2>
            <p>
              Cancellation policies depend on the notice provided before the rental start time:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Free Cancellation:</strong> Up to 24 hours prior to the reservation start time.</li>
              <li><strong>Late Cancellation:</strong> Cancellations made within 24 hours of start time may incur a fee equal to 50% of the first day&apos;s rental rate.</li>
              <li><strong>No-Shows:</strong> If a Renter fails to pick up the gear without prior notice, no refund will be issued.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="liability" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary shrink-0" />
              6. Gear Condition & Liability
            </h2>
            <p>
              Renters assume full responsibility for loss, theft, or damage to equipment during the rental period. In the event of damage beyond normal wear and tear:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Renters may be charged up to the full replacement value of the item.</li>
              <li>GearUp provides optional Protection Plans to mitigate out-of-pocket costs for qualified damages.</li>
              <li>GearUp is not liable for personal injury, property damage, or accidents arising from equipment usage. Renters use equipment at their own risk.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="conduct" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground">7. Prohibited Conduct</h2>
            <p>Users agree not to engage in any of the following activities on GearUp:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Bypassing the platform to make payments off-site.</li>
              <li>Listing hazardous, illegal, or stolen equipment.</li>
              <li>Misrepresenting equipment condition or identity.</li>
              <li>Harassing or discriminating against other community members.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="termination" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground">8. Account Termination</h2>
            <p>
              GearUp reserves the right to suspend or terminate accounts that violate these Terms, participate in fraudulent activities, or pose a safety risk to the community, without prior notice.
            </p>
          </section>

          {/* Section 9 */}
          <section id="contact" className="scroll-mt-8 space-y-3 bg-card border border-border/80 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-foreground">9. Contact Information</h2>
            <p>
              If you have any questions or concerns regarding these Terms of Service, please contact our support team:
            </p>
            <div className="pt-2 text-foreground font-medium">
              <p>Email: <a href="mailto:support@gearup.com" className="text-primary hover:underline">support@gearup.com</a></p>
              <p>Address: GearUp Rental Inc., 100 Fitness Way, Suite 400</p>
            </div>
          </section>

          {/* Footer Back Link */}
          <div className="pt-4 border-t border-border/60 flex items-center justify-between">
            <p className="text-xs">© {new Date().getFullYear()} GearUp Rental Inc.</p>
            <Link href="/" className="text-xs font-semibold text-primary hover:underline">
              Back to Home
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}