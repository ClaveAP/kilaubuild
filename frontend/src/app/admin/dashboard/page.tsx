"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api, { getApiData } from "@/lib/api";
import {
  Calendar,
  Layers,
  Activity,
  MessageSquare,
  LogOut,
  CheckCircle2,
  Clock,
  Phone,
  Check,
  RefreshCw,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface DashboardMetrics {
  totalProjectsDone: number;
  totalOngoingProjects: number;
  totalBookings: number;
  pendingBookings: number;
  totalContacts: number;
  unreadContacts: number;
}

interface RecentBooking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceType: string;
  location: string;
  bookingDate: string;
  timeSlot: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: string;
}

interface RecentContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface DashboardOverviewData {
  metrics: DashboardMetrics;
  recentBookings: RecentBooking[];
  recentContacts: RecentContact[];
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user] = useState<AdminUser | null>(() => {
    if (typeof window === "undefined") return null;

    const storedUser = localStorage.getItem("kilaubuild_user");
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as AdminUser;
    } catch (err: unknown) {
      console.error("Gagal parse user session:", err);
      return null;
    }
  });
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const response = await getApiData<DashboardOverviewData>("/dashboard/overview");
      setData(response);
    } catch (err: unknown) {
      console.warn("Gagal memuat overview dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("kilaubuild_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    const dashboardTimer = window.setTimeout(() => {
      void fetchDashboard();
    }, 0);

    return () => window.clearTimeout(dashboardTimer);
  }, [router]);

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: string,
  ) => {
    setUpdatingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      await fetchDashboard();
    } catch (err: unknown) {
      console.warn("Gagal mengubah status booking:", err);
      alert("Gagal mengubah status booking");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkContactAsRead = async (contactId: string) => {
    try {
      await api.patch(`/contacts/${contactId}/read`);
      await fetchDashboard();
    } catch (err: unknown) {
      console.warn("Gagal menandai pesan:", err);
      alert("Gagal menandai pesan");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kilaubuild_token");
    localStorage.removeItem("kilaubuild_user");
    router.push("/admin/login");
  };

  const metrics: DashboardMetrics = data?.metrics || {
    totalProjectsDone: 0,
    totalOngoingProjects: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalContacts: 0,
    unreadContacts: 0,
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="relative w-8 h-8">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                </div>
                <span className="text-xl font-bold text-[#005592]">
                  KilauBuild
                </span>
              </Link>
              <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                CMS Panel
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-gray-900">
                  {user?.name || "Admin KilauBuild"}
                </div>
                <div className="text-[11px] text-gray-500">{user?.email}</div>
              </div>

              <button
                onClick={fetchDashboard}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Ringkasan Operasional & Konten
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Data terintegrasi secara real-time dengan database Neon PostgreSQL.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:3000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005592] bg-[#EBF4FA] hover:bg-[#d8eaf7] px-3.5 py-2 rounded-lg transition-colors"
            >
              <span>Buka Swagger API Docs →</span>
            </a>
          </div>
        </div>

        {/* 4 Primary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Booking Survey
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {metrics.totalBookings}
              </div>
              <div className="text-xs text-amber-600 font-semibold mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{metrics.pendingBookings} Menunggu Konfirmasi</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pesan Masuk Inbox
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {metrics.totalContacts}
              </div>
              <div className="text-xs text-[#005592] font-semibold mt-1">
                {metrics.unreadContacts} Belum Dibaca
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#EBF4FA] text-[#005592] flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Proyek Selesai
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {metrics.totalProjectsDone}
              </div>
              <div className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Portofolio Aktif</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Proyek Berjalan
              </div>
              <div className="text-3xl font-extrabold text-slate-900 mt-2 tabular-nums">
                {metrics.totalOngoingProjects}
              </div>
              <div className="text-xs text-blue-600 font-semibold mt-1">
                Konstruksi Aktif Lapangan
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Section 1: Recent Bookings Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Pengajuan Booking Survey Terbaru
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Jadwal survey lokasi yang diajukan oleh calon klien melalui website.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">Anti Double-Booking Aktif</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Nama Klien</th>
                  <th className="py-3.5 px-6">Layanan & Lokasi</th>
                  <th className="py-3.5 px-6">Jadwal Survey</th>
                  <th className="py-3.5 px-6">Kontak WA</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Aksi Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!data?.recentBookings || data.recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400 text-xs">
                      Belum ada data pengajuan survey.
                    </td>
                  </tr>
                ) : (
                  data.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {b.clientName}
                        <div className="text-xs text-gray-400 font-normal">{b.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-800">{b.serviceType}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{b.location}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[#005592] tabular-nums">
                          {new Date(b.bookingDate).toISOString().split("T")[0]}
                        </div>
                        <div className="text-xs text-gray-500">{b.timeSlot}</div>
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={`https://wa.me/${b.phone.replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#005592] hover:text-[#0066AE] bg-[#EBF4FA] px-2.5 py-1 rounded-md transition-colors"
                        >
                          <Phone className="w-3 h-3 text-[#25D366]" />
                          <span>{b.phone}</span>
                        </a>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-100 text-emerald-800"
                              : b.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : b.status === "COMPLETED"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select
                          disabled={updatingId === b.id}
                          value={b.status}
                          onChange={(e) =>
                            handleUpdateBookingStatus(b.id, e.target.value)
                          }
                          className="text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#005592] transition-colors"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Recent Contact Messages Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Pesan Masuk Terkini (Kontak & Feedback)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Pertanyaan dan konsultasi dari form website publik.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-slate-50 text-xs font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6">Pengirim</th>
                  <th className="py-3.5 px-6">Subjek & Pesan</th>
                  <th className="py-3.5 px-6">Waktu Masuk</th>
                  <th className="py-3.5 px-6">Status Baca</th>
                  <th className="py-3.5 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!data?.recentContacts || data.recentContacts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-400 text-xs">
                      Belum ada pesan masuk di inbox.
                    </td>
                  </tr>
                ) : (
                  data.recentContacts.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        {c.name}
                        <div className="text-xs text-gray-400 font-normal">{c.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-gray-800">
                          {c.subject || "Pesan Umum"}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1 max-w-md">
                          {c.message}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-xs text-gray-500 tabular-nums">
                        {new Date(c.createdAt).toLocaleDateString("id-ID")}
                      </td>
                      <td className="py-4 px-6">
                        {c.isRead ? (
                          <span className="text-xs text-gray-400 font-medium">Sudah Dibaca</span>
                        ) : (
                          <span className="text-xs text-[#005592] font-bold bg-[#EBF4FA] px-2.5 py-0.5 rounded-full">
                            Baru
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!c.isRead && (
                          <button
                            onClick={() => handleMarkContactAsRead(c.id)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#005592] hover:underline"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Tandai Dibaca</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
