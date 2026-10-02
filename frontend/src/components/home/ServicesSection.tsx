import Image from "next/image";
import { ArrowUpRight, Check } from "lucide-react";
import { services } from "./landing-data";

export const ServicesSection = () => {
  return (
    <section id="layanan" className="border-y border-[#CBD8DF] bg-white py-20 sm:py-28">
      <div className="site-shell">
        <div className="grid items-end gap-8 border-b border-[#9DB3BF] pb-10 lg:grid-cols-12">
          <h2 className="section-heading lg:col-span-7">Dari gambar sampai selesai.</h2>
          <p className="section-copy lg:col-span-5">
            Pilih ruang lingkup yang Anda butuhkan. Setiap pekerjaan dibahas melalui survey, gambar, spesifikasi material, dan RAB sebelum tim masuk ke lapangan.
          </p>
        </div>

        <div>
          {services.map((service, index) => {
            const ServiceIcon = service.icon;
            const imageFirst = index % 2 === 0;

            return (
              <article
                key={service.title}
                className="grid gap-7 border-b border-[#CBD8DF] py-10 lg:grid-cols-12 lg:items-center lg:gap-12 lg:py-14"
              >
                <div
                  className={`relative min-h-[280px] overflow-hidden rounded-2xl bg-[#EAF3F8] sm:min-h-[360px] lg:col-span-5 ${
                    imageFirst ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.025]"
                  />
                  <span className="absolute left-4 top-4 rounded-lg bg-[#071A2B]/82 px-3 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                    {service.tag}
                  </span>
                </div>

                <div className={`lg:col-span-7 ${imageFirst ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#005592]">
                      <ServiceIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="max-w-xl text-2xl font-bold leading-tight text-[#0A1E2F] sm:text-3xl">
                        {service.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-[#526474]">{service.description}</p>
                    </div>
                  </div>

                  <ul className="mt-7 grid gap-0 border-y border-[#CBD8DF] sm:grid-cols-3">
                    {service.features.map((feature, featureIndex) => (
                      <li
                        key={feature}
                        className={`flex gap-2 py-4 text-sm leading-6 text-[#294153] sm:px-4 ${
                          featureIndex > 0 ? "border-t border-[#CBD8DF] sm:border-l sm:border-t-0" : "sm:pl-0"
                        }`}
                      >
                        <Check className="mt-1 h-4 w-4 shrink-0 text-[#005592]" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a href="#booking" className="button-secondary mt-7">
                    Bahas layanan ini
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
