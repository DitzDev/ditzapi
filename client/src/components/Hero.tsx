import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    
        <h1 className="text-4xl md:text-6xl font-semibold text-foreground mb-6 leading-tight">
          Fast, Reliable
          <br />
          <span className="text-muted-foreground">API Downloader</span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Access powerful API downloader services with regular updates, stable performance, and easy integration. Free to use with comprehensive documentation.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" data-testid="link-get-started">
            <Button size="lg" className="text-base px-8">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Button variant="text" size="lg" className="text-base px-8" data-testid="button-learn-more">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}