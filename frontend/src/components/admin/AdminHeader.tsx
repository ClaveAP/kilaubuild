"use client";

import Link from "next/link";
import {
  Globe,
  KeyRound,
  LogOut,
  Menu,
} from "lucide-react";
import type { AdminNavSection } from "./admin.types";

interface AdminHeaderProps {
  activeSection: AdminNavSection;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  onToggleMobileSidebar: () => void;
}

const sectionTitles: Record<AdminNavSection, { title: string; subtitle: string }> = {
  overview: {
    title: "Ringkasan Operasional",
    subtitle: "Pantau reservasi survey, pesan masuk, dan ringkasan metrik proyek",
  },
  projects: {
    title: "Portofolio & Proyek",
    subtitle: "Kelola dokumentasi proyek selesai dan progres proyek berjalan",
  },
  interior: {
    title: "Katalog Desain Interior",
    subtitle: "Kelola konsep ruangan, custom furniture, dan gaya interior",
  },
  bookings: {
    title: "Reservasi Survey Lokasi",
    subtitle: "Jadwal kunjungan survey lapangan calon klien dan update status",
  },
  contacts: {
    title: "Kotak Masuk Konsultasi",
    subtitle: "Pesan dan formulir pertanyaan yang dikirimkan calon klien",
  },
  content: {
    title: "Manajemen Konten Publik",
    subtitle: "Kelola FAQ, testimoni ulasan klien, angka statistik, dan feed sosial",
  },
};

export const AdminHeader = ({
  activeSection,
  onOpenChangePassword,
  onLogout,
  onToggleMobileSidebar,
}: AdminHeaderProps) => {
  const currentMeta = sectionTitles[activeSection] || sectionTitles.overview;

  return (
    <header className="sticky top-0 z-30 border-b border-[#E1E9ED] bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile hamburger & breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#CBD8DF] text-[#526474] transition-colors hover:bg-[#F4F7F8] lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#71818D]">
              <span className="hidden sm:inline">KilauBuild</span>
              <span className="hidden sm:inline text-[#CBD8DF]">/</span>
              <span className="font-bold text-[#005592]">{currentMeta.title}</span>
            </div>
          </div>
        </div>

        {/* Right: Minimalist Top-Right Utility Actions (Jiron reference style) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick link to public website */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#CBD8DF] bg-white text-[#526474] transition-colors hover:bg-[#F4F7F8] hover:text-[#005592]"
            title="Buka Website Publik"
            aria-label="Buka Website Publik"
          >
            <Globe className="h-4 w-4" />
          </Link>

          {/* KeyRound for change password */}
          <button
            type="button"
            onClick={onOpenChangePassword}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#CBD8DF] bg-white text-[#526474] transition-colors hover:bg-[#F4F7F8] hover:text-[#005592]"
            title="Ganti Kata Sandi"
            aria-label="Ganti Kata Sandi"
          >
            <KeyRound className="h-4 w-4" />
          </button>

          {/* Clean Logout Icon Button */}
          <button
            type="button"
            onClick={onLogout}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#CBD8DF] bg-white text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
            title="Keluar Akun"
            aria-label="Keluar Akun"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
