"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  CheckCheck,
  Eye,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import api, { getApiData } from "@/lib/api";
import { AdminModal } from "../AdminModal";
import type { RecentContact } from "../admin.types";

interface ContactsViewProps {
  onRefreshStats: () => void;
}

type FilterRead = "ALL" | "UNREAD" | "READ";

const formatDate = (value: string): string => {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
};

export const ContactsView = ({ onRefreshStats }: ContactsViewProps) => {
  const [contacts, setContacts] = useState<RecentContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterRead>("ALL");
  const [selectedContact, setSelectedContact] = useState<RecentContact | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<RecentContact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApiData<RecentContact[]>("/contacts");
      setContacts(response || []);
    } catch (err: unknown) {
      console.warn("Gagal memuat pesan kontak:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchContacts();
  }, [fetchContacts]);

  const handleMarkAsRead = async (contactId: string) => {
    try {
      await api.patch(`/contacts/${contactId}/read`);
      setContacts((prev) =>
        prev.map((c) => (c.id === contactId ? { ...c, isRead: true } : c)),
      );
      if (selectedContact?.id === contactId) {
        setSelectedContact((prev) => (prev ? { ...prev, isRead: true } : null));
      }
      onRefreshStats();
    } catch (err: unknown) {
      console.warn("Gagal menandai pesan dibaca:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      await api.delete(`/contacts/${deleteCandidate.id}`);
      setContacts((prev) => prev.filter((c) => c.id !== deleteCandidate.id));
      setDeleteCandidate(null);
      onRefreshStats();
    } catch (err: unknown) {
      console.warn("Gagal menghapus pesan:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchesFilter =
      filter === "ALL" ||
      (filter === "UNREAD" && !c.isRead) ||
      (filter === "READ" && c.isRead);

    const query = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.phone && c.phone.includes(query)) ||
      (c.subject && c.subject.toLowerCase().includes(query)) ||
      c.message.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const unreadCount = contacts.filter((c) => !c.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#0A1E2F]">
            Kotak Masuk Konsultasi
          </h1>
          <p className="mt-1 text-xs text-[#526474]">
            Pertanyaan dan pesan yang masuk melalui formulir konsultasi situs publik KilauBuild.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchContacts()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl border border-[#CBD8DF] bg-white px-3.5 py-2 text-xs font-bold text-[#294153] shadow-xs hover:bg-[#F4F7F8]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#005592]" : ""}`} />
          <span>Segarkan Pesan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#CBD8DF] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === "ALL"
                ? "bg-[#005592] text-white"
                : "bg-[#F4F7F8] text-[#526474] hover:bg-[#EAF3F8]"
            }`}
          >
            Semua ({contacts.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("UNREAD")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === "UNREAD"
                ? "bg-[#005592] text-white"
                : "bg-[#F4F7F8] text-[#526474] hover:bg-[#EAF3F8]"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("READ")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
              filter === "READ"
                ? "bg-[#005592] text-white"
                : "bg-[#F4F7F8] text-[#526474] hover:bg-[#EAF3F8]"
            }`}
          >
            Sudah Dibaca ({contacts.length - unreadCount})
          </button>
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pengirim, subjek, pesan..."
            className="w-full rounded-xl border border-[#CBD8DF] bg-[#F8FAFB] py-2 pl-9 pr-4 text-xs font-medium text-[#0A1E2F] placeholder-[#8A9BA8] transition-colors focus:border-[#005592] focus:bg-white focus:outline-none"
          />
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8A9BA8]" />
        </div>
      </div>

      {/* Messages List / Table */}
      <div className="overflow-hidden rounded-2xl border border-[#CBD8DF] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-xs">
            <thead className="border-b border-[#CBD8DF] bg-[#F8FAFB] font-bold text-[#526474]">
              <tr>
                <th scope="col" className="px-6 py-3.5">Pengirim</th>
                <th scope="col" className="px-6 py-3.5">Subjek & Pesan</th>
                <th scope="col" className="px-6 py-3.5">Waktu Masuk</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E9ED]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#71818D]">
                    Memuat kotak masuk...
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[#71818D]">
                    Tidak ada pesan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((c) => (
                  <tr
                    key={c.id}
                    className={`transition-colors hover:bg-[#F8FAFB] ${
                      !c.isRead ? "bg-[#EAF3F8]/30 font-semibold" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#0A1E2F]">{c.name}</div>
                      <div className="mt-0.5 text-[11px] text-[#71818D]">{c.email}</div>
                      {c.phone && (
                        <div className="mt-1 text-[11px] text-[#005592]">{c.phone}</div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-bold text-[#294153]">
                        {c.subject || "Pesan Konsultasi"}
                      </span>
                      <p className="mt-1 max-w-md truncate text-[11px] font-normal text-[#526474]">
                        {c.message}
                      </p>
                    </td>

                    <td className="px-6 py-4 tabular-nums text-[11px] text-[#71818D]">
                      {formatDate(c.createdAt)}
                    </td>

                    <td className="px-6 py-4">
                      {c.isRead ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                          <CheckCheck className="h-3 w-3" />
                          Dibaca
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#005592] px-2 py-0.5 text-[10px] font-bold text-white">
                          Baru
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedContact(c);
                            if (!c.isRead) void handleMarkAsRead(c.id);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] bg-white text-[#526474] transition-colors hover:bg-[#EAF3F8] hover:text-[#005592]"
                          title="Buka detail pesan"
                          aria-label="Buka detail pesan"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {!c.isRead && (
                          <button
                            type="button"
                            onClick={() => void handleMarkAsRead(c.id)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] bg-white text-emerald-600 transition-colors hover:bg-emerald-50"
                            title="Tandai dibaca"
                            aria-label="Tandai dibaca"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setDeleteCandidate(c)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] bg-white text-red-500 transition-colors hover:bg-red-50"
                          title="Hapus pesan"
                          aria-label="Hapus pesan"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {selectedContact && (
        <AdminModal
          isOpen={Boolean(selectedContact)}
          onClose={() => setSelectedContact(null)}
          title={selectedContact.subject || "Detail Pesan Masuk"}
          description={`Dikirim oleh ${selectedContact.name} pada ${formatDate(
            selectedContact.createdAt,
          )}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-[#F8FAFB] p-4 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#8A9BA8]">Pengirim:</span>
                  <p className="font-bold text-[#0A1E2F]">{selectedContact.name}</p>
                </div>
                <div>
                  <span className="text-[#8A9BA8]">Email:</span>
                  <p className="font-bold text-[#0A1E2F]">{selectedContact.email}</p>
                </div>
                {selectedContact.phone && (
                  <div>
                    <span className="text-[#8A9BA8]">Telepon / WhatsApp:</span>
                    <p className="font-bold text-[#005592]">{selectedContact.phone}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold text-[#526474]">
                Isi Pesan:
              </label>
              <div className="whitespace-pre-wrap rounded-xl border border-[#CBD8DF] bg-white p-4 text-xs leading-relaxed text-[#294153]">
                {selectedContact.message}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                className="rounded-xl bg-[#005592] px-4 py-2 text-xs font-bold text-white hover:bg-[#0066AE]"
              >
                Tutup
              </button>
            </div>
          </div>
        </AdminModal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <AdminModal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          title="Konfirmasi Hapus Pesan"
          description="Pesan ini akan dihapus permanen dari sistem."
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#526474]">
              Apakah Anda yakin ingin menghapus pesan dari{" "}
              <strong className="text-[#0A1E2F]">{deleteCandidate.name}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeleting}
                className="rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs font-bold text-[#526474] hover:bg-[#F4F7F8]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={isDeleting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? "Menghapus..." : "Hapus Permanen"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
