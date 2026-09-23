import React from "react";
import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "./landing-data";

export const ServicesSection: React.FC = () => {
  return (
    <section id="layanan" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FA] text-[#005592] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#66B2E0]/30">
            Layanan Unggulan
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight mb-4">
            Solusi Konstruksi & Interior <span className="text-[#005592]">Terlengkap</span>
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Dari perencanaan konsep hingga serah terima kunci, KilauBuild menyediakan solusi menyeluruh dengan standar SNI dan pengawasan ketat.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => {
            const ServiceIcon = service.icon;
            return (
            <div
              key={service.title}
              className="bg-white rounded-[28px] overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium px-3.5 py-1.5 rounded-full shadow">
                  {service.tag}
                </div>
              </div>

              {/* Service Info */}
              <div className="p-7 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-[#EBF4FA] text-[#005592] flex items-center justify-center shrink-0">
                      <ServiceIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-[#005592] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {service.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5 text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-[#EBF4FA] text-[#005592] flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href="#booking"
                    className="inline-flex items-center gap-2.5 text-sm font-semibold text-slate-900 group-hover:text-[#005592] transition-colors"
                  >
                    <span>Konsultasikan Layanan Ini</span>
                    <span className="w-7 h-7 rounded-full bg-[#005592] text-white flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </a>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
};
