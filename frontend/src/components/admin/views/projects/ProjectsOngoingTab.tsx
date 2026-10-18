"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, MapPin, PlusCircle, Trash2 } from "lucide-react";
import api, { resolveMediaUrl } from "@/lib/api";
import { AdminModal } from "../../AdminModal";
import { MediaUploader } from "../../MediaUploader";
import type { OngoingProjectItem } from "../../admin.types";

interface ProjectsOngoingTabProps {
  projects: OngoingProjectItem[];
  loading: boolean;
  onRefresh: () => Promise<void>;
  onRefreshStats: () => void;
}

export const ProjectsOngoingTab = ({
  projects,
  loading,
  onRefresh,
  onRefreshStats,
}: ProjectsOngoingTabProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<OngoingProjectItem | null>(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [progress, setProgress] = useState(50);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [deleteCandidate, setDeleteCandidate] = useState<OngoingProjectItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = (project?: OngoingProjectItem) => {
    if (project) {
      setEditingItem(project);
      setTitle(project.title);
      setLocation(project.location);
      setProgress(project.progressPercentage);
      setDescription(project.description || "");
      setImageUrl(project.imageUrl || "");
    } else {
      setEditingItem(null);
      setTitle("");
      setLocation("");
      setProgress(50);
      setDescription("");
      setImageUrl("");
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title,
        location,
        progressPercentage: Number(progress),
        description: description || undefined,
        imageUrl: imageUrl || undefined,
      };

      if (editingItem) {
        await api.put(`/projects/ongoing/${editingItem.id}`, payload);
      } else {
        await api.post("/projects/ongoing", payload);
      }

      setModalOpen(false);
      await onRefresh();
      onRefreshStats();
    } catch (err: unknown) {
      console.warn("Gagal menyimpan proyek berjalan:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);
    try {
      await api.delete(`/projects/ongoing/${deleteCandidate.id}`);
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
          <span>Tambah Proyek Berjalan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#71818D]">
            Memuat proyek sedang berjalan...
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#71818D]">
            Belum ada proyek berjalan. Klik "Tambah Proyek Berjalan" untuk menambah data.
          </div>
        ) : (
          projects.map((p) => {
            const imageSrc = resolveMediaUrl(p.imageUrl);
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#CBD8DF] bg-white shadow-xs transition-all hover:border-[#005592]/40 hover:shadow-md"
              >
                <div className="relative h-44 w-full bg-[#F4F7F8]">
                  <Image
                    src={imageSrc}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover"
                  />
                  <div className="absolute right-3 top-3 rounded-full bg-[#004475] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {p.progressPercentage}% Progres
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#0A1E2F] group-hover:text-[#005592]">
                      {p.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-[#526474]">
                      <MapPin className="h-3 w-3 text-[#005592]" />
                      <span>{p.location}</span>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] font-bold text-[#526474]">
                        <span>Kemajuan Lapangan</span>
                        <span>{p.progressPercentage}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#E1E9ED]">
                        <div
                          className="h-full rounded-full bg-[#005592] transition-all"
                          style={{ width: `${Math.min(100, Math.max(0, p.progressPercentage))}%` }}
                        />
                      </div>
                    </div>

                    {p.description && (
                      <p className="mt-2.5 line-clamp-2 text-xs text-[#71818D]">
                        {p.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-1 border-t border-[#E1E9ED] pt-3">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(p)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-[#526474] hover:bg-[#EAF3F8] hover:text-[#005592]"
                      title="Edit Progres"
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
            );
          })
        )}
      </div>

      {/* Ongoing Modal (Create / Edit) */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Proyek Berjalan" : "Tambah Proyek Sedang Berjalan"}
        description="Publikasikan transparansi pembangunan fisik aktif di lapangan kepada calon klien."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Judul Proyek</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Bangun Rumah Tinggal 2 Lantai"
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Lokasi Proyek</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Grand Depok City, Sektor Melati"
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#294153]">Persentase Progres Lapangan</label>
              <span className="text-xs font-extrabold text-[#005592]">{progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-[#005592]"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Deskripsi Progres Saat Ini</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Pekerjaan cor dak lantai 2 selesai. Saat ini sedang pemasangan bata ringan dan instalasi pipa air..."
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <MediaUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            label="Foto Dokumentasi Lapangan"
          />

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
              {submitting ? "Menyimpan..." : "Simpan Progres"}
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
          description="Tindakan ini tidak dapat dibatalkan. Data proyek akan dihapus."
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
