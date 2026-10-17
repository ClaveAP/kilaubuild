"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertCircle,
  Calendar,
  Check,
  CheckCheck,
  ChevronDown,
  ExternalLink,
  Globe,
  Inbox,
  Layers3,
  LogOut,
  MessageSquare,
  Phone,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import api, { API_BASE_URL, getApiData } from "@/lib/api";

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

interface MetricDefinition {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  dotColor: string;
}

const emptyMetrics: DashboardMetrics = {
  totalProjectsDone: 0,
  totalOngoingProjects: 0,
  totalBookings: 0,
  pendingBookings: 0,
  totalContacts: 0,
  unreadContacts: 0,
};

const bookingStatusLabel: Record<RecentBooking["status"], string> = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const bookingStatusPillStyle: Record<RecentBooking["status"], string> = {
  PENDING: "bg-amber-50 text-amber-800 border border-amber-200/80",
  CONFIRMED: "bg-emerald-50 text-emerald-800 border border-emerald-200/80",
  COMPLETED: "bg-blue-50 text-blue-800 border border-blue-200/80",
  CANCELLED: "bg-red-50 text-red-800 border border-red-200/80",
};

const bookingStatusDotStyle: Record<RecentBooking["status"], string> = {
  PENDING: "bg-amber-500",
  CONFIRMED: "bg-emerald-500",
  COMPLETED: "bg-blue-600",
  CANCELLED: "bg-red-500",
};

