"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, List, MapPin, X } from "@phosphor-icons/react";

const navLinks = [
  { name: "Beranda", href: "#hero", id: "hero" },
  { name: "Tentang kami", href: "#tentang", id: "tentang" },
  { name: "Proyek", href: "#portofolio", id: "portofolio" },
  { name: "Cara kerja", href: "#cara-kerja", id: "cara-kerja" },
  { name: "Layanan", href: "#layanan", id: "layanan" },
  { name: "Interior", href: "#interior", id: "interior" },
  { name: "FAQ", href: "#faq", id: "faq" },
];

export const Navbar = () => {
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isManualScroll = useRef(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Reliable ScrollSpy: tracks viewport focal reading line (35% from top)
  useEffect(() => {
    const calculateActiveSection = () => {
      if (isManualScroll.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // When reaching near the bottom, highlight FAQ
      if (scrollY + windowHeight >= docHeight - 140) {
        setActiveSection("faq");
        return;
      }

      // Reading focal point at 35% viewport height
      const focalPoint = scrollY + windowHeight * 0.35;

      const sections = navLinks
        .map((link) => {
          const el = document.getElementById(link.id);
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const top = rect.top + scrollY;
          const bottom = top + el.offsetHeight;
          return { id: link.id, top, bottom };
        })
        .filter((s): s is { id: string; top: number; bottom: number } => s !== null);

      if (sections.length === 0) return;

      // Reverse traverse to find the current active section
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (focalPoint >= section.top - 80) {
          setActiveSection(section.id);
          return;
        }
      }

      setActiveSection(sections[0].id);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          calculateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    calculateActiveSection();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleScrollTo = (targetId: string) => {
    setIsOpen(false);
    setActiveSection(targetId);
    isManualScroll.current = true;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    const element = document.getElementById(targetId);
    if (element) {
      const navOffset = window.innerWidth >= 1024 ? 24 : 84;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${targetId}`);
      }
    }

    scrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 900);
  };

  const brand = (
    <a
      href="#hero"
      onClick={(e) => {
        e.preventDefault();
        handleScrollTo("hero");
      }}
      className="group flex min-h-12 items-center gap-3"
      aria-label="KilauBuild, kembali ke beranda"
    >
      <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-slate-900/5 transition-transform duration-300 group-hover:scale-105">
        <Image src="/logo.png" alt="" fill sizes="40px" className="object-contain" priority />
      </span>
      <span className="text-lg font-extrabold leading-none tracking-[-0.04em] text-[#0A1E2F] transition-colors duration-300 group-hover:text-[#005592]">
        KilauBuild
      </span>
    </a>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#D7E4EB] bg-[#F7FBFD]/95 px-5 backdrop-blur-md lg:hidden">
        <div className="flex h-[72px] items-center justify-between">
          {brand}
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#C9DCE7] text-[#004475] transition-colors hover:border-[#005592] hover:bg-white active:scale-95"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {isOpen ? <X size={22} weight="bold" aria-hidden="true" /> : <List size={22} weight="bold" aria-hidden="true" />}
          </button>
        </div>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.nav
              id="mobile-navigation"
              aria-label="Navigasi mobile"
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-[#D7E4EB]"
            >
              <div className="grid gap-1 py-4">
                {navLinks.map((link, index) => {
                  const isActive = activeSection === link.id;
                  return (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollTo(link.id);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex min-h-12 items-center gap-3 overflow-hidden rounded-lg px-3 text-sm font-semibold transition-all duration-200 ${
                        isActive ? "bg-[#E3F2FD] text-[#005592]" : "text-[#294153] hover:bg-slate-50"
                      }`}
                    >
                      <span className="font-numeric text-xs font-semibold text-[#4F6A7B]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{link.name}</span>
                    </a>
                  );
                })}
                <a
                  href="#booking"
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo("booking");
                  }}
                  className="group mt-3 flex min-h-11 w-full items-center justify-between rounded-full bg-[#005592] py-1.5 pl-5 pr-2 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] active:scale-[0.98]"
                >
                  <span>Jadwalkan Survey</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                  </span>
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[244px] flex-col overflow-y-auto border-r border-[#D7E4EB] bg-[#F3F9FC] px-6 py-8 lg:flex">
        {brand}

        {/* Location & Coverage (Clean Micro-Info, Non-button) */}
        <div className="mt-3.5 flex items-center gap-1.5 px-0.5 text-[#526474]">
          <MapPin size={13} weight="bold" className="shrink-0 text-[#005592]" />
          <span className="text-[11px] font-medium tracking-wide text-[#526474]">
            Melayani Depok &amp; Sekitarnya
          </span>
        </div>

        <span className="mt-8 h-px w-8 bg-[#66B2E0]" aria-hidden="true" />
        <p className="mt-4 text-[10px] font-bold tracking-[0.18em] text-[#005592]">JELAJAHI</p>

        {/* Interactive Nav Items with Liquid-Smooth Spring */}
        <nav aria-label="Navigasi utama" className="mt-3 grid gap-1.5">
          {navLinks.map((link, index) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo(link.id);
                }}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex min-h-11 items-center gap-3.5 overflow-hidden rounded-xl px-3.5 text-sm transition-all duration-200 ease-out ${
                  isActive
                    ? "font-bold text-[#005592]"
                    : "font-medium text-[#526474] hover:translate-x-1 hover:bg-white/60 hover:text-[#005592]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="desktop-nav-active-pill"
                    className="absolute inset-0 rounded-xl border border-[#005592]/25 bg-white shadow-[0_4px_16px_-4px_rgba(0,85,146,0.14)]"
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                      mass: 0.6,
                    }}
                  />
                )}
                <span
                  className={`font-numeric relative z-10 w-5 text-[10px] font-semibold transition-colors duration-200 ${
                    isActive ? "text-[#005592]" : "text-[#4F6A7B] group-hover:text-[#005592]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="relative z-10 transition-colors duration-200">{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Minimalist Bottom CTA with Smooth Hover */}
        <div className="mt-auto border-t border-[#D7E4EB] pt-6">
          <p className="max-w-[17ch] text-xs leading-5 text-[#526474]">
            Bangun dulu, baru bayar sesuai progres fisik.
          </p>
          <a
            href="#booking"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("booking");
            }}
            className="group mt-4 flex min-h-11 w-full items-center justify-between rounded-full bg-[#005592] py-1.5 pl-5 pr-2 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] hover:shadow-md active:scale-[0.98]"
          >
            <span>Jadwalkan Survey</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={14} weight="bold" className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </a>
        </div>
      </aside>
    </>
  );
};
