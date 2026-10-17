import type { Metadata } from "next";
import { BookingSection } from "@/components/home/BookingSection";
import { ServicesSection } from "@/components/home/ServicesSection";

export const metadata: Metadata = {
  title: "Layanan KilauBuild — Bangun, Renovasi, Arsitektur & Interior",
  description: "Layanan konstruksi rumah, renovasi, desain arsitektur, RAB, dan interior custom KilauBuild.",
};

export default function ServicesPage() {
  return (
    <>
      <ServicesSection />
      <BookingSection />
    </>
  );
}
