import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Contact } from "@/components/Contact";
import { Donation } from "@/components/Donation";
import { Footer } from "@/components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Header isLanding={true} />
      <main>
        <Hero />
        <Features />
        <Contact />
        <Donation />
      </main>
      <Footer />
    </div>
  );
}