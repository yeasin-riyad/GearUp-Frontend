// src/app/page.tsx
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedGear } from "@/components/home/FeaturedGear";
import { HowItWorks } from "@/components/home/HowItWorks";

export default async function HomePage() {
  // Fetch required homepage data if needed (e.g., featured rental products)
  // const featuredProducts = await getFeaturedProducts();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero / Banner Section */}
      <HeroSection />

      {/* Featured Items / Products Section */}
      <section className="container py-2">
        <FeaturedGear />
      </section>

      {/* Workflow / Features Section */}
      <section className="bg-muted/50 py-2">
        <HowItWorks />
      </section>
    </main>
  );
}