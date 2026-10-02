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
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen overflow-hidden bg-white lg:ml-[244px]">
        <HeroSection />
        <PortfolioSection />
        <AboutSection />
        <StatsSection />
        <ServicesSection />
        <InteriorSection />
        <TestimonialsSection />
        <BookingSection />
        <FaqSection />
        <ContactSection />
      </main>
      <div className="lg:ml-[244px]">
        <Footer />
      </div>
    </>
  );
}
