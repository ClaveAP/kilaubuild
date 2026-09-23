"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getApiData, resolveMediaUrl } from "@/lib/api";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import { fallbackTestimonies, type TestimonyItem } from "./landing-data";

export const TestimonialsSection: React.FC = () => {
  const [testimonies, setTestimonies] = useState<TestimonyItem[]>(fallbackTestimonies);

  useEffect(() => {
    const fetchTestimonies = async () => {
      try {
        const data = await getApiData<TestimonyItem[]>("/testimonies");
        if (data.length > 0) {
          setTestimonies(data);
        }
      } catch (err: unknown) {
        console.warn("Gagal memuat testimoni backend, menggunakan data lokal:", err);
      }
    };
    fetchTestimonies();
  }, []);

  return (
    <section id="testimoni" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FA] text-[#005592] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#66B2E0]/30">
            Ulasan Klien Terverifikasi
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Kepercayaan & Kepuasan <span className="text-[#005592]">Klien Kami</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Pengalaman nyata pemilik hunian yang telah mempercayakan pembangunan dan renovasi bersama KilauBuild.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonies.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] p-8 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative"
            >
              <div className="text-[#66B2E0] mb-4">
                <Quote className="w-8 h-8 opacity-40" />
              </div>

              <div className="flex-1 mb-6">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed italic">
                  &ldquo;{item.review}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {item.photoUrl && (
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#EBF4FA] shrink-0">
                      <Image
                        src={resolveMediaUrl(item.photoUrl, "/owner.jpeg")}
                        alt={item.clientName}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">
                      {item.clientName}
                    </h4>
                    <p className="text-xs text-[#005592] font-semibold mt-0.5">
                      {item.projectType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Klien Terverifikasi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
