"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Beranda", href: "#hero", id: "hero" },
  { name: "Proyek", href: "#portofolio", id: "portofolio" },
  { name: "Cara kerja", href: "#tentang", id: "tentang" },
  { name: "Layanan", href: "#layanan", id: "layanan" },
  { name: "Interior", href: "#interior", id: "interior" },
  { name: "FAQ", href: "#faq", id: "faq" },
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
          .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
        if (visibleSection) setActiveSection(visibleSection.target.id);
      },
      { rootMargin: "-15% 0px -60% 0px", threshold: [0, 0.2, 0.45] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const brand = (
    <Link
      href="#hero"
      onClick={() => {
        setActiveSection("hero");
        setIsOpen(false);
      }}
      className="group flex min-h-12 items-center gap-3"
      aria-label="KilauBuild, kembali ke beranda"
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white">
        <Image src="/logo.png" alt="" fill sizes="40px" className="object-contain" />
      </span>
      <span className="text-lg font-extrabold leading-none tracking-[-0.04em] text-[#0A1E2F] transition-colors group-hover:text-[#005592]">
        KilauBuild
      </span>
    </Link>
  );

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#D7E4EB] bg-[#F7FBFD]/96 px-5 backdrop-blur-md lg:hidden">
        <div className="flex h-[72px] items-center justify-between">
          {brand}
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C9DCE7] text-[#004475]"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {isOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
        {isOpen && (
          <nav id="mobile-navigation" aria-label="Navigasi mobile" className="border-t border-[#D7E4EB] py-4">
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.id);
                    setIsOpen(false);
                  }}
                  className={`flex min-h-12 items-center rounded-lg px-3 text-sm font-semibold ${activeSection === link.id ? "bg-[#E3F2FD] text-[#005592]" : "text-[#294153]"}`}
                >
                  {link.name}
                </a>
              ))}
              <a href="#booking" onClick={() => setIsOpen(false)} className="button-primary mt-3 w-full">
                Jadwalkan survey <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </nav>
        )}
      </header>

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[244px] flex-col overflow-y-auto border-r border-[#D7E4EB] bg-[#F3F9FC] px-7 py-8 lg:flex">
        {brand}
        <p className="mt-2 pl-[52px] text-[10px] font-semibold tracking-[0.12em] text-[#5D7889]">
          DEPOK · JABODETABEK
        </p>
        <span className="mt-20 h-px w-8 bg-[#66B2E0]" aria-hidden="true" />
        <p className="mt-5 text-[10px] font-bold tracking-[0.18em] text-[#005592]">JELAJAHI</p>
        <nav aria-label="Navigasi utama" className="mt-4 grid gap-1">
          {navLinks.map((link, index) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={isActive ? "location" : undefined}
                onClick={() => setActiveSection(link.id)}
                className={`group flex min-h-12 items-center gap-4 border-l-2 pl-3 text-sm transition-colors ${isActive ? "border-[#005592] font-bold text-[#005592]" : "border-transparent font-medium text-[#526474] hover:border-[#66B2E0] hover:text-[#004475]"}`}
              >
                <span className="font-numeric w-5 text-[10px] font-semibold text-[#86A1B1]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {link.name}
              </a>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-[#D7E4EB] pt-6">
          <p className="max-w-[17ch] text-sm leading-6 text-[#526474]">
            Rumah dibangun dengan proses yang jelas.
          </p>
          <a href="#booking" className="button-primary mt-6 w-full">
            Mulai konsultasi <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </>
  );
};
