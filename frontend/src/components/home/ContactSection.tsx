"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
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
    <section id="kontak" className="bg-[#004475] py-20 text-white sm:py-28">
      <div className="site-shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <h2 className="section-heading text-white">Ceritakan proyek Anda.</h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#D1E4EF]">
            Kirim pertanyaan melalui formulir, telepon, atau datang ke workshop KilauBuild di Citayam, Depok.
          </p>

          <address className="mt-10 border-y border-white/20 not-italic">
            <a
              href="https://maps.google.com/?q=Jl.+Raya+Citayam+No.34+Depok"
              target="_blank"
              rel="noopener noreferrer"
              className="grid grid-cols-[2rem_1fr] gap-4 py-5 text-sm leading-6 text-white transition-colors hover:text-[#B9D8E9]"
            >
              <MapPin className="mt-0.5 h-5 w-5 text-[#8CC9EC]" aria-hidden="true" />
              Jl. Raya Citayam No.34, RT.01/RW.04, Pd. Jaya, Cipayung, Kota Depok, Jawa Barat 16444
            </a>
            <a href="https://wa.me/6287776360795" target="_blank" rel="noopener noreferrer" className="grid grid-cols-[2rem_1fr] gap-4 border-t border-white/20 py-5 text-sm font-semibold text-white transition-colors hover:text-[#B9D8E9]">
              <Phone className="h-5 w-5 text-[#8CC9EC]" aria-hidden="true" />
              <span className="font-numeric">+62 877-7636-0795</span>
            </a>
            <a href="mailto:kilaubuild@gmail.com" className="grid grid-cols-[2rem_1fr] gap-4 border-t border-white/20 py-5 text-sm font-semibold text-white transition-colors hover:text-[#B9D8E9]">
              <Mail className="h-5 w-5 text-[#8CC9EC]" aria-hidden="true" />
              kilaubuild@gmail.com
            </a>
          </address>
        </div>

        <div className="rounded-2xl bg-white p-6 text-[#0A1E2F] shadow-[0_28px_80px_-42px_rgba(0,0,0,0.8)] sm:p-9 lg:col-span-7">
          {success ? (
            <div className="flex min-h-[460px] flex-col items-center justify-center text-center" role="status" aria-live="polite">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EAF3F8] text-[#005592]">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl font-bold">Pesan sudah terkirim.</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#526474]">
                Terima kasih. Tim KilauBuild akan menggunakan detail yang Anda kirim untuk menindaklanjuti kebutuhan proyek.
              </p>
              <button type="button" onClick={() => setSuccess(false)} className="button-secondary mt-7">
                Kirim pesan lain
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-[#CBD8DF] pb-5">
                <h3 className="text-2xl font-bold">Ceritakan proyek Anda</h3>
                <p className="mt-2 text-sm leading-6 text-[#526474]">Kolom bertanda wajib diperlukan agar kami dapat menghubungi Anda kembali.</p>
              </div>

              {error && (
                <div role="alert" className="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-1.5 block text-sm font-bold">Nama lengkap <span aria-hidden="true">*</span></label>
                  <input id="contact-name" type="text" autoComplete="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required className="form-field" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-1.5 block text-sm font-bold">Alamat email <span aria-hidden="true">*</span></label>
                  <input id="contact-email" type="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} required className="form-field" />
                </div>
                <div>
                  <label htmlFor="contact-phone" className="mb-1.5 block text-sm font-bold">Nomor WhatsApp</label>
                  <input id="contact-phone" type="tel" autoComplete="tel" value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className="form-field" />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="mb-1.5 block text-sm font-bold">Subjek</label>
                  <input id="contact-subject" type="text" value={formData.subject} onChange={(event) => setFormData({ ...formData, subject: event.target.value })} className="form-field" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="mb-1.5 block text-sm font-bold">Kebutuhan proyek <span aria-hidden="true">*</span></label>
                <textarea id="contact-message" rows={5} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} required className="form-field min-h-36 resize-y" />
              </div>

              <button type="submit" disabled={loading} className="button-primary w-full disabled:bg-[#80909A]">
                <Send className="h-4 w-4" aria-hidden="true" />
                {loading ? "Mengirim pesan..." : "Kirim pesan"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
