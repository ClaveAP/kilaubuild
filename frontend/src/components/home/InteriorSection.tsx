"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getApiData, resolveMediaUrl } from "@/lib/api";
import { fallbackInteriors, type InteriorItem } from "./landing-data";

const categories = ["Semua", "Living Room", "Kitchen Set", "Bedroom", "Bathroom"];

export const InteriorSection = () => {
  const [interiors, setInteriors] = useState<InteriorItem[]>(fallbackInteriors);
  const [filter, setFilter] = useState("Semua");

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

  return (
    <section id="interior" className="site-grid bg-[#EAF3F8] py-20 sm:py-28">
      <div className="site-shell">
        <div className="grid gap-9 lg:grid-cols-12 lg:items-end">
          <h2 className="section-heading lg:col-span-7">Ruang yang terasa pas setiap hari.</h2>
          <div className="lg:col-span-5">
            <p className="section-copy">
              Layout, ukuran furnitur, penyimpanan, dan pilihan material disesuaikan dengan kebiasaan penghuni serta ukuran ruang yang tersedia.
            </p>
          </div>
        </div>

        <div className="mt-10 flex gap-1 overflow-x-auto border-b border-[#9DB3BF] pb-px" role="group" aria-label="Filter galeri interior">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={`min-h-11 shrink-0 border-b-2 px-4 text-sm font-bold transition-colors ${
                filter === category
                  ? "border-[#005592] text-[#005592]"
                  : "border-transparent text-[#526474] hover:border-[#9DB3BF] hover:text-[#0A1E2F]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredItems.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-12">
            {filteredItems.map((item, index) => (
              <figure
                key={item.id}
                className={`group relative min-h-[360px] overflow-hidden rounded-2xl bg-[#D9E7EF] ${
                  index === 0 ? "lg:col-span-7 lg:min-h-[560px]" : "lg:col-span-5"
                }`}
              >
                <Image
                  src={resolveMediaUrl(item.imageUrl)}
                  alt={`${item.roomType}, gaya ${item.style}`}
                  fill
                  sizes={index === 0 ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 50vw, 42vw"}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B]/88 via-transparent to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-7">
                  <p className="text-xs font-bold text-[#B9D8E9]">{item.style}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{item.roomType}</h3>
                  {item.description && <p className="mt-2 max-w-lg text-sm leading-6 text-white/80">{item.description}</p>}
                </figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-[#9DB3BF] bg-white px-6 py-12 text-center">
            <h3 className="text-xl font-bold text-[#0A1E2F]">Belum ada proyek untuk kategori ini.</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#526474]">Pilih Semua untuk kembali melihat galeri interior yang tersedia.</p>
            <button type="button" onClick={() => setFilter("Semua")} className="button-secondary mt-5">
              Lihat semua interior
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
