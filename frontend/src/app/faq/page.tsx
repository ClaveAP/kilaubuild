import type { Metadata } from "next";
import { ContactSection } from "@/components/home/ContactSection";
import { FaqSection } from "@/components/home/FaqSection";

export const metadata: Metadata = {
  title: "FAQ KilauBuild — Survey, RAB, Termin & Garansi",
  description: "Jawaban tentang survey gratis, RAB, area layanan, sistem pembayaran termin, dan garansi proyek KilauBuild.",
};

export default function FaqPage() {
  return (
    <>
      <FaqSection />
      <ContactSection />
    </>
  );
}
