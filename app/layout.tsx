import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "GearUp 🏋️ | Rent Sports & Outdoor Gear Instantly",
    template: "%s | GearUp",
  },
  description:
    "Browse, rent, and manage premium sports and outdoor equipment easily. Rent kayaks, bikes, camping tents, and fitness gear near you.",
  keywords: [
    "sports gear rental",
    "outdoor equipment",
    "rent bikes",
    "camping gear",
    "GearUp",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ডেমো ইউজার অবজেক্ট (পরবর্তীতে আসল Auth Provider / Session থেকে আসবে)
  // টেস্ট করার জন্য role চেঞ্জ করতে পারেন: "CUSTOMER" | "PROVIDER" | "ADMIN" | null
  const mockUser = null; 

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        {/* Global Navigation Header */}
        <Navbar currentUser={mockUser} />

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}