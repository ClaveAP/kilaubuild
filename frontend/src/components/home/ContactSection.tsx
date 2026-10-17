"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle, EnvelopeSimple, MapPin, PaperPlaneRight, Phone, WarningCircle } from "@phosphor-icons/react";
import { postApiData } from "@/lib/api";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await postApiData<ContactFormData, ContactFormData>("/contacts", formData);
      setSuccess(true);
      setFormData(initialFormData);
    } catch (submitError: unknown) {
      const apiError = submitError as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const message =
        apiError.response?.data?.message ??
        apiError.message ??
        "Pesan belum terkirim. Coba lagi atau hubungi kami melalui WhatsApp.";
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontak" className="scroll-mt-20 lg:scroll-mt-6 border-b border-[#CBD8DF] bg-[#FBFBFA] py-16 sm:py-20 lg:py-24">
      <div className="site-shell grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
        {/* Left Column: Heading & Contact Info Cards */}
        <div className="space-y-6 lg:col-span-5 lg:sticky lg:top-28">
          <div>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#005592]/15 bg-[#005592]/5 px-3.5 py-1 text-xs font-semibold text-[#005592]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#005592]" />
              <span>Kontak &amp; Konsultasi</span>
            </div>
            <h2 className="mt-4 text-[clamp(2.1rem,3.4vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.025em] text-[#092436]">
              Ceritakan proyek Anda. <span className="font-serif italic font-normal text-[#005592]">Mari wujudkan.</span>
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#526474]">
              Kirimkan detail kebutuhan melalui formulir, hubungi kami via WhatsApp, atau jadwalkan kunjungan langsung ke workshop KilauBuild di Citayam, Depok.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href="https://maps.google.com/?q=Jl.+Raya+Citayam+No.34+Depok"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-[#E2ECF2] bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#005592]/30"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF4FA] text-[#005592]">
                <MapPin size={20} weight="bold" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#005592]">Workshop &amp; Kantor</p>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[#092436]">
                  Jl. Raya Citayam No.34, RT.01/RW.04, Pd. Jaya, Cipayung, Kota Depok, Jawa Barat 16444
                </p>
              </div>
            </a>

            <a
              href="https://wa.me/6287776360795"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-[#E2ECF2] bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#005592]/30"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF4FA] text-[#005592]">
                  <Phone size={20} weight="bold" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#005592]">WhatsApp Langsung</p>
                  <p className="mt-0.5 font-numeric text-sm font-bold text-[#092436]">+62 877-7636-0795</p>
                </div>
              </div>
              <ArrowUpRight size={16} weight="bold" className="text-[#526474] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[#005592]" />
            </a>

            <a
              href="mailto:kilaubuild@gmail.com"
              className="group flex items-center justify-between rounded-2xl border border-[#E2ECF2] bg-white p-5 shadow-xs transition-all duration-300 hover:border-[#005592]/30"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EBF4FA] text-[#005592]">
                  <EnvelopeSimple size={20} weight="bold" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#005592]">Email Resmi</p>
                  <p className="mt-0.5 text-sm font-bold text-[#092436]">kilaubuild@gmail.com</p>
                </div>
              </div>
              <ArrowUpRight size={16} weight="bold" className="text-[#526474] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-[#005592]" />
            </a>
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="rounded-[2rem] border border-[#E2ECF2] bg-white p-6 sm:p-9 shadow-[0_12px_36px_-16px_rgba(0,68,117,0.08)] lg:col-span-7">
          {success ? (
            <div className="flex min-h-[460px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EBF4FA] text-[#005592]">
                <CheckCircle size={36} weight="fill" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl font-bold tracking-tight text-[#092436]">Pesan sudah terkirim.</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#526474]">
                Terima kasih. Tim KilauBuild akan menggunakan rincian yang Anda kirim untuk menindaklanjuti kebutuhan proyek Anda secepatnya.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-[#CBD8DF] bg-white px-6 text-xs font-bold text-[#092436] transition-all hover:bg-[#F8FBFD]"
              >
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-[#CBD8DF]/60 pb-5">
                <h3 className="text-2xl font-bold tracking-tight text-[#092436]">Formulir Konsultasi Proyek</h3>
                <p className="mt-1 text-xs sm:text-sm text-[#526474]">Isi informasi dasar di bawah ini agar tim arsitek dan teknis kami dapat menyiapkan rekomendasi yang tepat.</p>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  <WarningCircle size={20} weight="bold" className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Nama lengkap <span className="text-[#005592]">*</span></label>
                  <input id="contact-name" type="text" autoComplete="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required className="form-field rounded-xl" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Alamat email <span className="text-[#005592]">*</span></label>
                  <input id="contact-email" type="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required className="form-field rounded-xl" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Nomor WhatsApp</label>
                  <input id="contact-phone" type="tel" autoComplete="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className="form-field rounded-xl" />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Subjek</label>
                  <input id="contact-subject" type="text" value={formData.subject} onChange={(event) => setFormData({ ...formData, subject: event.target.value })} className="form-field rounded-xl" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-xs sm:text-sm font-semibold text-slate-800">Kebutuhan proyek <span className="text-[#005592]">*</span></label>
                <textarea id="contact-message" rows={4} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required className="form-field rounded-xl min-h-32 resize-y" placeholder="Ceritakan tipe proyek (bangun baru, renovasi, interior), perkiraan luas, dan lokasi bangunan..." />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex min-h-12 w-full items-center justify-between rounded-full bg-[#005592] py-2 pl-6 pr-2 text-xs font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] disabled:bg-[#80909A] active:scale-[0.98]"
                >
                  <span>{loading ? "Mengirim pesan..." : "Kirim Pesan Konsultasi"}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                    <PaperPlaneRight size={14} weight="bold" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
