import { Search, CalendarCheck, ShieldCheck, HeartHandshake } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    title: "1. Find Gear",
    description: "Browse verified photography, camping, and outdoor gear near your location.",
  },
  {
    icon: CalendarCheck,
    title: "2. Book & Confirm",
    description: "Select your desired rental dates and send a request directly to the owner.",
  },
  {
    icon: ShieldCheck,
    title: "3. Safe Pickup",
    description: "Meet the owner safely or opt for delivery. Inspect the gear and start your adventure.",
  },
  {
    icon: HeartHandshake,
    title: "4. Return Easily",
    description: "Bring the gear back on time, leave a review, and earn community trust points.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-muted/40 border-y">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How Renting Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Renting gear should be as seamless as buying. Follow these 4 simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-card border shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}