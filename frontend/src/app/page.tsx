import { HeroSection } from "@/components/home/HeroSection";
import { CompanyAboutSection } from "@/components/home/CompanyAboutSection";
import { PortfolioSection } from "@/components/home/PortfolioSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { InteriorSection } from "@/components/home/InteriorSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { BookingSection } from "@/components/home/BookingSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CompanyAboutSection />
      <PortfolioSection />
      <AboutSection />
      <ServicesSection />
      <InteriorSection />
      <TestimonialsSection />
      <FaqSection />
      <BookingSection />
      <ContactSection />
    </>
  );
}
