import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Audiences } from "@/components/landing/audiences";
import { Community } from "@/components/landing/community";
import { Features } from "@/components/landing/features";
import { WaitlistSection } from "@/components/landing/waitlist-section";
import { FinalCta } from "@/components/landing/final-cta";
import { SiteFooter } from "@/components/landing/site-footer";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <Audiences />
      <Community />
      <Features />
      <WaitlistSection />
      <FinalCta />
      <SiteFooter />
    </main>
  );
}
