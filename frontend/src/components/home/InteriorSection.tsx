"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getApiData, resolveMediaUrl } from "@/lib/api";
import { fallbackInteriors, type InteriorItem } from "./landing-data";

export const InteriorSection: React.FC = () => {
  const [interiors, setInteriors] = useState<InteriorItem[]>(fallbackInteriors);
  const [filter, setFilter] = useState<string>("Semua");

  useEffect(() => {
    const fetchInterior = async () => {
      try {
        const data = await getApiData<InteriorItem[]>("/desain-interiors");
        if (data.length > 0) {
          setInteriors(data);
        }
      } catch (err: unknown) {
        console.warn("Gagal memuat galeri interior backend, menggunakan foto lokal:", err);
      }
    };
    fetchInterior();
  }, []);

  const categories = ["Semua", "Living Room", "Kitchen Set", "Bedroom", "Bathroom"];

  const filteredItems =
    filter === "Semua"
      ? interiors
      : interiors.filter(
          (i) => i.roomType.toLowerCase() === filter.toLowerCase(),
        );

  return (
    <section id="interior" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FA] text-[#005592] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#66B2E0]/30">
            Katalog Desain Interior
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Galeri Interior & Custom <span className="text-[#005592]">Furniture</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Perpaduan keindahan estetika dan fungsionalitas ruang dengan pengerjaan presisi dan material HPL multiplek grade A.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat
                    ? "bg-[#005592] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Interior Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[28px] overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={resolveMediaUrl(item.imageUrl)}
                  alt={`${item.roomType} - ${item.style}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {item.roomType}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-[#005592] uppercase tracking-wider mb-1">
                  {item.style}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {item.roomType}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description || "Sentuhan interior modern presisi karya workshop KilauBuild."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
