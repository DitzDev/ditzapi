import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Code, Menu } from "lucide-react";

interface HeaderProps {
  isLanding?: boolean;
}

export function Header({ isLanding = true }: HeaderProps) {
  const [location] = useLocation();

  if (!isLanding) {
    return (
      <header className="border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              <span className="text-lg font-semibold">DitzAPI</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" data-testid="button-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6" />
              <span className="text-lg font-semibold">DitzAPI</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" data-testid="link-features">
              <Button variant="ghost" className="text-sm">Features</Button>
            </Link>
            <Link href="#contact" data-testid="link-contact">
              <Button variant="ghost" className="text-sm">Contact</Button>
            </Link>
            <Link href="#donate" data-testid="link-donate">
              <Button variant="ghost" className="text-sm">Donate</Button>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/dashboard" data-testid="link-dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}