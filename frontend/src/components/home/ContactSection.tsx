"use client";

import React, { useState } from "react";
import { postApiData } from "@/lib/api";
import { Send, MapPin, Phone, Mail, CheckCircle2, AlertCircle } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await postApiData<ContactFormData, ContactFormData>("/contacts", formData);
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: unknown) {
      interface ErrorResponse {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
        message?: string;
      }
      const apiErr = err as ErrorResponse;
      const msg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Gagal mengirimkan pesan. Silakan coba kembali.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="kontak" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Office & Map Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF4FA] text-[#005592] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#66B2E0]/30">
              Hubungi Kami Langsung
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
              Kunjungi Kantor & Workshop <span className="text-[#005592]">KilauBuild</span>
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Punya pertanyaan seputar estimasi biaya atau ingin berdiskusi langsung dengan tim arsitek kami? Hubungi kami atau kunjungi workshop kami di Depok.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EBF4FA] text-[#005592] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Alamat Workshop</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Jl. Raya Citayam No.34, RT.01/RW.04, Pd. Jaya, Kec. Cipayung, Kota Depok, Jawa Barat 16444
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EBF4FA] text-[#005592] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Telepon & WhatsApp</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    +62 877-7636-0795 (Respon Cepat)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#EBF4FA] text-[#005592] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Email Resmi</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    kilaubuild@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-10 border border-slate-200/80 shadow-lg shadow-slate-900/5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Kirimkan Pesan atau Pertanyaan
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Tim customer support kami akan membalas pesan Anda dalam kurun waktu 1x24 jam kerja.
            </p>

            {success ? (
              <div className="p-6 rounded-2xl bg-[#EBF4FA] text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#005592] mx-auto" />
                <h4 className="text-lg font-bold text-[#005592]">Pesan Anda Berhasil Terkirim!</h4>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  Terima kasih telah menghubungi KilauBuild. Tim kami akan segera menindaklanjuti pesan Anda.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-2 text-xs font-semibold text-[#005592] underline"
                >
                  Kirim Pesan Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hendra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005592]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Aktif *
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. hendra@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005592]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Nomor Telepon / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 081234567890"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005592]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Subjek
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Pertanyaan Renovasi Ruko"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005592]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Isi Pesan *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tuliskan pertanyaan atau kebutuhan renovasi Anda di sini..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005592]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-[#005592] hover:bg-[#0066AE] disabled:bg-gray-400 text-white font-semibold text-sm py-3 rounded-xl shadow transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? "Mengirimkan Pesan..." : "Kirim Pesan Sekarang"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
