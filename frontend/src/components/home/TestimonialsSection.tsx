"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Quote, Star } from "lucide-react";
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
    <section id="testimoni" className="border-y border-[#CBD8DF] bg-white py-20 sm:py-28">
      <div className="site-shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="section-heading">Material jelas, progres terlihat, biaya bisa diikuti.</h2>
            <p className="section-copy mt-6">
              Pengalaman klien setelah menjalani renovasi, pembangunan rumah, dan pengerjaan interior bersama KilauBuild.
            </p>
          </div>

          <div className="border-y border-[#9DB3BF] lg:col-span-7">
            {testimonies.map((item, index) => (
              <blockquote
                key={item.id}
                className={`grid gap-5 py-7 sm:grid-cols-[3rem_1fr] sm:py-9 ${index > 0 ? "border-t border-[#CBD8DF]" : ""}`}
              >
                <Quote className="h-8 w-8 text-[#66B2E0]" aria-hidden="true" />
                <div>
                  <div className="flex items-center gap-1" aria-label={`${item.rating} dari 5 bintang`}>
                    {Array.from({ length: item.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-4 w-4 fill-[#005592] text-[#005592]" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="mt-4 text-lg leading-8 text-[#294153] sm:text-xl">&ldquo;{item.review}&rdquo;</p>
                  <footer className="mt-6 flex items-center gap-3">
                    {item.photoUrl && (
                      <span className="relative h-11 w-11 overflow-hidden rounded-full bg-[#EAF3F8]">
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
                      <cite className="not-italic text-sm font-bold text-[#0A1E2F]">{item.clientName}</cite>
                      <p className="mt-0.5 text-xs font-semibold text-[#005592]">{item.projectType}</p>
                    </div>
                  </footer>
                </div>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
