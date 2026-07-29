// app/(main)/layout.tsx
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Demo user object (will later come from Auth Provider / Session)
  // Options: "CUSTOMER" | "PROVIDER" | "ADMIN" | null
  const mockUser = null;

  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* Global Navigation Header */}
      <Navbar currentUser={mockUser} />

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}