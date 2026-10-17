"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CaretDown, WhatsappLogo } from "@phosphor-icons/react";
import { getApiData } from "@/lib/api";
import { fallbackFaqs, type FaqItem } from "./landing-data";

export const FaqSection = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>(fallbackFaqs);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getApiData<FaqItem[]>("/faqs");
        if (data.length > 0) setFaqs(data);
      } catch (error: unknown) {
        console.warn("Gagal memuat FAQ backend, menggunakan data lokal:", error);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 sm:py-20 lg:py-24">
      <div className="site-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Left Column: Header & Support Card */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Tanya Jawab &amp; Informasi</span>
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Pertanyaan penting sebelum <span className="font-serif italic font-normal text-[#005592]">memulai proyek.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#526474]">
              Rangkuman informasi penting seputar alur survei gratis, sistem pembayaran termin fisik, wilayah jangkauan, dan garansi retensi pasca-pembangunan.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[#D5E5EE] bg-gradient-to-br from-[#F0F7FB] to-white p-6 sm:p-7 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#005592]">
                Punya Pertanyaan Khusus?
              </span>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#233848]">
                Diskusikan langsung dengan tim arsitek dan teknis kami. Kami siap menjelaskan rincian biaya atau menjadwalkan survei ke lokasi Anda.
              </p>
              <a
                href="https://wa.me/6287776360795?text=Halo%20KilauBuild%2C%20saya%20ingin%20tanya%20seputar%20layanan%20dan%20biaya"
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-5 inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#005592] pl-5 pr-2 py-1.5 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] active:scale-[0.98]"
              >
                <WhatsappLogo size={16} weight="fill" className="text-white" />
                <span>Tanyakan via WhatsApp</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowUpRight size={14} weight="bold" />
                </span>
              </a>
            </div>
          </div>

          {/* Right Column: FAQ Accordion Bento Cards */}
          <div className="space-y-4 lg:col-span-7">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-panel-${faq.id}`;
              const buttonId = `faq-button-${faq.id}`;
              const num = String(index + 1).padStart(2, "0");

              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#005592]/40 bg-white shadow-[0_12px_36px_-16px_rgba(0,68,117,0.08)]"
                      : "border-[#E2ECF2] bg-white hover:border-[#CBD8DF]"
                  }`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors sm:p-6"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-numeric text-xs font-bold text-[#005592]">
                          {num}
                        </span>
                        <span className="text-base sm:text-lg font-bold text-[#092436]">
                          {faq.question}
                        </span>
                      </div>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen ? "bg-[#005592] text-white" : "bg-[#EBF4FA] text-[#005592]"
                        }`}
                      >
                        <CaretDown
                          size={18}
                          weight="bold"
                          className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </span>
                    </button>
                  </h3>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="border-t border-[#CBD8DF]/50 px-5 pb-6 pt-4 text-xs sm:text-sm leading-relaxed text-[#526474] sm:px-6"
                    >
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
