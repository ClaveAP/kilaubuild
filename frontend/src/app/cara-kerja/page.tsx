import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { BookingSection } from "@/components/home/BookingSection";

export const metadata: Metadata = {
  title: "Cara Kerja KilauBuild — Progres Terlihat, Termin Terkendali",
  description: "Pelajari alur perencanaan, dokumentasi progres, pembayaran termin, dan serah terima proyek KilauBuild.",
};

export default function ProcessPage() {
  return (
    <>
      <AboutSection />
      <BookingSection />
    </>
  );
}
