"use client";

import Image from "next/image";
import { ArrowUpRight, EnvelopeSimple, MapPin, Phone, WhatsappLogo } from "@phosphor-icons/react";

const currentYear = new Date().getFullYear();

export const Footer = () => {
  return (
    <>
      {/* Pre-Footer Floating CTA Island */}
      <section className="border-b border-[#CBD8DF] bg-[#F4F7F8] py-14 sm:py-20">
        <div className="site-shell">
          <div className="relative overflow-hidden rounded-[2.25rem] border border-[#66B2E0]/30 bg-gradient-to-br from-[#005592] via-[#00487B] to-[#003860] p-8 shadow-[0_24px_64px_-20px_rgba(0,85,146,0.38)] sm:p-12 lg:p-16">
            {/* Subtle Architectural Blueprint Lines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
                backgroundSize: "2.5rem 2.5rem",
              }}
              aria-hidden="true"
            />
            {/* Ambient Radial Highlight */}
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#66B2E0]/20 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7 xl:col-span-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/95 backdrop-blur-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#66B2E0] animate-pulse" />
                  <span>Konsultasi Bebas Biaya · Depok &amp; Jabodetabek</span>
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.25rem]">
                  Mulai dari survey, bukan <em className="font-serif italic font-normal text-[#8EC7E9]">tebakan biaya.</em>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#D1E4EF]/90 sm:text-base">
                  Dapatkan estimasi biaya transparan, cek kesiapan fisik lokasi, dan jadwalkan survey lapangan langsung bersama penanggung jawab proyek KilauBuild.
                </p>
              </div>

              <div className="flex flex-col gap-3.5 sm:flex-row lg:col-span-5 lg:flex-col xl:col-span-4 xl:flex-row xl:justify-end">
                <a
                  href="#booking"
                  className="group flex min-h-13 items-center justify-between gap-3 rounded-full bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-[#005592] shadow-md transition-all duration-300 hover:bg-[#EAF3F8] hover:shadow-lg active:scale-[0.98]"
                >
                  <span>Jadwalkan Survey</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#005592]/10 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                  </span>
                </a>

                <a
                  href="https://wa.me/6287776360795"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-13 items-center justify-between gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-xs sm:text-sm font-bold text-white backdrop-blur-xs transition-all duration-300 hover:border-white hover:bg-white/20 active:scale-[0.98]"
                >
                  <span className="flex items-center gap-2">
                    <WhatsappLogo size={18} weight="fill" className="text-white" />
                    <span>WhatsApp</span>
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5">
                    <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Directory */}
      <footer className="bg-[#071A2B] text-white">
        <div className="site-shell py-14 sm:py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3">
                <span className="relative h-12 w-12 overflow-hidden rounded-xl bg-white">
                  <Image src="/logo.png" alt="" fill sizes="48px" className="object-contain" />
                </span>
                <div>
                  <p className="text-xl font-extrabold tracking-[-0.03em]">KilauBuild</p>
                  <p className="mt-1 text-xs font-semibold text-[#8CC9EC]">Bangun dulu, baru bayar</p>
                </div>
              </div>
              <p className="mt-6 max-w-sm text-sm leading-7 text-[#B9CAD5]">
                Jasa pembangunan rumah, renovasi, desain arsitektur, dan interior untuk wilayah Depok serta Jabodetabek.
              </p>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-white">Layanan</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#B9CAD5]">
                <li><a href="#layanan" className="transition-colors hover:text-white">Bangun rumah</a></li>
                <li><a href="#layanan" className="transition-colors hover:text-white">Renovasi</a></li>
                <li><a href="#layanan" className="transition-colors hover:text-white">Desain &amp; RAB</a></li>
                <li><a href="#interior" className="transition-colors hover:text-white">Interior custom</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-white">Jelajahi</h3>
              <ul className="mt-4 space-y-3 text-sm text-[#B9CAD5]">
                <li><a href="#tentang" className="transition-colors hover:text-white">Tentang kami</a></li>
                <li><a href="#cara-kerja" className="transition-colors hover:text-white">Sistem termin</a></li>
                <li><a href="#portofolio" className="transition-colors hover:text-white">Portofolio</a></li>
                <li><a href="#testimoni" className="transition-colors hover:text-white">Testimoni</a></li>
                <li><a href="#faq" className="transition-colors hover:text-white">FAQ</a></li>
              </ul>
            </div>

            <address className="space-y-4 not-italic sm:col-span-2 lg:col-span-4">
              <h3 className="text-sm font-bold text-white">Workshop &amp; kontak</h3>
              <p className="grid grid-cols-[1.5rem_1fr] gap-3 text-sm leading-6 text-[#B9CAD5]">
                <MapPin size={18} weight="bold" className="mt-0.5 text-[#8CC9EC]" aria-hidden="true" />
                Jl. Raya Citayam No.34, Pd. Jaya, Cipayung, Kota Depok 16444
              </p>
              <a href="https://wa.me/6287776360795" target="_blank" rel="noopener noreferrer" className="grid grid-cols-[1.5rem_1fr] gap-3 text-sm text-[#B9CAD5] transition-colors hover:text-white">
                <Phone size={18} weight="bold" className="text-[#8CC9EC]" aria-hidden="true" />
                <span className="font-numeric">+62 877-7636-0795</span>
              </a>
              <a href="mailto:kilaubuild@gmail.com" className="grid grid-cols-[1.5rem_1fr] gap-3 text-sm text-[#B9CAD5] transition-colors hover:text-white">
                <EnvelopeSimple size={18} weight="bold" className="text-[#8CC9EC]" aria-hidden="true" />
                kilaubuild@gmail.com
              </a>
            </address>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-[#8198A7] sm:flex-row sm:items-center sm:justify-between">
            <p>© <span className="font-numeric">{currentYear}</span> KilauBuild.</p>
            <p>Depok, Jawa Barat · Melayani Jabodetabek</p>
          </div>
        </div>
      </footer>
    </>
  );
};
