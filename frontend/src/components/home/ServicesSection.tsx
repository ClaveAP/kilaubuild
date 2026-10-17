"use client";

import Image from "next/image";
import { ArrowUpRight, Check } from "@phosphor-icons/react";
import { services } from "./landing-data";

export const ServicesSection = () => {
  return (
    <section id="layanan" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 sm:py-20 lg:py-24">
      <div className="site-shell">
        {/* Section Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-[#CBD8DF] pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Ruang Lingkup Layanan</span>
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Dari gambar rancangan hingga <span className="font-serif italic font-normal text-[#005592]">serah terima kunci.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#526474]">
            Pilih ruang lingkup yang Anda butuhkan. Setiap pekerjaan dimulai dari survei, gambar teknis, spesifikasi material, dan RAB rinci sebelum pekerjaan fisik dimulai.
          </p>
        </div>

        {/* Services Bento Stack */}
        <div className="mt-12 space-y-8">
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            const imageFirst = index % 2 === 0;
            const stepNum = String(index + 1).padStart(2, "0");

            return (
              <article
                key={service.title}
                className="grid gap-8 rounded-[2rem] border border-[#E2ECF2] bg-white p-6 sm:p-9 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.06)] transition-all duration-300 hover:border-[#005592]/30 lg:grid-cols-12 lg:items-center lg:gap-12"
              >
                <div
                  className={`relative min-h-[260px] overflow-hidden rounded-2xl bg-[#EBF4FA] sm:min-h-[320px] lg:col-span-5 lg:h-[clamp(300px,38svh,380px)] lg:min-h-0 ${
                    imageFirst ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.03]"
                  />
                  <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1 text-xs font-bold text-[#005592] shadow-xs backdrop-blur-md">
                    {service.tag}
                  </div>
                </div>

                <div className={`lg:col-span-7 ${imageFirst ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-numeric text-xs font-bold text-[#005592] bg-[#EBF4FA] px-2.5 py-0.5 rounded-full">
                      {stepNum}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#005592]">
                      Layanan KilauBuild
                    </span>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-4">
                    <h3 className="text-2xl font-bold tracking-tight text-[#092436] sm:text-3xl">
                      {service.title}
                    </h3>
                    <ServiceIcon size={24} weight="bold" className="shrink-0 text-[#005592]/40" aria-hidden="true" />
                  </div>

                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#526474]">
                    {service.description}
                  </p>

                  <div className="mt-6 grid gap-2.5 sm:grid-cols-3">
                    {service.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-start gap-2 rounded-xl border border-[#CBD8DF]/60 bg-[#F8FBFD] p-3 text-xs font-medium text-[#092436]"
                      >
                        <Check size={14} weight="bold" className="mt-0.5 shrink-0 text-[#005592]" aria-hidden="true" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-7 pt-4 border-t border-[#CBD8DF]/60">
                    <a
                      href="#booking"
                      className="group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[#005592] pl-5 pr-2 py-1.5 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] active:scale-[0.98]"
                    >
                      <span>Bahas Layanan Ini</span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                        <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
