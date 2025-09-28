import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    // TODO: Handle form submission
    setFormData({ name: "", email: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Get in Touch</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    data-testid="input-name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    data-testid="input-email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us how we can help..."
                    rows={4}
                    data-testid="input-message"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full" data-testid="button-send-message">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Quick Support</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Need immediate help? Check our documentation or reach out directly.
              </p>
              <Button variant="outline" className="w-full" data-testid="button-view-docs">
                View Documentation
              </Button>
            </Card>

            <Card className="p-8">
              <h3 className="text-xl font-semibold mb-4">Response Time</h3>
              <p className="text-muted-foreground">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}