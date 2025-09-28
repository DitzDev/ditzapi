import { Card } from "@/components/ui/card";
import { Clock, Shield, Zap, Puzzle } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Regular Updates",
    description: "Continuously updated APIs with the latest features and bug fixes to ensure optimal performance."
  },
  {
    icon: Zap,
    title: "Free to Use", 
    description: "Access all our API services completely free with no hidden costs or premium restrictions."
  },
  {
    icon: Shield,
    title: "Stable & Reliable",
    description: "Built with reliability in mind, featuring robust error handling and 99.9% uptime guarantee."
  },
  {
    icon: Puzzle,
    title: "Easy Integration",
    description: "Simple, well-documented APIs that integrate seamlessly with your existing applications."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Why Choose Our APIs?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for developers who need reliable, fast, and easy-to-use API services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover-elevate cursor-pointer" data-testid={`card-feature-${index}`}>
              <div className="mb-4">
                <feature.icon className="h-8 w-8 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}