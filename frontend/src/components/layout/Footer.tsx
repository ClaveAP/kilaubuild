"use client";

import Image from "next/image";
import { ArrowUpRight, EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react";

const currentYear = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-[#071A2B] text-white">
      <div className="site-shell py-16 sm:py-20">
        <div className="grid gap-9 border-b border-white/20 pb-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h2 className="max-w-[13ch] text-4xl font-bold leading-[0.98] tracking-[-0.04em] text-white sm:text-6xl">
              Mulai dari survey, bukan tebakan biaya.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col xl:flex-row">
            <a href="#booking" className="button-light flex items-center justify-center gap-2 w-full">
              Jadwalkan survey
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </a>
            <a href="https://wa.me/6287776360795" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10">
              WhatsApp
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
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

        <div className="flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-[#8198A7] sm:flex-row sm:items-center sm:justify-between">
          <p>© <span className="font-numeric">{currentYear}</span> KilauBuild.</p>
          <p>Depok, Jawa Barat · Melayani Jabodetabek</p>
        </div>
      </div>
    </footer>
  );
};
