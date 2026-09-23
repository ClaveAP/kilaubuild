"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Beranda", href: "#hero", id: "hero" },
  { name: "Tentang", href: "#tentang", id: "tentang" },
  { name: "Layanan", href: "#layanan", id: "layanan" },
  { name: "Portofolio", href: "#portofolio", id: "portofolio" },
  { name: "Interior", href: "#interior", id: "interior" },
  { name: "FAQ", href: "#faq", id: "faq" },
  { name: "Kontak", href: "#kontak", id: "kontak" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.15, 0.35] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_10px_35px_-28px_rgba(15,23,42,0.55)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="#hero"
          onClick={() => setActiveSection("hero")}
          className="group flex min-h-11 items-center gap-2.5 rounded-md focus-visible:outline-none"
          aria-label="KilauBuild, kembali ke beranda"
        >
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Image src="/logo.png" alt="" fill sizes="36px" className="object-contain p-1" priority />
          </span>
          <span className="font-serif text-[1.55rem] font-semibold leading-none text-slate-950 transition-colors group-hover:text-[#005592]">
            KilauBuild
          </span>
        </Link>

        <nav aria-label="Navigasi utama" className="hidden items-center gap-0.5 lg:flex">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setActiveSection(link.id)}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[#EBF4FA] text-[#005592]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#booking"
            className="group hidden min-h-11 items-center gap-2 rounded-full bg-slate-950 py-2 pl-4 pr-2 text-xs font-semibold text-white transition-colors hover:bg-[#005592] sm:inline-flex"
          >
            <span>Jadwal Survey</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#005592] transition-colors group-hover:bg-white group-hover:text-[#005592]">
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </a>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-800 transition-colors hover:bg-slate-200 lg:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi mobile"
          className="border-t border-slate-200 bg-white px-4 py-4 shadow-lg lg:hidden"
        >
          <div className="mx-auto grid max-w-7xl gap-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => {
                  setActiveSection(link.id);
                  setIsOpen(false);
                }}
                className={`flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold ${
                  activeSection === link.id
                    ? "bg-[#EBF4FA] text-[#005592]"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setIsOpen(false)}
              className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#005592] px-4 text-sm font-semibold text-white hover:bg-[#0066AE]"
            >
              Jadwal Survey Gratis
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};
