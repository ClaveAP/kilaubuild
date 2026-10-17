import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppChrome } from "@/components/layout/AppChrome";
import "react-day-picker/style.css";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KilauBuild — Jasa Kontraktor & Desain Interior | Bangun Dulu Baru Bayar",
  description:
    "KilauBuild melayani pembangunan rumah, renovasi, dan interior di Depok serta Jabodetabek. Survey awal gratis dan termin mengikuti progres fisik di lokasi.",
  icons: {
    icon: "/logo-kilau-build.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable} scroll-smooth`}>
      <body className="bg-[#F4F7F8] font-sans text-[#0A1E2F] antialiased">
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  );
}
