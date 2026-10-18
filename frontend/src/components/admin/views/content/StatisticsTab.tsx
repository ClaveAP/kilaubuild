"use client";

import { useState } from "react";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { AdminModal } from "../../AdminModal";
import type { StatisticItem } from "../../admin.types";

interface StatisticsTabProps {
  statistics: StatisticItem[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export const StatisticsTab = ({
  statistics,
  loading,
  onRefresh,
}: StatisticsTabProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StatisticItem | null>(null);
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [order, setOrder] = useState(1);

  const [deleteCandidate, setDeleteCandidate] = useState<StatisticItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (item?: StatisticItem) => {
    if (item) {
      setEditingItem(item);
      setTitle(item.title);
      setValue(item.value);
      setUnit(item.unit || "");
      setOrder(item.order);
    } else {
      setEditingItem(null);
      setTitle("");
      setValue("");
      setUnit("");
      setOrder(statistics.length + 1);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        value,
        unit: unit || undefined,
        order: Number(order),
      };

      if (editingItem) {
        await api.put(`/statistics/${editingItem.id}`, payload);
      } else {
        await api.post("/statistics", payload);
      }

      setModalOpen(false);
      await onRefresh();
    } catch (err: unknown) {
      console.warn("Gagal menyimpan statistik:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);
    try {
      await api.delete(`/statistics/${deleteCandidate.id}`);
      setDeleteCandidate(null);
      await onRefresh();
    } catch (err: unknown) {
      console.warn("Gagal menghapus statistik:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => handleOpenModal()}
          className="inline-flex items-center gap-2 rounded-xl bg-[#005592] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0066AE]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Statistik</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71818D]">
          Memuat data statistik landing page...
        </div>
      ) : statistics.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#71818D]">
          Belum ada data counter statistik tersimpan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statistics.map((s) => (
            <div
              key={s.id}
              className="flex flex-col justify-between rounded-2xl border border-[#CBD8DF] bg-white p-5 shadow-xs"
            >
              <div>
                <span className="text-[11px] font-bold text-[#8A9BA8]">Urutan #{s.order}</span>
                <p className="mt-2 text-3xl font-extrabold text-[#005592]">{s.value}</p>
                <h4 className="mt-1 text-sm font-bold text-[#0A1E2F]">{s.title}</h4>
                {s.unit && <p className="mt-0.5 text-xs text-[#71818D]">{s.unit}</p>}
              </div>

              <div className="mt-4 flex items-center justify-end gap-1 border-t border-[#E1E9ED] pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenModal(s)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-[#526474] hover:bg-[#EAF3F8]"
                  title="Edit Statistik"
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteCandidate(s)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-red-500 hover:bg-red-50"
                  title="Hapus Statistik"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Angka Statistik" : "Tambah Angka Statistik"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Judul Counter</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Proyek Selesai"
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#294153]">Nilai Angka</label>
              <input
                type="text"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Contoh: 150+"
                className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#294153]">Satuan / Keterangan</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Contoh: Unit Bangunan"
                className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Urutan Posisi</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-[#CBD8DF] px-4 py-2 text-xs font-bold text-[#526474]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#005592] px-5 py-2 text-xs font-bold text-white hover:bg-[#0066AE]"
            >
              Simpan Statistik
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <AdminModal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          title="Konfirmasi Hapus Statistik"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#526474]">
              Apakah Anda yakin ingin menghapus angka statistik:{" "}
              <strong className="text-[#0A1E2F]">{deleteCandidate.title} ({deleteCandidate.value})</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs font-bold text-[#526474]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={submitting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
