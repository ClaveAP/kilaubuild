"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { postApiData } from "@/lib/api";

interface LoginResponseData {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await postApiData<LoginResponseData, { email: string; password: string }>("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.accessToken) {
        localStorage.setItem("kilaubuild_token", response.accessToken);
        localStorage.setItem("kilaubuild_user", JSON.stringify(response.user));
        router.push("/admin/dashboard");
      }
    } catch (loginError: unknown) {
      const apiError = loginError as {
        response?: { data?: { message?: string | string[] } };
        message?: string;
      };
      const message =
        apiError.response?.data?.message ??
        apiError.message ??
        "Login gagal. Periksa kembali email dan password Anda.";
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[#F4F7F8] lg:grid-cols-12">
      {/* Left Column: Architectural Bento Hero Panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#004475] text-white lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:col-span-5 xl:p-14">
        {/* Authentic Background Architectural Image & Overlays */}
        <Image
          src="/bangun dari 0.png"
          alt="KilauBuild Proyek Konstruksi & Arsitektur"
          fill
          priority
          sizes="50vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-[#004475]/85 to-[#004475]/60" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />

        {/* Top: Brand Identity Header */}
        <div className="relative z-10">
          <Link href="/" className="group inline-flex items-center gap-3 rounded-2xl transition-all">
            <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white shadow-md ring-2 ring-white/20 transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="KilauBuild Logo" fill sizes="44px" className="object-contain p-1.5" />
            </span>
            <div>
              <span className="block font-heading text-xl font-extrabold tracking-[-0.03em] text-white">KilauBuild</span>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#8EC7E9]">CMS Internal</span>
            </div>
          </Link>
        </div>

        {/* Center: Editorial Heading & Bento Trust Cards */}
        <div className="relative z-10 my-auto py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-[#E1F0FA] backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-[#66B2E0]" aria-hidden="true" />
            <span>Area Khusus Tim Internal</span>
          </div>

          <h1 className="mt-5 font-heading text-3xl font-extrabold leading-tight tracking-[-0.035em] text-white xl:text-4xl">
            Kelola jadwal, pesan, dan progres proyek dari satu tempat.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-[#D1E4EF]/90 xl:text-base">
            Portal operasional terpadu untuk memverifikasi dokumen lapangan, memproses booking survey, dan memperbarui portofolio konstruksi KilauBuild.
          </p>

          {/* 3 Bento Micro-Pills */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md transition-colors hover:bg-white/[0.14]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#66B2E0]/20 text-[#66B2E0] ring-1 ring-white/20">
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Validasi BAP Lapangan</p>
                <p className="text-xs text-[#B9D8E9]">Verifikasi dokumentasi termin sebelum klaim disetujui</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md transition-colors hover:bg-white/[0.14]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#66B2E0]/20 text-[#66B2E0] ring-1 ring-white/20">
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Lead & Kontak WhatsApp Terpusat</p>
                <p className="text-xs text-[#B9D8E9]">Sinkronisasi data pesan masuk calon pemilik rumah</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md transition-colors hover:bg-white/[0.14]">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#66B2E0]/20 text-[#66B2E0] ring-1 ring-white/20">
                <CalendarClock className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Akurasi Jadwal Survey</p>
                <p className="text-xs text-[#B9D8E9]">Monitoring ketersediaan tim arsitek & estimator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Internal Footer */}
        <div className="relative z-10 pt-4">
          <p className="text-xs text-white/55">
            © {new Date().getFullYear()} KilauBuild · Sistem Manajemen &amp; Operasional Terpadu
          </p>
        </div>
      </section>

      {/* Right Column: Rounded-[2rem] Login Card */}
      <section className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8 lg:col-span-7 xl:col-span-7">
        <div className="w-full max-w-md">
          {/* Mobile Top Brand Header */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-[#CBD8DF]">
                <Image src="/logo.png" alt="KilauBuild Logo" fill sizes="40px" className="object-contain p-1" />
              </span>
              <span className="font-heading text-lg font-extrabold text-[#004475]">KilauBuild</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#CBD8DF] bg-white px-3 py-1.5 text-xs font-semibold text-[#526474] transition-colors hover:bg-[#EAF3F8] hover:text-[#005592]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Beranda</span>
            </Link>
          </div>

          {/* Login Form Card */}
          <div className="rounded-[2rem] border border-[#CBD8DF] bg-white p-7 shadow-[0_24px_70px_-32px_rgba(0,68,117,0.18)] sm:p-10">
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-[#EAF3F8] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#005592]">
                <span>Autentikasi Aman</span>
              </div>
              <h2 className="mt-3 font-heading text-2xl font-extrabold tracking-[-0.035em] text-[#0A1E2F] sm:text-3xl">
                Masuk ke CMS
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#526474]">
                Gunakan akun admin resmi untuk mengakses dan mengelola sistem.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700"
              >
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} aria-busy={loading} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#41596B]">
                  Email Admin
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-[#71818D]">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="admin-email"
                    type="email"
                    autoComplete="username"
                    placeholder="admin@kilaubuild.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    className="form-field !pl-12 !pr-4 focus:border-[#005592] focus:ring-3 focus:ring-[#66B2E0]/25"
                  />
                </div>
              </div>

              {/* Password Field with Show/Hide Toggle */}
              <div>
                <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#41596B]">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-[#71818D]">
                    <Lock className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="form-field !pl-12 !pr-12 focus:border-[#005592] focus:ring-3 focus:ring-[#66B2E0]/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#71818D] transition-colors hover:bg-[#EAF3F8] hover:text-[#005592]"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-12 w-full items-center justify-between rounded-full bg-[#005592] py-2 pl-6 pr-2 text-sm font-bold text-white shadow-xs transition-all duration-300 hover:bg-[#0066AE] disabled:bg-[#80909A] active:scale-[0.98]"
              >
                <span>{loading ? "Memverifikasi Kredensial..." : "Masuk ke Dashboard CMS"}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </button>
            </form>
          </div>

          {/* Back Link */}
          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-[#CBD8DF] bg-white px-5 py-2.5 text-xs font-bold text-[#526474] transition-colors hover:bg-[#EAF3F8] hover:text-[#005592]"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Kembali ke Beranda Publik</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
