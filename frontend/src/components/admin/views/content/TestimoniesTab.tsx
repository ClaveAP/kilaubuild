"use client";

import { useState } from "react";
import { Edit, PlusCircle, Star, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { AdminModal } from "../../AdminModal";
import type { TestimonyItem } from "../../admin.types";

interface TestimoniesTabProps {
  testimonies: TestimonyItem[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export const TestimoniesTab = ({
  testimonies,
  loading,
  onRefresh,
}: TestimoniesTabProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonyItem | null>(null);
  const [clientName, setClientName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const [deleteCandidate, setDeleteCandidate] = useState<TestimonyItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (item?: TestimonyItem) => {
    if (item) {
      setEditingItem(item);
      setClientName(item.clientName);
      setProjectType(item.projectType);
      setReview(item.review);
      setRating(item.rating);
    } else {
      setEditingItem(null);
      setClientName("");
      setProjectType("");
      setReview("");
      setRating(5);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        clientName,
        projectType,
        review,
        rating: Number(rating),
      };

      if (editingItem) {
        await api.put(`/testimonies/${editingItem.id}`, payload);
      } else {
        await api.post("/testimonies", payload);
      }

      setModalOpen(false);
      await onRefresh();
    } catch (err: unknown) {
      console.warn("Gagal menyimpan testimoni:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);
    try {
      await api.delete(`/testimonies/${deleteCandidate.id}`);
      setDeleteCandidate(null);
      await onRefresh();
    } catch (err: unknown) {
      console.warn("Gagal menghapus testimoni:", err);
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
          <span>Tambah Testimoni</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71818D]">
          Memuat data testimoni klien...
        </div>
      ) : testimonies.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#71818D]">
          Belum ada testimoni klien tersimpan.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonies.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[#CBD8DF] bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < item.rating ? "fill-amber-400 text-amber-400" : "text-[#CBD8DF]"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-3 text-xs italic leading-relaxed text-[#526474]">
                  "{item.review}"
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#E1E9ED] pt-3">
                <div>
                  <h4 className="text-xs font-bold text-[#0A1E2F]">{item.clientName}</h4>
                  <p className="text-[11px] text-[#71818D]">{item.projectType}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenModal(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-[#526474] hover:bg-[#EAF3F8]"
                    title="Edit Testimoni"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(item)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-red-500 hover:bg-red-50"
                    title="Hapus Testimoni"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Testimoni" : "Tambah Testimoni Klien"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Nama Klien</label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Contoh: Bpk. Budi & Keluarga"
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Jenis Proyek</label>
            <input
              type="text"
              required
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder="Contoh: Bangun Rumah 2 Lantai - Depok"
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Rating (Bintang 1 - 5)</label>
            <input
              type="number"
              min={1}
              max={5}
              required
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Ulasan / Review</label>
            <textarea
              rows={3}
              required
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tulis testimoni pengalaman klien bersama KilauBuild..."
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
              Simpan Testimoni
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <AdminModal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          title="Konfirmasi Hapus Testimoni"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#526474]">
              Apakah Anda yakin ingin menghapus testimoni dari{" "}
              <strong className="text-[#0A1E2F]">{deleteCandidate.clientName}</strong>?
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
