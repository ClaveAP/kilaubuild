"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react";

const process = [
  { number: "01", title: "Rencana", detail: "Kebutuhan dan biaya disusun." },
  { number: "02", title: "Bangun", detail: "Pekerjaan berjalan bertahap." },
  { number: "03", title: "Periksa", detail: "Progres fisik Anda lihat." },
  { number: "04", title: "Bayar", detail: "Termin mengikuti progres." },
];

export const HeroSection = () => {
  return (
    <section id="hero" className="relative flex min-h-[calc(100svh-72px)] flex-col justify-between bg-white lg:min-h-screen">
      <div className="grid flex-1 items-stretch lg:grid-cols-[1.08fr_0.92fr]">
        {/* Left Column: Editorial Copy & CTAs */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:py-12 lg:pl-12 lg:pr-8 xl:pl-16 xl:pr-12">
          <div className="mb-4 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#005592] sm:mb-6">
            <span className="h-px w-8 bg-[#005592]" aria-hidden="true" />
            <span>Bangun rumah, lebih tenang</span>
          </div>

          <h1 className="hero-editorial-title text-[clamp(2.75rem,4.4vw,4.85rem)] leading-[1.08] tracking-[-0.035em] text-[#092436]">
            <span className="block">Rumah bagus.</span>
            <span className="block">
              Proses <em className="font-serif italic font-normal text-[#005592]">jelas.</em>
            </span>
          </h1>

          <p className="mt-5 max-w-[30rem] text-base leading-relaxed text-[#526474] sm:mt-6 sm:text-lg sm:leading-8">
            Bangun, renovasi, dan interior dengan progres yang bisa Anda cek sebelum membayar termin berikutnya.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
            <a
              href="#booking"
              className="group flex min-h-12 items-center justify-between gap-3.5 rounded-full bg-[#005592] py-2 pl-6 pr-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300 hover:bg-[#0066AE] hover:shadow-lg active:scale-[0.98]"
            >
              <span>Diskusikan Proyek Anda</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </span>
            </a>
            <a
              href="#portofolio"
              className="group flex min-h-12 items-center justify-between gap-3.5 rounded-full border border-[#CBD8DF] bg-white py-2 pl-6 pr-2.5 text-xs sm:text-sm font-bold text-[#0A1E2F] shadow-xs transition-all duration-300 hover:border-[#005592]/30 hover:bg-[#F4F7F8] active:scale-[0.98]"
            >
              <span>Lihat Hasil Kerja</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3F8] text-[#005592] transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </span>
            </a>
          </div>

          <p className="mt-5 text-xs font-semibold tracking-[0.03em] text-[#526474] sm:mt-7">
            Survey awal gratis · Depok &amp; Jabodetabek
          </p>
        </div>

        {/* Right Column: Full-Bleed Architectural Project & Field Inset */}
        <div className="relative min-h-[380px] bg-[#EBF4FA] sm:min-h-[480px] lg:h-full lg:min-h-[520px]">
          <Image
            src="/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png"
            alt="Fasad hunian modern selesai dibangun KilauBuild di Depok"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute right-4 top-4 hidden rounded-md bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#005592] shadow-sm backdrop-blur-sm sm:block">
            <span className="font-numeric">01</span> / Proyek selesai
          </div>

          {/* Overlapping Inset Card: 02 / PROSES LAPANGAN */}
          <div className="absolute -left-4 bottom-4 z-20 w-[240px] sm:-left-8 sm:bottom-6 sm:w-[280px] lg:-left-16 lg:bottom-6 xl:-left-20 xl:w-[320px]">
            <div className="overflow-hidden border-[6px] border-white bg-[#C8DEE9] shadow-[0_20px_50px_-15px_rgba(0,68,117,0.35)] sm:border-[8px]">
              <div className="relative aspect-[16/11] w-full">
                <Image
                  src="/bangun dari 0.png"
                  alt="Dokumentasi pekerjaan konstruksi pondasi di lokasi proyek KilauBuild"
                  fill
                  sizes="(max-width: 640px) 240px, 320px"
                  className="object-cover object-center"
                />
                <div className="absolute bottom-0 left-0 bg-white/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[#005592] sm:px-4 sm:py-2">
                  <span className="font-numeric">02</span> / Proses lapangan
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom 4-Column Process Bar */}
      <ol className="grid grid-cols-2 border-t border-[#CBD8DF] bg-white lg:grid-cols-4">
        {process.map((step, index) => (
          <li
            key={step.number}
            className={`flex items-start gap-3 border-[#CBD8DF] px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 ${
              index % 2 === 1 ? "border-l" : ""
            } ${index > 1 ? "border-t lg:border-t-0" : ""} ${index > 0 ? "lg:border-l" : ""}`}
          >
            <span className="font-numeric pt-0.5 text-xs font-bold text-[#005592]">{step.number}</span>
            <div>
              <p className="text-sm font-bold text-[#0A1E2F] sm:text-base">{step.title}</p>
              <p className="mt-0.5 text-xs leading-5 text-[#526474]">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};
