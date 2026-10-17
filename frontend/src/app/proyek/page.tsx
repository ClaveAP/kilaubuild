import type { Metadata } from "next";
import { PortfolioSection } from "@/components/home/PortfolioSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";

export const metadata: Metadata = {
  title: "Proyek KilauBuild — Portofolio & Progres Lapangan",
  description: "Lihat proyek selesai dan progres pembangunan KilauBuild yang sedang berjalan di Depok dan Jabodetabek.",
};

export default function ProjectsPage() {
  return (
    <>
      <PortfolioSection />
      <TestimonialsSection />
    </>
  );
}
