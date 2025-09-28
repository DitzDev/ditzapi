import { Link } from "wouter";
import { Code, Github, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" data-testid="link-footer-home">
              <div className="flex items-center gap-2 mb-4">
                <Code className="h-6 w-6" />
                <span className="text-lg font-semibold">DitzAPI</span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Fast, reliable API downloader services with regular updates and easy integration.
              Built for developers who need dependable solutions.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/DitzDev">
                <Button variant="ghost" size="icon" data-testid="button-github">
                  <Github className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://www.instagram.com/ditzzydev?igsh=MTJ2bG81cWdhcDIzag==">
                <Button variant="ghost" size="icon" data-testid="button-twitter">
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <Button variant="ghost" size="icon" data-testid="button-email">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Services</h3>
            <div className="space-y-3">
              <Link href="/dashboard/apis" data-testid="link-footer-apis">
                <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground m-2">
                  API List
                </Button>
              </Link>
              <Link href="#" data-testid="link-footer-docs">
                <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
                  Documentation
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
            <div className="space-y-3">
              <Link href="#contact" data-testid="link-footer-contact">
                <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground m-2">
                  Contact Us
                </Button>
              </Link>
              <Link href="#donate" data-testid="link-footer-donate">
                <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground m-2">
                  Donate
                </Button>
              </Link>
              <Link href="#" data-testid="link-footer-status">
                <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
                  Status Page
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 DitzAPI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="#" data-testid="link-privacy">
                <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Button>
              </Link>
              <Link href="#" data-testid="link-terms">
                <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer >
  );
}
