"use client";

import {
  Activity,
  ArrowRight,
  Calendar,
  Check,
  FolderKanban,
  Layers3,
  MessageSquare,
  Phone,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";
import type {
  AdminNavSection,
  AdminUser,
  DashboardOverviewData,
  RecentBooking,
} from "../admin.types";

interface OverviewViewProps {
  user: AdminUser | null;
  data: DashboardOverviewData | null;
  loading: boolean;
  onNavigate: (section: AdminNavSection) => void;
  onUpdateBookingStatus: (
    bookingId: string,
    newStatus: RecentBooking["status"],
  ) => Promise<void>;
  onMarkContactRead: (contactId: string) => Promise<void>;
  updatingId: string | null;
}

interface MetricCardItem {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
  badgeTone: string;
  targetSection: AdminNavSection;
}

const bookingStatusStyle: Record<RecentBooking["status"], { label: string; badge: string }> = {
  PENDING: { label: "Menunggu", badge: "bg-amber-50 text-amber-800 border-amber-200" },
  CONFIRMED: { label: "Dikonfirmasi", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  COMPLETED: { label: "Selesai", badge: "bg-blue-50 text-blue-800 border-blue-200" },
  CANCELLED: { label: "Dibatalkan", badge: "bg-slate-100 text-slate-700 border-slate-200" },
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

export const OverviewView = ({
  user,
  data,
  loading,
  onNavigate,
  onUpdateBookingStatus,
  onMarkContactRead,
  updatingId,
}: OverviewViewProps) => {
  const metrics = data?.metrics ?? {
    totalProjectsDone: 0,
    totalOngoingProjects: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalContacts: 0,
    unreadContacts: 0,
  };

  const metricCards: MetricCardItem[] = [
    {
      label: "Reservasi Survey",
      value: metrics.totalBookings,
      note: `${metrics.pendingBookings} menunggu konfirmasi`,
      icon: Calendar,
      badgeTone: "bg-[#FEF7EC] text-[#B45309]",
      targetSection: "bookings",
    },
    {
      label: "Pesan Masuk",
      value: metrics.totalContacts,
      note: `${metrics.unreadContacts} belum dibaca`,
      icon: MessageSquare,
      badgeTone: "bg-[#EAF3FE] text-[#005592]",
      targetSection: "contacts",
    },
    {
      label: "Proyek Selesai",
      value: metrics.totalProjectsDone,
      note: "Portofolio terserahterima",
      icon: Layers3,
      badgeTone: "bg-[#EDF8F1] text-[#15803D]",
      targetSection: "projects",
    },
    {
      label: "Proyek Berjalan",
      value: metrics.totalOngoingProjects,
      note: "Aktif di lapangan",
      icon: Activity,
      badgeTone: "bg-[#EEF2FF] text-[#4338CA]",
      targetSection: "projects",
    },
  ];

  const adminGreetingName = user?.name ? user.name.split(" ")[0] : "Admin";

  return (
    <div className="space-y-8">
      {/* Welcome Greeting Banner (Requested by user) */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0A1E2F] sm:text-3xl">
            Halo Admin! 👋
          </h1>
          <p className="mt-1 text-xs text-[#526474] sm:text-sm">
            Berikut ringkasan jadwal survey, pesan konsultasi klien, dan progres proyek konstruksi aktif KilauBuild hari ini.
          </p>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate("projects")}
            className="inline-flex items-center gap-2 rounded-xl bg-[#005592] px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0066AE]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Kelola Proyek</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate("bookings")}
            className="inline-flex items-center gap-2 rounded-xl border border-[#CBD8DF] bg-white px-4 py-2.5 text-xs font-bold text-[#294153] shadow-xs transition-colors hover:bg-[#F4F7F8]"
          >
            <Calendar className="h-4 w-4 text-[#005592]" />
            <span>Semua Reservasi</span>
          </button>
        </div>
      </div>

      {/* 4 Bento Metric Cards with Muted Pastel Accents (Jiron style) */}
      <section aria-label="Statistik Utama" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              onClick={() => onNavigate(card.targetSection)}
              className="group cursor-pointer rounded-2xl border border-[#E1E9ED] bg-white p-5 shadow-xs transition-all hover:border-[#005592]/30 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#526474] group-hover:text-[#005592]">
                  {card.label}
                </span>
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.badgeTone}`}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-4">
                {loading && !data ? (
                  <div className="h-9 w-20 animate-pulse rounded-lg bg-[#EAF3F8]" />
                ) : (
                  <p className="text-3xl font-extrabold tabular-nums tracking-tight text-[#0A1E2F]">
                    {card.value}
                  </p>
                )}
                <p className="mt-1 text-xs font-medium text-[#71818D]">{card.note}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Dual Activity Panels: Recent Bookings & Recent Contacts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Recent Bookings (7 cols) */}
        <section className="lg:col-span-7 rounded-2xl border border-[#E1E9ED] bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E1E9ED] px-6 py-4">
            <div>
              <h2 className="text-sm font-bold text-[#0A1E2F]">Reservasi Survey Terbaru</h2>
              <p className="text-[11px] text-[#71818D]">5 pengajuan jadwal survey terakhir</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("bookings")}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#005592] hover:underline"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E1E9ED] bg-[#F8FAFB] font-bold text-[#526474]">
                <tr>
                  <th scope="col" className="px-5 py-3">Klien</th>
                  <th scope="col" className="px-5 py-3">Layanan & Lokasi</th>
                  <th scope="col" className="px-5 py-3">Jadwal</th>
                  <th scope="col" className="px-5 py-3">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Ubah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E9ED]">
                {loading && !data ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#71818D]">
                      Memuat reservasi survey...
                    </td>
                  </tr>
                ) : !data?.recentBookings.length ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-[#71818D]">
                      Belum ada pengajuan survey terbaru.
                    </td>
                  </tr>
                ) : (
                  data.recentBookings.map((b) => {
                    const statusConfig = bookingStatusStyle[b.status] || bookingStatusStyle.PENDING;
                    return (
                      <tr key={b.id} className="transition-colors hover:bg-[#F8FAFB]">
                        <td className="px-5 py-3.5 font-bold text-[#0A1E2F]">
                          <div>{b.clientName}</div>
                          <div className="mt-0.5 text-[11px] font-normal text-[#71818D]">{b.phone}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-semibold text-[#005592]">{b.serviceType}</span>
                          <span className="mt-0.5 block max-w-[180px] truncate text-[11px] text-[#71818D]">
                            {b.location}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 tabular-nums">
                          <span className="font-semibold text-[#294153]">{formatDate(b.bookingDate)}</span>
                          <span className="block text-[11px] text-[#71818D]">{b.timeSlot} WIB</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusConfig.badge}`}
                          >
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <select
                            disabled={updatingId === b.id}
                            value={b.status}
                            onChange={(e) =>
                              void onUpdateBookingStatus(
                                b.id,
                                e.target.value as RecentBooking["status"],
                              )
                            }
                            className="rounded-lg border border-[#CBD8DF] bg-white px-2 py-1 text-[11px] font-semibold text-[#294153] focus:border-[#005592] focus:outline-none"
                            aria-label={`Ubah status booking ${b.clientName}`}
                          >
                            <option value="PENDING">Menunggu</option>
                            <option value="CONFIRMED">Konfirmasi</option>
                            <option value="COMPLETED">Selesai</option>
                            <option value="CANCELLED">Batal</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Column: Recent Contacts (5 cols) */}
        <section className="lg:col-span-5 rounded-2xl border border-[#E1E9ED] bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E1E9ED] px-6 py-4">
            <div>
              <h2 className="text-sm font-bold text-[#0A1E2F]">Pesan Masuk Terbaru</h2>
              <p className="text-[11px] text-[#71818D]">Pertanyaan dari formulir publik</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("contacts")}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#005592] hover:underline"
            >
              <span>Semua Pesan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E1E9ED]">
            {loading && !data ? (
              <div className="py-8 text-center text-xs text-[#71818D]">Memuat pesan masuk...</div>
            ) : !data?.recentContacts.length ? (
              <div className="py-8 text-center text-xs text-[#71818D]">Belum ada pesan masuk.</div>
            ) : (
              data.recentContacts.map((c) => (
                <div key={c.id} className="p-4 transition-colors hover:bg-[#F8FAFB]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#0A1E2F] text-xs">{c.name}</span>
                        {!c.isRead && (
                          <span className="rounded-full bg-[#005592] px-1.5 py-0.2 text-[9px] font-bold text-white">
                            Baru
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#71818D]">{c.email}</p>
                    </div>
                    <span className="text-[10px] tabular-nums text-[#8A9BA8]">
                      {formatDate(c.createdAt)}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs text-[#526474]">
                    {c.message}
                  </p>

                  {!c.isRead && (
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        disabled={updatingId === c.id}
                        onClick={() => void onMarkContactRead(c.id)}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-[#005592] hover:bg-[#EAF3F8]"
                      >
                        <Check className="h-3 w-3" />
                        <span>Tandai dibaca</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
