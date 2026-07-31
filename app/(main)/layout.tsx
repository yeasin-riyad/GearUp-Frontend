import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { getCurrentUser } from "@/service/auth.service";
import { CartProvider } from "@/context/CartContext";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col justify-between">
        <Navbar currentUser={currentUser} />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </div>
    </CartProvider>
  );
}