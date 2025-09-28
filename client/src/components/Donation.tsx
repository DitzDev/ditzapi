import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Coffee, Star } from "lucide-react";

const donationTiers = [
  {
    icon: Coffee,
    title: "Buy us a coffee",
    amount: "$5",
    description: "Help us stay caffeinated while maintaining the APIs"
  },
  {
    icon: Heart,
    title: "Support development",
    amount: "$15", 
    description: "Contribute to server costs and ongoing development"
  },
  {
    icon: Star,
    title: "Premium support",
    amount: "$50",
    description: "Help us expand features and priority bug fixes"
  }
];

export function Donation() {
  const handleDonate = (amount: string) => {
    console.log(`Donate ${amount} clicked`);
    // TODO: Integrate with payment processor
  };

  return (
    <section id="donate" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Support Our Work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us keep the APIs free and continuously improve our services. Every contribution makes a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {donationTiers.map((tier, index) => (
            <Card key={index} className="p-8 text-center hover-elevate" data-testid={`card-donation-${index}`}>
              <div className="mb-6">
                <tier.icon className="h-12 w-12 mx-auto text-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {tier.title}
              </h3>
              <div className="text-3xl font-bold text-foreground mb-4">
                {tier.amount}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {tier.description}
              </p>
              <Button 
                className="w-full"
                onClick={() => handleDonate(tier.amount)}
                data-testid={`button-donate-${tier.amount}`}
              >
                Donate {tier.amount}
              </Button>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Other Ways to Help
            </h3>
            <p className="text-muted-foreground mb-6">
              Not ready to donate? You can still help by sharing our service with others or contributing to our open-source projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" data-testid="button-share">
                Share with Friends
              </Button>
              <Button variant="outline" data-testid="button-contribute">
                Contribute Code
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}