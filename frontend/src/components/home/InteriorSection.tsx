"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react";
import { getApiData, resolveMediaUrl } from "@/lib/api";
import { fallbackInteriors, type InteriorItem } from "./landing-data";

const categories = ["Semua", "Living Room", "Kitchen Set", "Bedroom", "Bathroom"];

export const InteriorSection = () => {
  const [interiors, setInteriors] = useState<InteriorItem[]>(fallbackInteriors);
  const [filter, setFilter] = useState("Semua");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchInterior = async () => {
      try {
        const data = await getApiData<InteriorItem[]>("/desain-interiors");
        if (data.length > 0) setInteriors(data);
      } catch (error: unknown) {
        console.warn("Gagal memuat galeri interior backend, menggunakan foto lokal:", error);
      }
    };

    fetchInterior();
  }, []);

  const filteredItems =
    filter === "Semua"
      ? interiors
      : interiors.filter((item) => item.roomType.toLowerCase() === filter.toLowerCase());
  const visibleIndex = Math.min(activeIndex, Math.max(filteredItems.length - 1, 0));
  const activeItem = filteredItems[visibleIndex];
  const nextItem = filteredItems.length > 1 ? filteredItems[(visibleIndex + 1) % filteredItems.length] : null;

  const goTo = (nextIndex: number) => {
    if (filteredItems.length > 0) {
      setActiveIndex((nextIndex + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="interior" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 sm:py-20 lg:py-24">
      <div className="site-shell">
        {/* Section Header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between border-b border-[#CBD8DF] pb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Desain Interior &amp; Custom Furniture</span>
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Ruang yang terasa pas <span className="font-serif italic font-normal text-[#005592]">setiap hari.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm sm:text-base leading-relaxed text-[#526474]">
            Layout, ukuran furnitur, kapasitas penyimpanan, dan pemilihan material diselaraskan dengan kebiasaan penghuni serta luas bidang ruang yang tersedia.
          </p>
        </div>

        {/* Fluid Pill Filter */}
        <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter galeri interior">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setFilter(category);
                setActiveIndex(0);
              }}
              aria-pressed={filter === category}
              className={`min-h-10 rounded-full px-5 text-xs font-bold transition-all duration-300 ${
                filter === category
                  ? "bg-[#005592] text-white shadow-xs"
                  : "border border-[#CBD8DF] bg-white text-[#526474] hover:border-[#005592]/40 hover:text-[#092436]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {activeItem ? (
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Galeri desain interior"
            className="mt-8 outline-none focus-visible:ring-2 focus-visible:ring-[#005592]"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault();
                goTo(visibleIndex + (event.key === "ArrowRight" ? 1 : -1));
              }
            }}
          >
            <div className="grid gap-6 md:grid-cols-12">
              <figure className="group relative h-[clamp(340px,50svh,480px)] overflow-hidden rounded-[2rem] border border-[#E2ECF2] bg-[#EBF4FA] shadow-[0_12px_36px_-16px_rgba(0,68,117,0.06)] md:col-span-7">
                <Image
                  src={resolveMediaUrl(activeItem.imageUrl)}
                  alt={`${activeItem.roomType}, gaya ${activeItem.style}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/90 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                    {activeItem.style}
                  </span>
                  <h3 aria-live="polite" className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{activeItem.roomType}</h3>
                  {activeItem.description && <p className="mt-2 max-w-lg text-xs sm:text-sm leading-relaxed text-slate-200">{activeItem.description}</p>}
                </figcaption>
              </figure>

              {nextItem && (
                <button
                  type="button"
                  onClick={() => goTo(visibleIndex + 1)}
                  className="group relative hidden h-[clamp(340px,50svh,480px)] overflow-hidden rounded-[2rem] border border-[#E2ECF2] bg-[#EBF4FA] text-left shadow-[0_12px_36px_-16px_rgba(0,68,117,0.06)] transition-all duration-300 hover:border-[#005592]/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005592] md:col-span-5 md:block"
                  aria-label={`Tampilkan ${nextItem.roomType}, gaya ${nextItem.style}`}
                >
                  <Image
                    src={resolveMediaUrl(nextItem.imageUrl)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 42vw, 42vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/90 via-[#071A2B]/20 to-transparent" aria-hidden="true" />
                  <span className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      Berikutnya · {nextItem.style}
                    </span>
                    <span className="mt-3 block text-2xl font-bold tracking-tight">{nextItem.roomType}</span>
                  </span>
                </button>
              )}
            </div>

            {filteredItems.length > 1 && (
              <div className="mt-6 flex items-center justify-between gap-5 pt-2">
                <span className="font-numeric text-xs sm:text-sm font-semibold text-[#526474]" aria-live="polite">
                  Interior <span className="text-[#005592]">{String(visibleIndex + 1).padStart(2, "0")} / {String(filteredItems.length).padStart(2, "0")}</span>
                </span>
                <div className="flex items-center gap-2.5">
                  <button type="button" onClick={() => goTo(visibleIndex - 1)} aria-label="Interior sebelumnya" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CBD8DF] bg-white text-[#092436] transition-all hover:bg-[#F8FBFD]">
                    <ArrowLeft size={16} weight="bold" aria-hidden="true" />
                  </button>
                  <button type="button" onClick={() => goTo(visibleIndex + 1)} aria-label="Interior berikutnya" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#005592] text-white transition-all hover:bg-[#0066AE]">
                    <ArrowRight size={16} weight="bold" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-[2rem] border border-[#E2ECF2] bg-white px-6 py-12 text-center shadow-xs">
            <h3 className="text-xl font-bold text-[#092436]">Belum ada proyek untuk kategori ini.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#526474]">Pilih Semua untuk kembali melihat galeri interior yang tersedia.</p>
            <button
              type="button"
              onClick={() => setFilter("Semua")}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#005592] px-6 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#0066AE]"
            >
              Lihat semua interior
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
