"use client";

import React, { useState } from "react";
import Image from "next/image";
import { postApiData } from "@/lib/api";
import { ArrowUpRight, Star, CheckCircle2, AlertCircle, Phone } from "lucide-react";

interface BookingSuccessResponse {
  booking: { clientName: string };
  whatsappUrl: string;
}

export const HeroSection: React.FC = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    phone: "",
    email: "",
    serviceType: "Bangun Rumah Baru",
    location: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const nextBusinessDay = new Date();
      nextBusinessDay.setDate(nextBusinessDay.getDate() + 1);
      while (nextBusinessDay.getDay() === 0 || nextBusinessDay.getDay() === 6) {
        nextBusinessDay.setDate(nextBusinessDay.getDate() + 1);
      }
      const dateStr = nextBusinessDay.toISOString().split("T")[0];

      const payload = {
        ...formData,
        bookingDate: dateStr,
        timeSlot: "09:00",
      };

      const response = await postApiData<BookingSuccessResponse, typeof payload>(
        "/bookings",
        payload,
      );

      setSuccessUrl(response.whatsappUrl);
    } catch (err: unknown) {
      interface ErrorResponse {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      }
      const apiErr = err as ErrorResponse;
      const msg =
        apiErr?.response?.data?.message ||
        apiErr?.message ||
        "Gagal memproses booking. Coba lagi atau hubungi via WhatsApp.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="hero" className="w-full scroll-mt-24 pb-10 pt-[88px] sm:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Framed Hero Card Container (Like RooFix Reference) */}
        <div className="relative flex min-h-[580px] flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-[0_28px_80px_-42px_rgba(15,23,42,0.75)] sm:min-h-[600px] sm:p-10 lg:min-h-[620px] lg:p-14">
          {/* Background Construction Image with Moody Vignette */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/bangun dari 0.png"
              alt="KilauBuild Pekerjaan Konstruksi & Atap"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
              className="object-cover object-center scale-105"
            />
            {/* Cinematic Gradient Overlays: Deep blue-black vignette on left, clear sight on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/20" />
          </div>

          {/* Top content area inside card */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center flex-1">
            {/* Left Content Column */}
            <div className="lg:col-span-7 text-white space-y-6 pt-4">
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white leading-[1.08] tracking-tight">
                Bangun Dulu, <br />
                <span className="italic font-serif text-white/95">Baru Bayar.</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-200/90 max-w-lg font-light leading-relaxed">
                Jasa kontraktor bangun rumah baru dari 0, renovasi total, dan desain interior bergaransi resmi di Jabodetabek. Pembayaran termin aman berbasis verifikasi progres fisik nyata.
              </p>

              {/* Bottom Actions on Left Column (RooFix Style) */}
              <div className="pt-4 flex flex-wrap items-center gap-5">
                {/* Pill Button with Brand Blue Arrow */}
                <a
                  href="https://wa.me/6287776360795"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-white text-slate-900 font-semibold text-xs sm:text-sm pl-5 pr-2 py-2 rounded-full shadow-xl hover:bg-slate-100 transition-all duration-200"
                >
                  <span>Hubungi Kami</span>
                  <div className="w-7 h-7 rounded-full bg-[#005592] group-hover:scale-105 flex items-center justify-center text-white transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </a>

                {/* Social Proof Star Rating + Avatars (Like RooFix) */}
                <div className="flex items-center gap-3 bg-slate-950/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  {/* Overlapping Avatar Stack */}
                  <div className="flex -space-x-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-full bg-[#005592] border-2 border-slate-900 overflow-hidden relative">
                      <Image src="/owner.jpeg" alt="Client 1" fill sizes="28px" className="object-cover" />
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                      KB
                    </div>
                    <div className="w-7 h-7 rounded-full bg-amber-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white">
                      ★
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-bold text-white ml-1">5.0</span>
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium">150+ Proyek Selesai</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Lead Capture Card (Like RooFix Right Form) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-2xl max-w-md w-full text-slate-900 border border-slate-100">
                <div className="text-center mb-5">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Survey & RAB Gratis!
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Estimasi biaya transparan tanpa komitmen paksaan.
                  </p>
                </div>

                {successUrl ? (
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">
                      Permintaan Diterima!
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Klik tombol di bawah untuk langsung terhubung dengan WhatsApp Estimator kami:
                    </p>
                    <a
                      href={successUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold py-3 rounded-2xl shadow transition-all"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Chat WhatsApp Sekarang</span>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleQuickBooking} className="space-y-3">
                    {error && (
                      <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div>
                      <input
                        type="text"
                        placeholder="Nama Lengkap Anda"
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({ ...formData, clientName: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005592] bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <input
                        type="tel"
                        placeholder="No. WhatsApp"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005592] bg-slate-50/50"
                      />
                      <input
                        type="email"
                        placeholder="Alamat Email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005592] bg-slate-50/50"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <select
                        value={formData.serviceType}
                        onChange={(e) =>
                          setFormData({ ...formData, serviceType: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#005592] bg-slate-50/50"
                      >
                        <option value="Bangun Rumah Baru">Bangun Rumah</option>
                        <option value="Renovasi Total">Renovasi</option>
                        <option value="Desain Interior">Interior & Mebel</option>
                        <option value="Gambar Kerja & RAB">Gambar & RAB</option>
                      </select>

                      <input
                        type="text"
                        placeholder="Lokasi (e.g. Depok)"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005592] bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        placeholder="Catatan proyek (opsional)..."
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({ ...formData, notes: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005592] bg-slate-50/50"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#005592] hover:bg-[#0066AE] text-white font-bold py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
                    >
                      <span>{submitting ? "Memproses..." : "Dapatkan Survey Gratis Sekarang"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
