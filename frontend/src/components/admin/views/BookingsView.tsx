"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCw,
  Search,
} from "lucide-react";
import api, { getApiData } from "@/lib/api";
import type { RecentBooking } from "../admin.types";

interface BookingsViewProps {
  onRefreshStats: () => void;
}

type FilterStatus = "ALL" | RecentBooking["status"];

const statusConfig: Record<
  RecentBooking["status"],
  { label: string; badge: string; border: string }
> = {
  PENDING: {
    label: "Menunggu",
    badge: "bg-amber-50 text-amber-800",
    border: "border-amber-200",
  },
  CONFIRMED: {
    label: "Dikonfirmasi",
    badge: "bg-emerald-50 text-emerald-800",
    border: "border-emerald-200",
  },
  COMPLETED: {
    label: "Selesai",
    badge: "bg-blue-50 text-blue-800",
    border: "border-blue-200",
  },
  CANCELLED: {
    label: "Dibatalkan",
    badge: "bg-slate-100 text-slate-700",
    border: "border-slate-200",
  },
};

const formatDate = (value: string): string => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export const BookingsView = ({ onRefreshStats }: BookingsViewProps) => {
  const [bookings, setBookings] = useState<RecentBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApiData<RecentBooking[]>("/bookings");
      setBookings(response || []);
    } catch (err: unknown) {
      console.warn("Gagal memuat daftar booking:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBookings();
  }, [fetchBookings]);

  const handleUpdateStatus = async (
    bookingId: string,
    newStatus: RecentBooking["status"],
  ) => {
    setUpdatingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
      );
      onRefreshStats();
    } catch (err: unknown) {
      console.warn("Gagal update status booking:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      b.clientName.toLowerCase().includes(query) ||
      b.email.toLowerCase().includes(query) ||
      b.phone.includes(query) ||
      b.location.toLowerCase().includes(query) ||
      b.serviceType.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const filterTabs: { id: FilterStatus; label: string; count: number }[] = [
    { id: "ALL", label: "Semua", count: bookings.length },
    {
      id: "PENDING",
      label: "Menunggu",
      count: bookings.filter((b) => b.status === "PENDING").length,
    },
    {
      id: "CONFIRMED",
      label: "Dikonfirmasi",
      count: bookings.filter((b) => b.status === "CONFIRMED").length,
    },
    {
      id: "COMPLETED",
      label: "Selesai",
      count: bookings.filter((b) => b.status === "COMPLETED").length,
    },
    {
      id: "CANCELLED",
      label: "Dibatalkan",
      count: bookings.filter((b) => b.status === "CANCELLED").length,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#0A1E2F]">
            Reservasi Survey Lokasi
          </h1>
          <p className="mt-1 text-xs text-[#526474]">
            Kelola pengajuan survey lapangan dan konsultasi arsitektur dari calon klien.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchBookings()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#CBD8DF] bg-white px-3.5 py-2 text-xs font-bold text-[#294153] shadow-xs hover:bg-[#F4F7F8]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#005592]" : ""}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#CBD8DF] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {filterTabs.map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                  active
                    ? "bg-[#005592] text-white"
                    : "bg-[#F4F7F8] text-[#526474] hover:bg-[#EAF3F8] hover:text-[#005592]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    active ? "bg-white/20 text-white" : "bg-[#CBD8DF] text-[#0A1E2F]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, WA, lokasi..."
            className="w-full rounded-xl border border-[#CBD8DF] bg-[#F8FAFB] py-2 pl-9 pr-4 text-xs font-medium text-[#0A1E2F] placeholder-[#8A9BA8] transition-colors focus:border-[#005592] focus:bg-white focus:outline-none"
          />
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8A9BA8]" />
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-[#CBD8DF] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="border-b border-[#CBD8DF] bg-[#F8FAFB] font-bold text-[#526474]">
              <tr>
                <th scope="col" className="px-6 py-3.5">Klien & Kontak</th>
                <th scope="col" className="px-6 py-3.5">Layanan & Alamat Survey</th>
                <th scope="col" className="px-6 py-3.5">Jadwal Survey</th>
                <th scope="col" className="px-6 py-3.5">Catatan Khusus</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E9ED]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#71818D]">
                    Memuat data reservasi...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#71818D]">
                    Tidak ditemukan reservasi yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const conf = statusConfig[booking.status] || statusConfig.PENDING;
                  const waNumber = booking.phone.replace(/\D/g, "").replace(/^0/, "62");
                  const waUrl = `https://wa.me/${waNumber}?text=Halo%20${encodeURIComponent(
                    booking.clientName,
                  )},%20kami%20dari%20KilauBuild%20ingin%20mengonfirmasi%20jadwal%20survey%20lokasi%20Anda.`;

                  return (
                    <tr key={booking.id} className="transition-colors hover:bg-[#F8FAFB]">
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#0A1E2F]">{booking.clientName}</div>
                        <div className="mt-0.5 text-[11px] text-[#71818D]">{booking.email}</div>
                        <div className="mt-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#EAF3F8] px-2.5 py-1 text-[11px] font-bold text-[#005592] hover:bg-[#DCECF5]"
                            title="Buka obrolan WhatsApp"
                          >
                            <Phone className="h-3 w-3" />
                            <span>{booking.phone}</span>
                          </a>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-block rounded-md bg-[#005592]/10 px-2 py-0.5 font-bold text-[#005592]">
                          {booking.serviceType}
                        </span>
                        <div className="mt-1 flex items-start gap-1 text-[11px] text-[#526474]">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8A9BA8]" />
                          <span className="max-w-xs">{booking.location}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 tabular-nums">
                        <div className="flex items-center gap-1.5 font-bold text-[#0A1E2F]">
                          <Calendar className="h-3.5 w-3.5 text-[#005592]" />
                          <span>{formatDate(booking.bookingDate)}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[#71818D]">
                          <Clock className="h-3 w-3" />
                          <span>Pukul {booking.timeSlot} WIB</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <p className="max-w-[200px] line-clamp-2 text-[11px] text-[#526474]">
                          {booking.notes || "—"}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${conf.badge} ${conf.border}`}
                        >
                          {conf.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <select
                          disabled={updatingId === booking.id}
                          value={booking.status}
                          onChange={(e) =>
                            void handleUpdateStatus(
                              booking.id,
                              e.target.value as RecentBooking["status"],
                            )
                          }
                          className="rounded-lg border border-[#CBD8DF] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#294153] shadow-xs focus:border-[#005592] focus:outline-none"
                          aria-label={`Ubah status booking ${booking.clientName}`}
                        >
                          <option value="PENDING">Menunggu</option>
                          <option value="CONFIRMED">Dikonfirmasi</option>
                          <option value="COMPLETED">Selesai</option>
                          <option value="CANCELLED">Dibatalkan</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
