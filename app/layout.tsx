// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  );
}