import Image from "next/image";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const process = [
  { number: "01", title: "Rencana", detail: "Kebutuhan dan biaya disusun." },
  { number: "02", title: "Bangun", detail: "Pekerjaan berjalan bertahap." },
  { number: "03", title: "Periksa", detail: "Progres fisik Anda lihat." },
  { number: "04", title: "Bayar", detail: "Termin mengikuti progres." },
];

export const HeroSection = () => {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#F8FBFD] pt-[72px] lg:pt-0">
      <div className="pointer-events-none absolute right-0 top-0 h-[76%] w-[55%] bg-[#EBF4FA]" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-[calc(100svh-72px)] max-w-[1440px] flex-col px-5 pb-3 pt-6 sm:px-8 sm:pb-6 sm:pt-12 lg:min-h-[100svh] lg:px-10 lg:pb-0 lg:pt-0 xl:px-16">
        <div className="grid flex-1 items-center gap-3 sm:gap-6 lg:min-h-0 lg:grid-cols-[0.96fr_1.04fr]">
          <div className="relative z-10 py-2 lg:py-8">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.19em] text-[#005592] sm:mb-7">
              <span className="h-px w-8 bg-[#005592]" aria-hidden="true" />
              Bangun rumah, lebih tenang
            </p>
            <h1 className="hero-editorial-title text-[clamp(2.55rem,4.2vw,4.75rem)] leading-[1.12] tracking-[-0.035em] text-[#092436]">
              <span className="block">Rumah bagus.</span>
              <span className="block">Proses <em className="font-normal not-italic text-[#005592]">jelas.</em></span>
            </h1>
            <p className="mt-5 max-w-[32rem] text-base leading-7 text-[#526474] sm:mt-6 sm:text-lg sm:leading-8">
              Bangun, renovasi, dan interior dengan progres yang bisa Anda cek sebelum membayar termin berikutnya.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row">
              <a href="#booking" className="button-primary w-full rounded-none px-6 sm:w-auto">
                Diskusikan proyek Anda
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a href="#portofolio" className="button-secondary w-full rounded-none px-6 sm:w-auto">
                Lihat hasil kerja
                <ArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
            <p className="mt-4 text-xs font-medium tracking-[0.03em] text-[#668091] sm:mt-6">
              Survey awal gratis · Depok &amp; Jabodetabek
            </p>
          </div>

          <div className="relative h-[260px] sm:h-[480px] lg:h-[60svh] lg:min-h-[390px] lg:max-h-[670px]" aria-label="Dokumentasi proyek KilauBuild">
            <figure className="absolute right-0 top-0 h-[58%] w-[79%] border-[8px] border-[#F8FBFD] bg-[#D6E5EC] shadow-[0_24px_60px_-35px_rgba(0,68,117,0.38)] sm:right-[2%] sm:top-[5%] lg:top-[11%]">
              <Image
                src="/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png"
                alt="Fasad rumah modern dengan taman, salah satu proyek selesai KilauBuild"
                fill
                sizes="(max-width: 640px) 75vw, (max-width: 1024px) 55vw, 36vw"
                priority
                className="object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 hidden bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#004475] sm:block sm:px-4 sm:py-3">
                <span className="font-numeric">01</span> / Proyek selesai
              </figcaption>
            </figure>
            <figure className="absolute bottom-[3%] left-0 h-[48%] w-[63%] border-[8px] border-[#F8FBFD] bg-[#C8DEE9] shadow-[0_24px_60px_-35px_rgba(0,68,117,0.42)] sm:bottom-[5%] lg:bottom-[9%] lg:left-[2%]">
              <Image
                src="/bangun dari 0.png"
                alt="Dokumentasi pekerjaan konstruksi di lokasi proyek KilauBuild"
                fill
                sizes="(max-width: 640px) 60vw, (max-width: 1024px) 45vw, 30vw"
                className="object-cover object-center"
              />
              <figcaption className="absolute bottom-0 left-0 bg-white/95 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#004475] sm:px-4 sm:py-3">
                <span className="font-numeric">02</span> / Proses lapangan
              </figcaption>
            </figure>
            <span className="absolute bottom-[16%] right-[2%] hidden text-[10px] font-bold uppercase tracking-[0.2em] text-[#005592] sm:block [writing-mode:vertical-rl]">
              KilauBuild · <span className="font-numeric">2026</span>
            </span>
          </div>
        </div>

        <ol className="grid grid-cols-2 border-t border-[#C7DCE7] lg:grid-cols-4">
          {process.map((step, index) => (
            <li key={step.number} className={`flex gap-2 border-[#D7E4EB] py-3 sm:gap-4 sm:py-4 lg:py-5 ${index % 2 === 1 ? "border-l pl-3 sm:pl-6" : ""} ${index > 1 ? "border-t lg:border-t-0" : ""} ${index > 0 ? "lg:border-l lg:pl-6" : ""}`}>
              <span className="font-numeric pt-1 text-xs font-bold text-[#005592]">{step.number}</span>
              <div>
                <h2 className="text-sm font-bold text-[#0A1E2F] sm:text-base">{step.title}</h2>
                <p className="mt-1 hidden text-xs leading-5 text-[#526474] sm:block">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
