"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Quotes, Star } from "@phosphor-icons/react";
import { getApiData, resolveMediaUrl } from "@/lib/api";
import { fallbackTestimonies, type TestimonyItem } from "./landing-data";

export const TestimonialsSection = () => {
  const [testimonies, setTestimonies] = useState<TestimonyItem[]>(fallbackTestimonies);

  useEffect(() => {
    const fetchTestimonies = async () => {
      try {
        const data = await getApiData<TestimonyItem[]>("/testimonies");
        if (data.length > 0) setTestimonies(data);
      } catch (error: unknown) {
        console.warn("Gagal memuat testimoni backend, menggunakan data lokal:", error);
      }
    };

    fetchTestimonies();
  }, []);

  return (
    <section id="testimoni" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 sm:py-20 lg:py-24">
      <div className="site-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Left Column: Header & Trust Badge */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Testimoni &amp; Pengalaman Klien</span>
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Material jelas, progres terlihat, <span className="font-serif italic font-normal text-[#005592]">biaya terkendali.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#526474]">
              Pengalaman nyata pemilik hunian setelah menjalani renovasi, pembangunan rumah dari nol, dan pengerjaan custom interior bersama tim KilauBuild.
            </p>

            <div className="mt-8 rounded-[2rem] border border-[#D5E5EE] bg-gradient-to-br from-[#F0F7FB] to-white p-6 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#005592]">
                Kepuasan &amp; Kepercayaan
              </span>
              <p className="mt-2 text-sm leading-relaxed text-[#233848]">
                Setiap proyek diselesaikan dengan verifikasi Berita Acara Progres (BAP) dan dilindungi garansi retensi pasca-serah terima.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#005592]">
                <span>★★★★★</span>
                <span className="text-[#526474]">· Rating klien terverifikasi</span>
              </div>
            </div>
          </div>

          {/* Right Column: Testimonial Cards */}
          <div className="space-y-6 lg:col-span-7">
            {testimonies.map((item) => (
              <blockquote
                key={item.id}
                className="flex flex-col justify-between rounded-[2rem] border border-[#E2ECF2] bg-white p-7 sm:p-8 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.06)] transition-all duration-300 hover:border-[#005592]/30"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1" aria-label={`${item.rating} dari 5 bintang`}>
                      {Array.from({ length: item.rating }).map((_, starIndex) => (
                        <Star key={starIndex} size={16} weight="fill" className="text-[#005592]" aria-hidden="true" />
                      ))}
                    </div>
                    <Quotes size={24} weight="fill" className="text-[#005592]/20" aria-hidden="true" />
                  </div>

                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#092436]">
                    &ldquo;{item.review}&rdquo;
                  </p>
                </div>

                <footer className="mt-6 flex items-center gap-3.5 border-t border-[#CBD8DF]/60 pt-4">
                  {item.photoUrl && (
                    <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#EBF4FA] ring-2 ring-[#005592]/10">
                      <Image
                        src={resolveMediaUrl(item.photoUrl, "/owner.jpeg")}
                        alt=""
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </span>
                  )}
                  <div>
                    <cite className="not-italic text-sm font-bold text-[#092436]">{item.clientName}</cite>
                    <p className="mt-0.5 text-xs font-semibold text-[#005592]">{item.projectType}</p>
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
