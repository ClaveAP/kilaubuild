"use client";

import { ArrowUpRight, ClipboardText, HardHat, ShieldCheck } from "@phosphor-icons/react";
import { StatsSection } from "./StatsSection";

const projectStages = [
  {
    step: "01",
    tag: "Perencanaan & Anggaran",
    stage: "Sebelum Mulai",
    detail: "Kebutuhan ruang, denah, dan spesifikasi material disusun detail ke gambar kerja teknis dan RAB. Biaya mengikat disepakati bersama sebelum tukang masuk lokasi.",
    milestone: "Gambar kerja & RAB terkunci transparan",
    icon: ClipboardText,
  },
  {
    step: "02",
    tag: "Eksekusi & Supervisi",
    stage: "Selama Pekerjaan",
    detail: "Setiap tahap konstruksi diawasi mandor dan tim teknis. Anda menginspeksi progres fisik di lokasi sebelum menyetujui termin pembayaran berikutnya.",
    milestone: "Validasi BAP sebelum bayar termin",
    icon: HardHat,
  },
  {
    step: "03",
    tag: "Jaminan Mutu",
    stage: "Setelah Serah Terima",
    detail: "Setelah bangunan selesai dan diserahterimakan, hasil pekerjaan dilindungi garansi retensi dan pemeliharaan untuk memastikan kepuasan dan kenyamanan hunian Anda.",
    milestone: "Garansi retensi pemeliharaan 3 bulan",
    icon: ShieldCheck,
  },
];

export const AboutSection = () => {
  return (
    <section id="cara-kerja" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 sm:py-20 lg:py-24">
      <div className="site-shell">
        {/* Section Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-[#CBD8DF] pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Tahapan Proyek &amp; Cara Kerja</span>
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Progres terlihat. Termin <span className="font-serif italic font-normal text-[#005592]">terkendali.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#526474]">
              Dari RAB hingga serah terima, setiap tahap memiliki berita acara fisik yang Anda verifikasi langsung di lapangan.
            </p>
            <a
              href="#booking"
              className="group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#005592] pl-5 pr-2 py-1.5 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] active:scale-[0.98]"
            >
              <span>Bicarakan Rencana Proyek</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>

        {/* 3-Stage Process Bento Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectStages.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.step}
                className="flex flex-col justify-between rounded-[2rem] border border-[#E2ECF2] bg-white p-7 sm:p-8 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.06)] transition-all duration-300 hover:border-[#005592]/30 hover:shadow-[0_16px_40px_-16px_rgba(0,68,117,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#EBF4FA] px-3 py-1 font-numeric text-xs font-bold text-[#005592]">
                      {item.step}
                    </span>
                    <Icon size={22} weight="bold" className="text-[#005592]/50" aria-hidden="true" />
                  </div>

                  <span className="mt-5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[#005592]">
                    {item.tag}
                  </span>
                  <h3 className="mt-1 text-xl font-bold tracking-tight text-[#092436] sm:text-2xl">
                    {item.stage}
                  </h3>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#526474]">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#CBD8DF]/60 pt-4 text-xs font-medium text-[#092436]">
                  <span className="inline-flex items-center gap-1.5 text-[#005592]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" aria-hidden="true" />
                    <span className="font-semibold">{item.milestone}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Embedded Stats Section */}
      <StatsSection />
    </section>
  );
};
