import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesHighlights } from "@/components/home/ServicesHighlights";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTABanner } from "@/components/home/CTABanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <ServicesHighlights />
      <WhyChooseUs />
      <TestimonialsSection />
      <CTABanner />
    </>
  );
}
