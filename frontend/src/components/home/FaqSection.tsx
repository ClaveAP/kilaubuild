"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
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
    <section id="faq" className="bg-[#EAF3F8] py-20 sm:py-28">
      <div className="site-shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="section-heading">Pertanyaan sebelum mulai.</h2>
          <p className="section-copy mt-6">
            Baca penjelasan tentang termin, survey, area layanan, dan garansi. Jika kebutuhan Anda berbeda, bicarakan langsung dengan tim kami.
          </p>
          <a href="https://wa.me/6287776360795" target="_blank" rel="noopener noreferrer" className="button-secondary mt-7">
            Tanya lewat WhatsApp
          </a>
        </div>

        <div className="border-y border-[#9DB3BF] lg:col-span-7">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const panelId = `faq-panel-${faq.id}`;
            const buttonId = `faq-button-${faq.id}`;

            return (
              <div key={faq.id} className={index > 0 ? "border-t border-[#B8CAD4]" : ""}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex min-h-20 w-full items-center justify-between gap-5 py-5 text-left"
                  >
                    <span className="text-base font-bold leading-6 text-[#0A1E2F] sm:text-lg">{faq.question}</span>
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${isOpen ? "bg-[#005592] text-white" : "bg-white text-[#005592]"}`}>
                      <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={panelId} role="region" aria-labelledby={buttonId} className="pb-7 pr-14 text-sm leading-7 text-[#526474] sm:text-base">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
