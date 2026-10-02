import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const projectStages = [
  {
    stage: "Sebelum mulai",
    detail: "Kebutuhan ruang, material, gambar kerja, dan biaya dirinci dalam RAB.",
  },
  {
    stage: "Selama pekerjaan",
    detail: "Progres fisik didokumentasikan dan dapat diperiksa langsung di lokasi.",
  },
  {
    stage: "Setelah serah terima",
    detail: "Garansi retensi 3 bulan menjaga hasil pekerjaan setelah proyek selesai.",
  },
];

export const AboutSection = () => {
  return (
    <section id="tentang" className="site-grid border-y border-[#CBD8DF] bg-white py-20 sm:py-28">
      <div className="site-shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="section-heading">
              Progres terlihat. Termin terkendali.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-2">
            <p className="section-copy">
              RAB menjadi acuan sejak awal. Saat satu tahap selesai, Anda melihat hasilnya di lapangan. Pembayaran berikutnya dilakukan setelah progres itu diperiksa.
            </p>
            <a href="#booking" className="button-primary mt-7">
              Bicarakan rencana proyek
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-14 grid overflow-hidden rounded-2xl border border-[#B8CAD4] bg-[#F4F7F8] lg:grid-cols-[1.05fr_0.95fr]">
          <figure className="relative min-h-[360px] overflow-hidden sm:min-h-[460px]">
            <Image
              src="/owner.jpeg"
              alt="Perwakilan tim KilauBuild mengenakan rompi kerja"
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover object-top"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-[#071A2B]/82 px-5 py-4 text-sm leading-6 text-white/85 backdrop-blur-sm sm:px-7">
              Tim KilauBuild menghubungkan rencana, pengawasan lapangan, dan laporan progres dalam satu alur kerja.
            </figcaption>
          </figure>

          <dl className="flex flex-col justify-center bg-white">
            {projectStages.map((item, index) => (
              <div
                key={item.stage}
                className={`grid gap-3 px-6 py-7 sm:grid-cols-[9rem_1fr] sm:px-8 ${
                  index > 0 ? "border-t border-[#CBD8DF]" : ""
                }`}
              >
                <dt className="text-sm font-bold text-[#005592]">{item.stage}</dt>
                <dd className="text-sm leading-6 text-[#526474]">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
