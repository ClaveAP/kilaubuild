"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Buildings,
  Check,
  HardHat,
  PencilRuler,
  ShieldCheck,
  WhatsappLogo,
} from "@phosphor-icons/react";

const paymentSteps = [
  { step: "01", title: "Kerja Fisik", desc: "Tukang bangun di lokasi" },
  { step: "02", title: "Cek Bersama", desc: "Inspeksi fisik langsung" },
  { step: "03", title: "Validasi BAP", desc: "Tanda tangan berita acara" },
  { step: "04", title: "Bayar Termin", desc: "Sesuai progres riil" },
];

export const CompanyAboutSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="tentang" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 sm:py-20 lg:py-24">
      <div className="site-shell">
        {/* Section Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Tentang KilauBuild</span>
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Membangun dengan kepastian. Mengutamakan <span className="font-serif italic font-normal text-[#005592]">transparansi.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#526474]">
            Hadir di Depok dan Jabodetabek untuk membuktikan bahwa membangun rumah dan menata interior bisa berjalan tertib, presisi, dan bebas rasa was-was.
          </p>
        </div>

        {/* Content Bento Grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:items-stretch lg:gap-8">
          {/* Left Column: Founder Showcase (Warm, Grounded, Human) */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col justify-between rounded-[2rem] border border-[#E2ECF2] bg-white p-6 sm:p-8 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.08)] lg:col-span-5"
          >
            <div>
              {/* Photo Frame */}
              <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-[#EBF4FA] shadow-xs">
                <Image
                  src="/owner.jpeg"
                  alt="Bagus, Founder & Pengawas Lapangan KilauBuild"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                  priority
                />
                <div className="absolute left-3.5 top-3.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#005592] shadow-xs backdrop-blur-md">
                  Bagus · Founder
                </div>
                <div className="absolute right-3.5 top-3.5 rounded-full bg-[#092436]/80 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                  Depok &amp; Jabodetabek
                </div>
              </div>

              {/* Founder Credentials & Personal Quote */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-[#092436]">
                      Bagus
                    </h3>
                    <p className="mt-0.5 text-xs font-semibold text-[#526474]">
                      Founder &amp; Pengawas Lapangan
                    </p>
                  </div>
                  <span className="rounded-full bg-[#EBF4FA] px-3 py-1 text-[11px] font-bold text-[#005592]">
                    KilauBuild
                  </span>
                </div>

                <blockquote className="relative mt-5 rounded-2xl border border-[#E2ECF2]/80 bg-[#F8FBFD] p-5 text-xs sm:text-sm leading-relaxed text-[#233848]">
                  <span className="font-serif text-2xl leading-none text-[#005592]/40 mr-1">&ldquo;</span>
                  Membangun rumah adalah amanah besar bagi keluarga Anda. Di KilauBuild, kami awasi langsung setiap tahap konstruksi agar gambar kerja arsitektur terwujud presisi tanpa kejutan biaya.
                  <span className="font-serif text-2xl leading-none text-[#005592]/40 ml-1">&rdquo;</span>
                </blockquote>

                <div className="mt-5 space-y-2.5 text-xs text-[#526474]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EBF4FA] text-[10px] font-bold text-[#005592]">
                      <Check size={12} weight="bold" />
                    </span>
                    <span className="text-[#233848]">Supervisi fisik langsung di lokasi Depok &amp; sekitarnya</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EBF4FA] text-[10px] font-bold text-[#005592]">
                      <Check size={12} weight="bold" />
                    </span>
                    <span className="text-[#233848]">RAB mengikat dengan rincian material tertera transparan</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EBF4FA] text-[10px] font-bold text-[#005592]">
                      <Check size={12} weight="bold" />
                    </span>
                    <span className="text-[#233848]">Workshop mandiri custom interior di Citayam, Depok</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nested Island Button CTA */}
            <div className="mt-6 border-t border-[#E2ECF2] pt-6">
              <a
                href="https://wa.me/6287776360795?text=Halo%20Mas%20Bagus%2C%20saya%20ingin%20konsultasi%20proyek%20di%20KilauBuild"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-12 w-full items-center justify-between rounded-full bg-[#005592] py-2 pl-6 pr-2 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#0066AE] active:scale-[0.98]"
              >
                <span className="flex items-center gap-2.5">
                  <WhatsappLogo size={18} weight="fill" className="text-white" />
                  <span>Konsultasi Proyek dengan Mas Bagus</span>
                </span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpRight size={15} weight="bold" />
                </span>
              </a>

              <p className="mt-3 text-center text-[11px] text-[#526474]">
                Respons langsung dari penanggung jawab proyek
              </p>
            </div>
          </motion.div>

          {/* Right Column: Dynamic Asymmetrical Bento */}
          <div className="flex flex-col justify-between gap-4 lg:col-span-7">
            {/* Bento Card 1: Flagship Principle (Bangun Dulu, Baru Bayar) */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08, ease: "easeOut" }}
              className="rounded-[2rem] border border-[#D5E5EE] bg-gradient-to-br from-[#F0F7FB] via-white to-[#F8FBFD] p-6 sm:p-8 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.06)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#005592] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    01
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#005592]">
                    Sistem Pembayaran Adil
                  </span>
                </div>
                <span className="rounded-full border border-[#005592]/20 bg-white px-3 py-1 text-[11px] font-semibold text-[#005592]">
                  Tanpa DP 100% di Awal
                </span>
              </div>

              <h3 className="mt-4 text-xl sm:text-2xl font-bold tracking-tight text-[#092436]">
                Bangun Dulu, Baru Bayar
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#526474]">
                Sistem termin bertahap yang hanya ditagihkan setelah progres fisik di lokasi Anda periksa dan setujui bersama berita acara (BAP). Anda memegang kendali penuh atas mutu sebelum pembayaran berikutnya berjalan.
              </p>

              {/* 4-Step Milestone Progress Bar */}
              <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {paymentSteps.map((step, sIdx) => {
                  const isFinal = sIdx === paymentSteps.length - 1;
                  return (
                    <div
                      key={step.step}
                      className={`rounded-xl p-3 border transition-colors ${
                        isFinal
                          ? "border-[#005592]/30 bg-[#005592]/8 text-[#005592]"
                          : "border-[#CBD8DF]/60 bg-white/85 text-[#092436]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-numeric text-[10px] font-bold text-[#005592]">
                          {step.step}
                        </span>
                        {isFinal ? (
                          <ShieldCheck size={14} weight="bold" className="text-[#005592]" />
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs font-bold">{step.title}</p>
                      <p className="mt-0.5 text-[10px] leading-tight text-[#526474]">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Bento Cards 2 & 3: Two Balanced Pillars */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Pillar 02: RAB Rinci */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.14, ease: "easeOut" }}
                className="flex flex-col justify-between rounded-[2rem] border border-[#E2ECF2] bg-white p-6 sm:p-7 shadow-[0_8px_30px_-16px_rgba(0,68,117,0.06)] transition-all duration-300 hover:border-[#005592]/30 hover:shadow-[0_12px_36px_-16px_rgba(0,68,117,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#EBF4FA] px-2.5 py-0.5 font-numeric text-[10px] font-bold text-[#005592]">
                      02
                    </span>
                    <PencilRuler size={18} weight="bold" className="text-[#005592]/60" />
                  </div>
                  <h4 className="mt-4 text-base sm:text-lg font-bold tracking-tight text-[#092436]">
                    RAB Rinci &amp; Terikat Kontrak
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#526474]">
                    Spesifikasi merek material, mutu beton, dan volume tertera jelas di awal. Biaya terkunci tanpa mark-up terselubung di tengah proyek.
                  </p>
                </div>
                <div className="mt-5 border-t border-[#CBD8DF]/60 pt-3 text-[11px] font-semibold text-[#005592]">
                  Spesifikasi material terkunci
                </div>
              </motion.div>

              {/* Pillar 03: Supervisi Lapangan */}
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
                className="flex flex-col justify-between rounded-[2rem] border border-[#E2ECF2] bg-white p-6 sm:p-7 shadow-[0_8px_30px_-16px_rgba(0,68,117,0.06)] transition-all duration-300 hover:border-[#005592]/30 hover:shadow-[0_12px_36px_-16px_rgba(0,68,117,0.12)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#EBF4FA] px-2.5 py-0.5 font-numeric text-[10px] font-bold text-[#005592]">
                      03
                    </span>
                    <HardHat size={18} weight="bold" className="text-[#005592]/60" />
                  </div>
                  <h4 className="mt-4 text-base sm:text-lg font-bold tracking-tight text-[#092436]">
                    Supervisi Lapangan Berkala
                  </h4>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#526474]">
                    Mandor dan tim arsitek rutin menginspeksi mutu pekerjaan langsung di lokasi untuk memastikan gambar kerja terwujud presisi.
                  </p>
                </div>
                <div className="mt-5 border-t border-[#CBD8DF]/60 pt-3 text-[11px] font-semibold text-[#005592]">
                  Inspeksi &amp; laporan berkala
                </div>
              </motion.div>
            </div>

            {/* Bento Card 4: Workshop Mandiri Citayam */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.26, ease: "easeOut" }}
              className="rounded-[2rem] border border-[#E2ECF2] bg-white p-6 sm:p-7 shadow-[0_8px_30px_-16px_rgba(0,68,117,0.06)] transition-all duration-300 hover:border-[#005592]/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#EBF4FA] px-2.5 py-0.5 font-numeric text-[10px] font-bold text-[#005592]">
                      04
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#005592]">
                      Fasilitas Produksi Mandiri
                    </span>
                  </div>
                  <h4 className="mt-2 text-base sm:text-lg font-bold tracking-tight text-[#092436]">
                    Workshop Interior &amp; Kayu di Citayam, Depok
                  </h4>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[#526474] max-w-xl">
                    Memiliki bengkel kayu sendiri untuk fabrikasi kitchen set, lemari custom, dan kisi-kisi interior. Presisi tinggi tanpa dilempar ke pihak ketiga.
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#005592]/20 bg-[#EBF4FA] px-3.5 py-1.5 text-xs font-semibold text-[#005592]">
                    <Buildings size={15} weight="bold" />
                    <span>Terbuka Dikunjungi Klien</span>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
