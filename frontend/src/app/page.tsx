import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { StatsSection } from "@/components/home/StatsSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { PortfolioSection } from "@/components/home/PortfolioSection";
import { InteriorSection } from "@/components/home/InteriorSection";
import { BookingSection } from "@/components/home/BookingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ContactSection } from "@/components/home/ContactSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <StatsSection />
      <ServicesSection />
      <PortfolioSection />
      <InteriorSection />
      <BookingSection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
