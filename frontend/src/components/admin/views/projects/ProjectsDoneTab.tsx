"use client";

import { useState } from "react";
import Image from "next/image";
import { DollarSign, Edit, PlusCircle, Trash2, X } from "lucide-react";
import api, { resolveMediaUrl } from "@/lib/api";
import { AdminModal } from "../../AdminModal";
import { MediaUploader } from "../../MediaUploader";
import type { ProjectDoneItem } from "../../admin.types";

interface ProjectsDoneTabProps {
  projects: ProjectDoneItem[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onRefreshStats: () => void;
}

export const ProjectsDoneTab = ({
  projects,
  loading,
  onRefresh,
  onRefreshStats,
}: ProjectsDoneTabProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectDoneItem | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Residensial");
  const [budget, setBudget] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [gallery, setGallery] = useState<Array<{ imageUrl: string; caption?: string }>>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState("");
  const [newGalleryCaption, setNewGalleryCaption] = useState("");

  const [deleteCandidate, setDeleteCandidate] = useState<ProjectDoneItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (project?: ProjectDoneItem) => {
    if (project) {
      setEditingItem(project);
      setTitle(project.title);
      setCategory(project.category);
      setBudget(project.budgetRange || "");
      setCompletionDate(project.completionDate ? project.completionDate.slice(0, 10) : "");
      setDescription(project.description || "");
      setCoverImage(project.coverImage || "");
      setGallery(
        project.gallery?.map((g) => ({
          imageUrl: g.imageUrl,
          caption: g.caption || undefined,
        })) || [],
      );
    } else {
      setEditingItem(null);
      setTitle("");
      setCategory("Residensial");
      setBudget("");
      setCompletionDate("");
      setDescription("");
      setCoverImage("");
      setGallery([]);
    }
    setNewGalleryUrl("");
    setNewGalleryCaption("");
    setModalOpen(true);
  };

  const handleAddGalleryItem = () => {
    if (!newGalleryUrl) return;
    setGallery((prev) => [
      ...prev,
      { imageUrl: newGalleryUrl, caption: newGalleryCaption || undefined },
    ]);
    setNewGalleryUrl("");
    setNewGalleryCaption("");
  };

  const handleRemoveGalleryItem = (index: number) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        category,
        budgetRange: budget || undefined,
        completionDate: completionDate ? new Date(completionDate).toISOString() : undefined,
        description: description || undefined,
        coverImage: coverImage || undefined,
        gallery: gallery.length ? gallery : undefined,
      };

      if (editingItem) {
        await api.put(`/projects/done/${editingItem.id}`, payload);
      } else {
        await api.post("/projects/done", payload);
      }

      setModalOpen(false);
      await onRefresh();
      onRefreshStats();
    } catch (err: unknown) {
      console.warn("Gagal menyimpan proyek selesai:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);
    try {
      await api.delete(`/projects/done/${deleteCandidate.id}`);
      setDeleteCandidate(null);
      await onRefresh();
      onRefreshStats();
    } catch (err: unknown) {
      console.warn("Gagal menghapus proyek:", err);
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
          <span>Tambah Proyek Selesai</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#71818D]">
            Memuat data proyek selesai...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#71818D]">
            Belum ada portofolio proyek selesai. Klik "Tambah Proyek Selesai" untuk mulai.
          </div>
        ) : (
          projects.map((p) => {
            const coverSrc = resolveMediaUrl(p.coverImage);
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#CBD8DF] bg-white shadow-xs transition-all hover:border-[#005592]/40 hover:shadow-md"
              >
                <div className="relative h-44 w-full bg-[#F4F7F8]">
                  <Image
                    src={coverSrc}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#004475] shadow-xs backdrop-blur-xs">
                    {p.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1E2F] group-hover:text-[#005592]">
                      {p.title}
                    </h3>
                    {p.budgetRange && (
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#526474]">
                        <DollarSign className="h-3 w-3 text-[#005592]" />
                        <span>{p.budgetRange}</span>
                      </div>
                    )}
                    {p.description && (
                      <p className="mt-2 line-clamp-2 text-xs text-[#71818D]">{p.description}</p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#E1E9ED] pt-3 text-[11px]">
                    <span className="font-semibold text-[#8A9BA8]">
                      {p.gallery?.length ? `${p.gallery.length} Foto Galeri` : "Cover Utama"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-[#526474] hover:bg-[#EAF3F8] hover:text-[#005592]"
                        title="Edit Proyek"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-red-500 hover:bg-red-50"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Done Modal (Create / Edit) */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Proyek Selesai" : "Tambah Portofolio Proyek Selesai"}
        description="Dokumentasikan hasil karya bangunan yang telah selesai diserahterimakan ke klien."
        maxWidth="xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Judul Proyek</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Rumah Minimalis 2 Lantai Sawangan"
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#294153]">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#CBD8DF] bg-white px-3 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
              >
                <option value="Residensial">Residensial / Rumah</option>
                <option value="Komersial">Komersial / Ruko / Cafe</option>
                <option value="Renovasi">Renovasi & Fasad</option>
                <option value="Desain Interior">Desain Interior</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#294153]">Rentang Budget (RAB)</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="Contoh: Rp 350 Jt - Rp 500 Jt"
                className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Tanggal Selesai</label>
            <input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Deskripsi Proyek</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan ruang lingkup pekerjaan, luas bangunan, dan spesifikasi material utama..."
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <MediaUploader
            value={coverImage}
            onChange={(url) => setCoverImage(url)}
            label="Foto Cover Utama Portofolio"
          />

          <div className="rounded-xl border border-[#CBD8DF] p-4 bg-[#F8FAFB]">
            <label className="mb-2 block text-xs font-bold text-[#0A1E2F]">
              Galeri Foto Tambahan ({gallery.length})
            </label>

            {gallery.length > 0 && (
              <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {gallery.map((item, idx) => (
                  <div key={idx} className="relative group h-20 rounded-lg overflow-hidden border border-[#CBD8DF] bg-white">
                    <Image
                      src={resolveMediaUrl(item.imageUrl)}
                      alt={item.caption || "Gallery"}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryItem(idx)}
                      className="absolute top-1 right-1 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <MediaUploader
                value={newGalleryUrl}
                onChange={(url) => setNewGalleryUrl(url)}
                label="Unggah Foto Galeri Baru"
              />
              {newGalleryUrl && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newGalleryCaption}
                    onChange={(e) => setNewGalleryCaption(e.target.value)}
                    placeholder="Keterangan foto (opsional, misal: Tampak Kamar Mandi)"
                    className="flex-1 rounded-lg border border-[#CBD8DF] px-3 py-1.5 text-xs text-[#0A1E2F]"
                  />
                  <button
                    type="button"
                    onClick={handleAddGalleryItem}
                    className="rounded-lg bg-[#005592] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0066AE]"
                  >
                    Tambah ke Galeri
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-xl border border-[#CBD8DF] px-4 py-2 text-xs font-bold text-[#526474] hover:bg-[#F4F7F8]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#005592] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0066AE] disabled:opacity-60"
            >
              {submitting ? "Menyimpan..." : "Simpan Proyek"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <AdminModal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          title="Konfirmasi Hapus Proyek"
          description="Tindakan ini tidak dapat dibatalkan. Data dan galeri proyek akan dihapus."
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#526474]">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-[#0A1E2F]">{deleteCandidate.title}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                disabled={submitting}
                className="rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs font-bold text-[#526474] hover:bg-[#F4F7F8]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={submitting}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {submitting ? "Menghapus..." : "Hapus Permanen"}
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
