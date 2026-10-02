"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
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
    <main className="grid min-h-screen bg-white lg:grid-cols-12">
      <section className="relative hidden min-h-screen overflow-hidden bg-[#004475] text-white lg:col-span-5 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image src="/bgadminlogin.jpg" alt="" fill sizes="42vw" preload className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A2B] via-[#004475]/75 to-[#004475]/35" />

        <Link href="/" className="relative z-10 inline-flex w-fit items-center gap-3 rounded-lg">
          <span className="relative h-11 w-11 overflow-hidden rounded-xl bg-white">
            <Image src="/logo.png" alt="" fill sizes="44px" className="object-contain" />
          </span>
          <span className="text-xl font-extrabold tracking-[-0.03em]">KilauBuild</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#B9D8E9]">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Area internal KilauBuild
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-[-0.04em] text-white">
            Kelola jadwal, pesan, dan progres proyek dari satu tempat.
          </h1>
          <p className="mt-5 text-sm leading-7 text-[#D1E4EF]">
            Portal ini digunakan tim KilauBuild untuk menindaklanjuti calon klien dan memperbarui konten situs publik.
          </p>
        </div>

        <p className="relative z-10 text-xs text-white/55">© {new Date().getFullYear()} KilauBuild · Sistem internal</p>
      </section>

      <section className="flex items-center justify-center bg-[#F4F7F8] px-5 py-10 sm:px-10 lg:col-span-7">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 inline-flex items-center gap-3 rounded-lg lg:hidden">
            <span className="relative h-10 w-10 overflow-hidden rounded-xl bg-white">
              <Image src="/logo.png" alt="" fill sizes="40px" className="object-contain" />
            </span>
            <span className="text-lg font-extrabold text-[#004475]">KilauBuild</span>
          </Link>

          <div className="rounded-2xl border border-[#B8CAD4] bg-white p-6 shadow-[0_24px_70px_-48px_rgba(0,68,117,0.65)] sm:p-9">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#0A1E2F]">Masuk ke CMS</h2>
            <p className="mt-2 text-sm leading-6 text-[#526474]">Gunakan akun admin yang terdaftar.</p>

            {error && (
              <div role="alert" className="mt-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} aria-busy={loading} className="mt-7 space-y-5">
              <div>
                <label htmlFor="admin-email" className="mb-1.5 block text-sm font-bold text-[#294153]">Email admin</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71818D]" aria-hidden="true" />
                  <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required className="form-field pl-10" />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-1.5 block text-sm font-bold text-[#294153]">Password</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#71818D]" aria-hidden="true" />
                  <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required className="form-field pl-10" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="button-primary w-full disabled:bg-[#80909A]">
                {loading ? "Memverifikasi..." : "Masuk ke dashboard"}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>

          <Link href="/" className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-[#526474] transition-colors hover:text-[#005592]">
            Kembali ke situs publik
          </Link>
        </div>
      </section>
    </main>
  );
}
