"use client";

import { useState } from "react";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { AdminModal } from "../../AdminModal";
import type { FaqItem } from "../../admin.types";

interface FaqsTabProps {
  faqs: FaqItem[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export const FaqsTab = ({ faqs, loading, onRefresh }: FaqsTabProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const [deleteCandidate, setDeleteCandidate] = useState<FaqItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (item?: FaqItem) => {
    if (item) {
      setEditingItem(item);
      setQuestion(item.question);
      setAnswer(item.answer);
      setOrder(item.order);
      setIsActive(item.isActive);
    } else {
      setEditingItem(null);
      setQuestion("");
      setAnswer("");
      setOrder(faqs.length + 1);
      setIsActive(true);
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        question,
        answer,
        order: Number(order),
        isActive: Boolean(isActive),
      };

      if (editingItem) {
        await api.put(`/faqs/${editingItem.id}`, payload);
      } else {
        await api.post("/faqs", payload);
      }

      setModalOpen(false);
      await onRefresh();
    } catch (err: unknown) {
      console.warn("Gagal menyimpan FAQ:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);
    try {
      await api.delete(`/faqs/${deleteCandidate.id}`);
      setDeleteCandidate(null);
      await onRefresh();
    } catch (err: unknown) {
      console.warn("Gagal menghapus FAQ:", err);
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
          <span>Tambah FAQ</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71818D]">
          Memuat data tanya jawab (FAQ)...
        </div>
      ) : faqs.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#71818D]">
          Belum ada data FAQ tersimpan.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#CBD8DF] bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#CBD8DF] bg-[#F8FAFB] font-bold text-[#526474]">
              <tr>
                <th scope="col" className="px-6 py-3.5">Urutan</th>
                <th scope="col" className="px-6 py-3.5">Pertanyaan</th>
                <th scope="col" className="px-6 py-3.5">Jawaban</th>
                <th scope="col" className="px-6 py-3.5">Status</th>
                <th scope="col" className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E9ED]">
              {faqs.map((f) => (
                <tr key={f.id} className="hover:bg-[#F8FAFB]">
                  <td className="px-6 py-4 font-bold text-[#005592]">#{f.order}</td>
                  <td className="px-6 py-4 font-bold text-[#0A1E2F] max-w-xs">{f.question}</td>
                  <td className="px-6 py-4 text-[#526474] max-w-md line-clamp-2">{f.answer}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        f.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {f.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(f)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-[#526474] hover:bg-[#EAF3F8]"
                        title="Edit FAQ"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(f)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-red-500 hover:bg-red-50"
                        title="Hapus FAQ"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit FAQ" : "Tambah FAQ"}
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Pertanyaan</label>
            <input
              type="text"
              required
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Contoh: Apa arti Bangun Dulu Baru Bayar?"
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Jawaban</label>
            <textarea
              rows={4}
              required
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Tulis penjelasan lengkap..."
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#294153]">Urutan Tampilan</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F]"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                id="faq-active"
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 accent-[#005592]"
              />
              <label htmlFor="faq-active" className="text-xs font-bold text-[#294153]">
                Tampilkan di Website
              </label>
            </div>
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
              Simpan FAQ
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <AdminModal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          title="Konfirmasi Hapus FAQ"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#526474]">
              Apakah Anda yakin ingin menghapus pertanyaan:{" "}
              <strong className="text-[#0A1E2F]">"{deleteCandidate.question}"</strong>?
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
