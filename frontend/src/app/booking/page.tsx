import type { Metadata } from "next";
import { BookingSection } from "@/components/home/BookingSection";
import { ContactSection } from "@/components/home/ContactSection";

export const metadata: Metadata = {
  title: "Booking Survey Gratis — KilauBuild",
  description: "Pilih tanggal dan jam survey lokasi gratis bersama tim KilauBuild.",
};

export default function BookingPage() {
  return (
    <>
      <BookingSection />
      <ContactSection />
    </>
  );
}
