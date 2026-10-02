"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  Calendar,
  Check,
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
  tone: string;
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

const bookingStatusStyle: Record<RecentBooking["status"], string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-blue-100 text-blue-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const formatDate = (value: string): string =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

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
      label: "Booking survey",
      value: metrics.totalBookings,
      note: `${metrics.pendingBookings} menunggu konfirmasi`,
      icon: Calendar,
      tone: "text-amber-700 bg-amber-50",
    },
    {
      label: "Pesan masuk",
      value: metrics.totalContacts,
      note: `${metrics.unreadContacts} belum dibaca`,
      icon: MessageSquare,
      tone: "text-[#005592] bg-[#EAF3F8]",
    },
    {
      label: "Proyek selesai",
      value: metrics.totalProjectsDone,
      note: "Tampil di portofolio",
      icon: Layers3,
      tone: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Proyek berjalan",
      value: metrics.totalOngoingProjects,
      note: "Aktif di lapangan",
      icon: Activity,
      tone: "text-blue-700 bg-blue-50",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F8] text-[#0A1E2F]">
      <header className="sticky top-0 z-30 border-b border-[#CBD8DF] bg-white/96 backdrop-blur-md">
        <div className="site-shell flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex min-h-11 items-center gap-2.5 rounded-lg" aria-label="Buka situs publik KilauBuild">
              <span className="relative h-9 w-9 overflow-hidden rounded-lg bg-white">
                <Image src="/logo.png" alt="" fill sizes="36px" className="object-contain" />
              </span>
              <span className="text-lg font-extrabold tracking-[-0.03em] text-[#004475]">KilauBuild</span>
            </Link>
            <span className="hidden rounded-lg bg-[#EAF3F8] px-2.5 py-1 text-xs font-bold text-[#005592] sm:inline-block">CMS</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="mr-1 hidden text-right md:block">
              <p className="text-xs font-bold text-[#0A1E2F]">{user?.name || "Admin KilauBuild"}</p>
              <p className="mt-0.5 text-[11px] text-[#526474]">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={() => void fetchDashboard()}
              disabled={loading}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#005592] transition-colors hover:bg-[#DCECF5] disabled:text-[#80909A]"
              aria-label="Muat ulang data dashboard"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
            </button>
            <button type="button" onClick={handleLogout} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-red-50 px-3 text-sm font-bold text-red-700 transition-colors hover:bg-red-100">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content" className="site-shell py-8 sm:py-10" aria-busy={loading}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#0A1E2F] sm:text-4xl">Ringkasan operasional</h1>
            <p className="mt-2 text-sm leading-6 text-[#526474]">Booking, pesan, dan status proyek dari data terbaru.</p>
          </div>
          <a href={apiDocsUrl} target="_blank" rel="noopener noreferrer" className="button-secondary w-fit">
            Buka dokumentasi API
          </a>
        </div>

        {errorMessage && (
          <div role="alert" className="mt-6 flex items-center justify-between gap-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            <span>{errorMessage}</span>
            <button type="button" onClick={() => void fetchDashboard()} className="shrink-0 font-bold underline underline-offset-4">Coba lagi</button>
          </div>
        )}

        <section aria-label="Metrik dashboard" className="mt-8 overflow-hidden rounded-2xl border border-[#B8CAD4] bg-white">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {metricDefinitions.map((metric, index) => {
              const MetricIcon = metric.icon;
              return (
                <div key={metric.label} className={`min-h-44 p-5 sm:p-6 ${index > 0 ? "border-t border-[#CBD8DF] sm:border-t-0 sm:[&:nth-child(2n)]:border-l lg:border-l" : ""} ${index > 1 ? "sm:border-t lg:border-t-0" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm font-bold text-[#526474]">{metric.label}</p>
                    <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.tone}`}>
                      <MetricIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                  {loading && !data ? (
                    <div className="mt-8 h-10 w-20 animate-pulse rounded-lg bg-[#EAF3F8]" />
                  ) : (
                    <p className="mt-6 text-4xl font-bold tabular-nums tracking-[-0.04em]">{metric.value}</p>
                  )}
                  <p className="mt-2 text-xs font-semibold text-[#526474]">{metric.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#B8CAD4] bg-white">
          <div className="border-b border-[#CBD8DF] px-5 py-5 sm:px-6">
            <h2 className="text-xl font-bold">Booking survey terbaru</h2>
            <p className="mt-1 text-sm text-[#526474]">Konfirmasi jadwal atau perbarui status kunjungan.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <caption className="sr-only">Daftar pengajuan booking survey terbaru</caption>
              <thead className="border-b border-[#CBD8DF] bg-[#F4F7F8] text-xs font-bold text-[#526474]">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Klien</th>
                  <th scope="col" className="px-6 py-3.5">Layanan & lokasi</th>
                  <th scope="col" className="px-6 py-3.5">Jadwal</th>
                  <th scope="col" className="px-6 py-3.5">WhatsApp</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Ubah status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E9ED]">
                {loading && !data ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-[#526474]">Memuat booking...</td></tr>
                ) : !data?.recentBookings.length ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-sm text-[#526474]">Belum ada pengajuan survey.</td></tr>
                ) : (
                  data.recentBookings.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-[#F8FAFB]">
                      <td className="px-6 py-4 font-bold text-[#0A1E2F]">
                        {booking.clientName}
                        <span className="mt-1 block text-xs font-normal text-[#71818D]">{booking.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#294153]">{booking.serviceType}</span>
                        <span className="mt-1 block max-w-xs truncate text-xs text-[#71818D]">{booking.location}</span>
                      </td>
                      <td className="px-6 py-4 tabular-nums">
                        <span className="font-bold text-[#005592]">{formatDate(booking.bookingDate)}</span>
                        <span className="mt-1 block text-xs text-[#71818D]">{booking.timeSlot} WIB</span>
                      </td>
                      <td className="px-6 py-4">
                        <a href={`https://wa.me/${booking.phone.replace(/^0/, "62")}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#EAF3F8] px-3 text-xs font-bold text-[#005592] transition-colors hover:bg-[#DCECF5]">
                          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                          {booking.phone}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${bookingStatusStyle[booking.status]}`}>
                          {bookingStatusLabel[booking.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <label htmlFor={`booking-status-${booking.id}`} className="sr-only">Status booking {booking.clientName}</label>
                        <select
                          id={`booking-status-${booking.id}`}
                          disabled={updatingId === booking.id}
                          value={booking.status}
                          onChange={(event) => void handleUpdateBookingStatus(booking.id, event.target.value as RecentBooking["status"])}
                          className="min-h-10 rounded-lg border border-[#B8CAD4] bg-white px-3 text-xs font-semibold text-[#294153] focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#66B2E0]/30"
                        >
                          <option value="PENDING">Menunggu</option>
                          <option value="CONFIRMED">Dikonfirmasi</option>
                          <option value="COMPLETED">Selesai</option>
                          <option value="CANCELLED">Dibatalkan</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#B8CAD4] bg-white">
          <div className="border-b border-[#CBD8DF] px-5 py-5 sm:px-6">
            <h2 className="text-xl font-bold">Pesan masuk terbaru</h2>
            <p className="mt-1 text-sm text-[#526474]">Pertanyaan yang dikirim melalui formulir situs publik.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">Daftar pesan kontak terbaru</caption>
              <thead className="border-b border-[#CBD8DF] bg-[#F4F7F8] text-xs font-bold text-[#526474]">
                <tr>
                  <th scope="col" className="px-6 py-3.5">Pengirim</th>
                  <th scope="col" className="px-6 py-3.5">Pesan</th>
                  <th scope="col" className="px-6 py-3.5">Tanggal</th>
                  <th scope="col" className="px-6 py-3.5">Status</th>
                  <th scope="col" className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E9ED]">
                {loading && !data ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-[#526474]">Memuat pesan...</td></tr>
                ) : !data?.recentContacts.length ? (
                  <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-[#526474]">Belum ada pesan masuk.</td></tr>
                ) : (
                  data.recentContacts.map((contact) => (
                    <tr key={contact.id} className="transition-colors hover:bg-[#F8FAFB]">
                      <td className="px-6 py-4 font-bold text-[#0A1E2F]">
                        {contact.name}
                        <span className="mt-1 block text-xs font-normal text-[#71818D]">{contact.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#294153]">{contact.subject || "Pesan umum"}</span>
                        <span className="mt-1 block max-w-md truncate text-xs text-[#71818D]">{contact.message}</span>
                      </td>
                      <td className="px-6 py-4 text-xs tabular-nums text-[#526474]">{formatDate(contact.createdAt)}</td>
                      <td className="px-6 py-4">
                        {contact.isRead ? (
                          <span className="text-xs font-semibold text-[#71818D]">Sudah dibaca</span>
                        ) : (
                          <span className="inline-flex rounded-full bg-[#EAF3F8] px-2.5 py-1 text-xs font-bold text-[#005592]">Baru</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!contact.isRead && (
                          <button
                            type="button"
                            disabled={updatingId === contact.id}
                            onClick={() => void handleMarkContactAsRead(contact.id)}
                            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-xs font-bold text-[#005592] transition-colors hover:bg-[#EAF3F8] disabled:text-[#80909A]"
                          >
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            Tandai dibaca
                          </button>
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
