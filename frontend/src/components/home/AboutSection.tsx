"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight, ArrowRight, Play } from "lucide-react";

export const AboutSection: React.FC = () => {
  return (
    <section id="tentang" className="w-full py-16 sm:py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="max-w-xl font-serif text-4xl font-medium leading-[1.08] text-slate-950 sm:text-5xl lg:text-6xl">
              Rumah yang baik dimulai dari <span className="italic text-[#005592]">rasa percaya.</span>
            </h2>

            {/* Video / Project Preview Chip */}
            <div className="pt-2">
              <a
                href="#portofolio"
                className="group inline-flex items-center gap-3.5 bg-white p-2 pr-5 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-900 flex items-center justify-center shrink-0">
                  <Image
                    src="/tk.webp"
                    alt="Video Preview KilauBuild"
                    fill
                    sizes="48px"
                    className="object-cover opacity-80 group-hover:scale-110 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-6 h-6 rounded-full bg-[#005592] flex items-center justify-center shadow">
                      <Play className="w-3 h-3 text-white fill-white translate-x-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#005592] transition-colors">
                    Dokumentasi Proyek Lapangan
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Lihat hasil nyata tukang & arsitek kami
                  </span>
                </div>
              </a>
            </div>
          </div>

          <div className="space-y-8 lg:col-span-6">
            <div className="grid grid-cols-2 border-y border-slate-300/80 sm:grid-cols-4">
              <div className="py-5 pr-4 sm:border-r sm:border-slate-200">
                <p className="font-serif text-2xl font-semibold text-slate-950">5.0</p>
                <p className="mt-1 text-xs text-slate-500">Ulasan Google</p>
              </div>
              <div className="border-l border-slate-200 py-5 pl-4 sm:border-l-0 sm:px-4">
                <p className="font-serif text-lg font-semibold text-slate-950">Standar SNI</p>
                <p className="mt-1 text-xs text-slate-500">Mutu pekerjaan teruji</p>
              </div>
              <div className="border-t border-slate-200 py-5 pr-4 sm:border-l sm:border-t-0 sm:px-4">
                <p className="font-serif text-lg font-semibold text-slate-950">Akta Notariil</p>
                <p className="mt-1 text-xs text-slate-500">Badan usaha sah</p>
              </div>
              <div className="border-l border-t border-slate-200 py-5 pl-4 sm:border-t-0">
                <p className="font-serif text-lg font-semibold text-slate-950">Garansi 3 Bulan</p>
                <p className="mt-1 text-xs text-slate-500">Retensi pasca serah terima</p>
              </div>
            </div>

            <p className="max-w-2xl text-base leading-8 text-slate-600">
              KilauBuild hadir mengeliminasi kecemasan pemilik properti terhadap kontraktor bermasalah atau biaya bengkak tak terduga. Dengan sistem <strong className="text-slate-900">&quot;Bangun Dulu, Baru Bayar&quot;</strong>, Anda hanya membayar termin setelah memeriksa dan memverifikasi bukti progres fisik riil di lokasi.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <a
                href="#layanan"
                className="group inline-flex items-center gap-2.5 bg-slate-900 hover:bg-[#005592] text-white text-xs font-semibold pl-5 pr-2 py-2 rounded-full shadow-sm transition-all"
              >
                <span>Pelajari Sistem Kami</span>
                <div className="w-6 h-6 rounded-full bg-[#005592] group-hover:scale-105 flex items-center justify-center text-white transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
              </a>

              <a
                href="https://wa.me/6287776360795"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#005592] transition-colors"
              >
                <span>Konsultasi WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
