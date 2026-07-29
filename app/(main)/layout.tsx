// app/(main)/layout.tsx
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { getCurrentUser } from "@/service/auth.service";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the actual authenticated user from backend API
  const currentUser = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col justify-between">
      {/* Global Navigation Header */}
      <Navbar currentUser={currentUser} />

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}