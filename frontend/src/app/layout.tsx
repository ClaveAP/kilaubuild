import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display } from "next/font/google";
import "react-day-picker/style.css";
import "./globals.css";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const serifFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KilauBuild — Jasa Kontraktor & Desain Interior | Bangun Dulu Baru Bayar",
  description:
    "KilauBuild adalah mitra konstruksi terpercaya di Jabodetabek. Bangun rumah dari nol, renovasi total, dan desain interior dengan sistem garansi dan bayar termin sesuai progres fisik nyata.",
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
    <html lang="id" className={`${headingFont.variable} ${serifFont.variable} ${sansFont.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-900 bg-[#F8FAFC] selection:bg-[#005592] selection:text-white">
        {children}
      </body>
    </html>
  );
}
