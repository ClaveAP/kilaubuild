"use client";

import React, { useState, useEffect } from "react";
import { getApiData } from "@/lib/api";
import { ChevronDown } from "lucide-react";
import { fallbackFaqs, type FaqItem } from "./landing-data";

export const FaqSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>(fallbackFaqs);
  const [openIdx, setOpenIdx] = useState<number | null>(0); // First one open by default

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getApiData<FaqItem[]>("/faqs");
        if (data.length > 0) {
          setFaqs(data);
        }
      } catch (err: unknown) {
        console.warn("Gagal memuat FAQ backend, menggunakan data lokal:", err);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FA] text-[#005592] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#66B2E0]/30">
            Pertanyaan Umum (FAQ)
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Semua yang Perlu Anda <span className="text-[#005592]">Ketahui</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Transparansi adalah prioritas kami. Temukan jawaban seputar alur kerja, sistem termin &quot;Bangun Dulu Baru Bayar&quot;, dan garansi proyek KilauBuild.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={faq.id}
                className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden transition-all duration-200 shadow-2xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-base font-bold text-gray-900 pr-4">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-[#EBF4FA] text-[#005592] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-[#005592] text-white" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 animate-in fade-in duration-150">
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
