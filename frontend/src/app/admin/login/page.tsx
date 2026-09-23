"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postApiData } from "@/lib/api";
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";

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
  const [email, setEmail] = useState("admin@kilaubuild.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await postApiData<LoginResponseData, { email: string; password: string }>("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.accessToken) {
        localStorage.setItem("kilaubuild_token", response.accessToken);
        localStorage.setItem(
          "kilaubuild_user",
          JSON.stringify(response.user),
        );
        router.push("/admin/dashboard");
      }
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
        "Login gagal. Periksa kembali email dan password Anda.";
      setError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Visual Column */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-[#004475] flex-col justify-between p-12 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <Image
            src="/bgadminlogin.jpg"
            alt="KilauBuild Construction"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-10 h-10 bg-white rounded-lg p-1">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">
              KilauBuild
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-[#66B2E0]" />
            <span>Sistem CMS Terproteksi</span>
          </div>
          <h2 className="text-3xl font-bold leading-tight">
            Portal Manajemen Konten & Jadwal Survey
          </h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            Kelola data portofolio, konfirmasi jadwal survey lapangan calon klien, dan pantau pesan masuk dari satu dashboard terpadu.
          </p>
        </div>

        <div className="relative z-10 text-xs text-gray-400">
          © {new Date().getFullYear()} KilauBuild Internal System.
        </div>
      </div>

      {/* Right Login Form Column */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="relative w-8 h-8">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold text-[#005592]">KilauBuild</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Masuk ke CMS Admin
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Gunakan email dan password terdaftar Anda untuk mengakses panel admin.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Admin
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kilaubuild.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005592] text-gray-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#005592] text-gray-900"
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Kredensial awal: <code>admin@kilaubuild.com</code> / <code>Password123!</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#005592] hover:bg-[#0066AE] disabled:bg-gray-400 text-white font-bold text-sm py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              <span>{loading ? "Memverifikasi..." : "Masuk ke Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 text-center">
            <Link
              href="/"
              className="text-xs font-medium text-gray-500 hover:text-[#005592] transition-colors"
            >
              ← Kembali ke Beranda Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