const formatDate = (value: string): string => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const getInitials = (name?: string): string => {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatRole = (role?: string): string => {
  if (!role) return "Super Admin";
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiDocsUrl = useMemo(
    () => API_BASE_URL.replace(/\/api\/v1\/?$/, "/api/docs"),
    [],
  );

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await getApiData<DashboardOverviewData>("/dashboard/overview");
      setData(response);
    } catch (error: unknown) {
      console.warn("Gagal memuat overview dashboard:", error);
      setErrorMessage("Data dashboard belum dapat dimuat. Periksa koneksi lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("kilaubuild_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const dashboardTimer = window.setTimeout(() => {
      const storedUser = localStorage.getItem("kilaubuild_user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser) as AdminUser);
        } catch (error: unknown) {
          console.warn("Data sesi admin tidak dapat dibaca:", error);
        }
      }

      void fetchDashboard();
    }, 0);

    return () => window.clearTimeout(dashboardTimer);
  }, [fetchDashboard, router]);

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: RecentBooking["status"],
  ) => {
    setUpdatingId(bookingId);
    setErrorMessage(null);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      await fetchDashboard();
    } catch (error: unknown) {
      console.warn("Gagal mengubah status booking:", error);
      setErrorMessage("Status booking belum berubah. Coba lagi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkContactAsRead = async (contactId: string) => {
    setUpdatingId(contactId);
    setErrorMessage(null);
    try {
      await api.patch(`/contacts/${contactId}/read`);
      await fetchDashboard();
    } catch (error: unknown) {
      console.warn("Gagal menandai pesan:", error);
      setErrorMessage("Pesan belum dapat ditandai sebagai dibaca. Coba lagi.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kilaubuild_token");
    localStorage.removeItem("kilaubuild_user");
    router.replace("/admin/login");
  };

  const metrics = data?.metrics ?? emptyMetrics;
  const metricDefinitions: MetricDefinition[] = [
    {
      label: "Booking Survey",
      value: metrics.totalBookings,
      note: `${metrics.pendingBookings} menunggu konfirmasi`,
      icon: Calendar,
      iconBg: "bg-amber-50 border border-amber-200/80",
      iconColor: "text-amber-700",
      dotColor: "bg-amber-500",
    },
    {
      label: "Pesan Masuk",
      value: metrics.totalContacts,
      note: `${metrics.unreadContacts} belum dibaca`,
      icon: MessageSquare,
      iconBg: "bg-[#EAF3F8] border border-[#005592]/20",
      iconColor: "text-[#005592]",
      dotColor: "bg-[#005592]",
    },
    {
      label: "Proyek Selesai",
      value: metrics.totalProjectsDone,
      note: "Tampil di portofolio",
      icon: Layers3,
      iconBg: "bg-emerald-50 border border-emerald-200/80",
      iconColor: "text-emerald-700",
      dotColor: "bg-emerald-500",
    },
    {
      label: "Proyek Berjalan",
      value: metrics.totalOngoingProjects,
      note: "Aktif di lapangan",
      icon: Activity,
      iconBg: "bg-blue-50 border border-blue-200/80",
      iconColor: "text-blue-700",
      dotColor: "bg-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F8] text-[#0A1E2F]">
      {/* Sticky Architectural Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#CBD8DF] bg-white/95 backdrop-blur-md">
        <div className="site-shell flex h-[72px] items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="group flex min-h-11 items-center gap-2.5 rounded-xl transition-transform hover:opacity-95"
              aria-label="Buka situs publik KilauBuild"
            >
              <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-2xs ring-1 ring-[#CBD8DF]">
                <Image
                  src="/logo.png"
                  alt="KilauBuild Logo"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </span>
              <span className="font-heading text-lg font-extrabold tracking-[-0.03em] text-[#004475]">
                KilauBuild
              </span>
            </Link>
            <span className="rounded-full border border-[#CBD8DF] bg-[#EAF3F8] px-2.5 py-0.5 text-[11px] font-extrabold tracking-wide text-[#005592]">
              CMS Admin
            </span>
          </div>

          {/* Profile & Tactile Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 rounded-2xl border border-[#CBD8DF] bg-[#F8FAFB] p-1.5 shadow-2xs sm:px-3 sm:py-1.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#CBD8DF] bg-[#EAF3F8] font-heading text-xs font-bold text-[#005592]">
                {getInitials(user?.name)}
              </div>
              <div className="hidden text-left sm:block">
                <p className="max-w-[130px] truncate text-xs font-extrabold text-[#0A1E2F] md:max-w-[170px]">
                  {user?.name || "Admin KilauBuild"}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <span className="inline-block rounded-md bg-[#005592]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#005592]">
                    {formatRole(user?.role)}
                  </span>
                  <span className="hidden text-[11px] text-[#71818D] md:inline">
                    {user?.email}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void fetchDashboard()}
              disabled={loading}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#CBD8DF] bg-white text-[#526474] shadow-2xs transition-all hover:border-[#005592]/40 hover:bg-[#EAF3F8] hover:text-[#005592] active:scale-95 disabled:opacity-50"
              aria-label="Muat ulang data dashboard"
              title="Muat ulang data"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin text-[#005592]" : ""}`}
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50/80 px-3.5 text-xs font-bold text-red-700 shadow-2xs transition-all hover:border-red-300 hover:bg-red-100 active:scale-95"
              aria-label="Keluar dari sesi admin"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="site-shell py-8 sm:py-10" aria-busy={loading}>
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#CBD8DF] bg-white px-3 py-1 text-xs font-semibold text-[#526474] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sistem Operasional Real-time</span>
            </div>
            <h1 className="mt-2.5 font-heading text-3xl font-extrabold tracking-[-0.035em] text-[#0A1E2F] sm:text-4xl">
              Ringkasan Operasional
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-[#526474]">
              Pantau reservasi survey lapangan, pesan masuk klien, dan status proyek aktif KilauBuild.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={apiDocsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#CBD8DF] bg-white px-4 py-2 text-xs font-bold text-[#294153] shadow-2xs transition-all hover:border-[#005592]/40 hover:bg-[#EAF3F8] hover:text-[#005592] active:scale-95"
            >
              <span>Buka Dokumentasi API</span>
              <ExternalLink className="h-3.5 w-3.5 text-[#526474]" aria-hidden="true" />
            </a>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#005592] px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#0066AE] active:scale-95"
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Buka Situs Publik</span>
            </Link>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            role="alert"
            className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-red-200 bg-red-50/90 p-4 text-sm text-red-700 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => void fetchDashboard()}
              className="shrink-0 rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-bold text-red-700 transition-colors hover:bg-red-100"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* 4-Metric Bento Grid */}
        <section aria-label="Metrik dashboard" className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {metricDefinitions.map((metric) => {
              const MetricIcon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="group rounded-2xl border border-[#CBD8DF] bg-white p-6 shadow-xs transition-all duration-200 hover:border-[#005592]/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#526474]">
                      {metric.label}
                    </p>
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${metric.iconBg} ${metric.iconColor}`}
                    >
                      <MetricIcon className="h-5 w-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="mt-4">
                    {loading && !data ? (
                      <div className="h-10 w-24 animate-pulse rounded-lg bg-[#EAF3F8]" />
                    ) : (
                      <p className="font-numeric text-3xl font-extrabold tracking-tight tabular-nums text-[#0A1E2F] sm:text-4xl">
                        {metric.value}
                      </p>
                    )}
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${metric.dotColor}`} aria-hidden="true" />
                      <span className="text-xs font-semibold text-[#526474]">{metric.note}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Booking Survey Section */}
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#CBD8DF] bg-white shadow-xs">
          <div className="flex flex-col gap-3 border-b border-[#CBD8DF] bg-gradient-to-r from-[#EAF3F8]/70 via-white to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#CBD8DF] bg-white text-[#005592] shadow-2xs">
                <Calendar className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-heading text-lg font-bold tracking-tight text-[#0A1E2F] sm:text-xl">
                    Booking Survey Terbaru
                  </h2>
                  <span className="rounded-full border border-[#005592]/20 bg-[#EAF3F8] px-2.5 py-0.5 font-numeric text-xs font-bold tabular-nums text-[#005592]">
                    {data?.recentBookings.length ?? 0}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#526474]">
                  Konfirmasi jadwal survey lapangan dan kelola status reservasi calon klien.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#526474]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>Sinkronisasi otomatis</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-left text-sm">
              <caption className="sr-only">Daftar pengajuan booking survey terbaru</caption>
              <thead className="border-b border-[#CBD8DF] bg-[#F8FAFB] text-xs font-bold uppercase tracking-wider text-[#526474]">
                <tr>
                  <th scope="col" className="px-6 py-4">Klien</th>
                  <th scope="col" className="px-6 py-4">Layanan &amp; Lokasi</th>
                  <th scope="col" className="px-6 py-4">Jadwal</th>
                  <th scope="col" className="px-6 py-4">WhatsApp</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF3F8]">
                {loading && !data ? (
                  [1, 2, 3].map((skeletonIndex) => (
                    <tr key={skeletonIndex} className="animate-pulse">
                      <td className="px-6 py-4.5">
                        <div className="h-4 w-32 rounded bg-[#EAF3F8]" />
                        <div className="mt-2 h-3 w-40 rounded bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-4 w-24 rounded bg-[#EAF3F8]" />
                        <div className="mt-2 h-3 w-36 rounded bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-4 w-28 rounded bg-[#EAF3F8]" />
                        <div className="mt-2 h-3 w-20 rounded bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-9 w-28 rounded-full bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-6 w-24 rounded-full bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="ml-auto h-9 w-28 rounded-xl bg-[#EAF3F8]" />
                      </td>
                    </tr>
                  ))
                ) : !data?.recentBookings.length ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F8] text-[#005592]">
                        <Calendar className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="mt-3 font-heading text-sm font-bold text-[#0A1E2F]">
                        Belum ada pengajuan survey
                      </p>
                      <p className="mt-1 text-xs text-[#526474]">
                        Reservasi survey baru dari calon klien akan otomatis ditampilkan di tabel ini.
                      </p>
                    </td>
                  </tr>
                ) : (
                  data.recentBookings.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-[#F8FAFB]/80">
                      <td className="px-6 py-4.5">
                        <p className="font-heading text-sm font-bold text-[#0A1E2F]">
                          {booking.clientName}
                        </p>
                        <p className="mt-0.5 text-xs text-[#71818D]">{booking.email}</p>
                      </td>
                      <td className="px-6 py-4.5">
                        <span className="inline-block rounded-md bg-[#EAF3F8] px-2 py-0.5 text-xs font-bold text-[#004475]">
                          {booking.serviceType}
                        </span>
                        <span className="mt-1 block max-w-xs truncate text-xs text-[#526474]">
                          {booking.location}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 font-numeric tabular-nums">
                        <p className="font-bold text-[#005592]">{formatDate(booking.bookingDate)}</p>
                        <p className="mt-0.5 text-xs text-[#71818D]">{booking.timeSlot} WIB</p>
                      </td>
                      <td className="px-6 py-4.5">
                        <a
                          href={`https://wa.me/${booking.phone.replace(/\D/g, "").replace(/^0/, "62")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-9 items-center gap-2 rounded-full border border-[#CBD8DF] bg-[#F4F7F8] px-3.5 py-1 text-xs font-bold text-[#005592] shadow-2xs transition-all hover:border-[#005592]/40 hover:bg-[#EAF3F8] hover:text-[#004475] active:scale-95"
                        >
                          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                          <span className="font-numeric tabular-nums">{booking.phone}</span>
                        </a>
                      </td>
                      <td className="px-6 py-4.5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${bookingStatusPillStyle[booking.status]}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${bookingStatusDotStyle[booking.status]}`}
                            aria-hidden="true"
                          />
                          {bookingStatusLabel[booking.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="relative inline-block text-right">
                          <label htmlFor={`booking-status-${booking.id}`} className="sr-only">
                            Status booking {booking.clientName}
                          </label>
                          <select
                            id={`booking-status-${booking.id}`}
                            disabled={updatingId === booking.id}
                            value={booking.status}
                            onChange={(event) =>
                              void handleUpdateBookingStatus(
                                booking.id,
                                event.target.value as RecentBooking["status"],
                              )
                            }
                            className="min-h-9 cursor-pointer appearance-none rounded-xl border border-[#CBD8DF] bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-[#0A1E2F] shadow-2xs transition-colors hover:border-[#9DB3BF] focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#66B2E0]/30 disabled:opacity-50"
                          >
                            <option value="PENDING">Menunggu</option>
                            <option value="CONFIRMED">Dikonfirmasi</option>
                            <option value="COMPLETED">Selesai</option>
                            <option value="CANCELLED">Dibatalkan</option>
                          </select>
                          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#526474]">
                            <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Contacts Section */}
        <section className="mt-8 overflow-hidden rounded-[2rem] border border-[#CBD8DF] bg-white shadow-xs">
          <div className="flex flex-col gap-3 border-b border-[#CBD8DF] bg-gradient-to-r from-[#EAF3F8]/70 via-white to-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#CBD8DF] bg-white text-[#005592] shadow-2xs">
                <MessageSquare className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="font-heading text-lg font-bold tracking-tight text-[#0A1E2F] sm:text-xl">
                    Pesan Masuk Terbaru
                  </h2>
                  <span className="rounded-full border border-[#005592]/20 bg-[#EAF3F8] px-2.5 py-0.5 font-numeric text-xs font-bold tabular-nums text-[#005592]">
                    {data?.recentContacts.length ?? 0}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#526474]">
                  Pertanyaan dan formulir konsultasi yang dikirim melalui situs web publik.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#526474]">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>Formulir kontak publik</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">Daftar pesan kontak terbaru</caption>
              <thead className="border-b border-[#CBD8DF] bg-[#F8FAFB] text-xs font-bold uppercase tracking-wider text-[#526474]">
                <tr>
                  <th scope="col" className="px-6 py-4">Pengirim</th>
                  <th scope="col" className="px-6 py-4">Pesan</th>
                  <th scope="col" className="px-6 py-4">Tanggal</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAF3F8]">
                {loading && !data ? (
                  [1, 2, 3].map((skeletonIndex) => (
                    <tr key={skeletonIndex} className="animate-pulse">
                      <td className="px-6 py-4.5">
                        <div className="h-4 w-32 rounded bg-[#EAF3F8]" />
                        <div className="mt-2 h-3 w-40 rounded bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-4 w-36 rounded bg-[#EAF3F8]" />
                        <div className="mt-2 h-3 w-64 rounded bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-4 w-20 rounded bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="h-6 w-20 rounded-full bg-[#EAF3F8]" />
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        <div className="ml-auto h-9 w-28 rounded-full bg-[#EAF3F8]" />
                      </td>
                    </tr>
                  ))
                ) : !data?.recentContacts.length ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF3F8] text-[#005592]">
                        <Inbox className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <p className="mt-3 font-heading text-sm font-bold text-[#0A1E2F]">
                        Belum ada pesan masuk
                      </p>
                      <p className="mt-1 text-xs text-[#526474]">
                        Pesan konsultasi yang dikirim melalui formulir kontak akan tampil di sini.
                      </p>
                    </td>
                  </tr>
                ) : (
                  data.recentContacts.map((contact) => (
                    <tr key={contact.id} className="transition-colors hover:bg-[#F8FAFB]/80">
                      <td className="px-6 py-4.5">
                        <p className="font-heading text-sm font-bold text-[#0A1E2F]">
                          {contact.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#71818D]">{contact.email}</p>
                        {contact.phone && (
                          <a
                            href={`https://wa.me/${contact.phone.replace(/\D/g, "").replace(/^0/, "62")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-1 inline-flex items-center gap-1 font-numeric text-[11px] font-semibold text-[#005592] hover:underline"
                          >
                            <Phone className="h-3 w-3" aria-hidden="true" />
                            <span>{contact.phone}</span>
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-4.5">
                        <p className="font-semibold text-[#294153]">
                          {contact.subject || "Pesan Umum"}
                        </p>
                        <p className="mt-1 max-w-md text-xs leading-relaxed text-[#526474] line-clamp-2">
                          {contact.message}
                        </p>
                      </td>
                      <td className="px-6 py-4.5 font-numeric text-xs tabular-nums text-[#526474]">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-6 py-4.5">
                        {contact.isRead ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200/80 bg-gray-100 px-2.5 py-1 text-xs font-medium text-[#526474]">
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" aria-hidden="true" />
                            Sudah Dibaca
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#005592]/20 bg-[#EAF3F8] px-2.5 py-1 text-xs font-bold text-[#005592]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#005592] animate-pulse" aria-hidden="true" />
                            Pesan Baru
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4.5 text-right">
                        {!contact.isRead ? (
                          <button
                            type="button"
                            disabled={updatingId === contact.id}
                            onClick={() => void handleMarkContactAsRead(contact.id)}
                            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[#CBD8DF] bg-white px-3.5 py-1 text-xs font-bold text-[#005592] shadow-2xs transition-all hover:border-[#005592]/40 hover:bg-[#EAF3F8] hover:text-[#004475] active:scale-95 disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Tandai Dibaca</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#80909A]">
                            <CheckCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                            <span>Selesai</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
