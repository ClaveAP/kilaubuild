import type { Metadata } from "next";
import { BookingSection } from "@/components/home/BookingSection";
import { InteriorSection } from "@/components/home/InteriorSection";

export const metadata: Metadata = {
  title: "Interior KilauBuild — Ruang Custom untuk Aktivitas Harian",
  description: "Jelajahi desain interior dan custom furniture KilauBuild untuk living room, kitchen set, bedroom, dan bathroom.",
};

export default function InteriorPage() {
  return (
    <>
      <InteriorSection />
      <BookingSection />
    </>
  );
}
