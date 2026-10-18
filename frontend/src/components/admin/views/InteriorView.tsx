"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Armchair,
  Edit,
  Layers,
  PlusCircle,
  RefreshCw,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import api, { getApiData, resolveMediaUrl } from "@/lib/api";
import { AdminModal } from "../AdminModal";
import { MediaUploader } from "../MediaUploader";
import type { DesainInteriorItem } from "../admin.types";

export const InteriorView = () => {
  const [interiors, setInteriors] = useState<DesainInteriorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomFilter, setRoomFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DesainInteriorItem | null>(null);
  const [roomType, setRoomType] = useState("Living Room");
  const [style, setStyle] = useState("Modern Japandi");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<DesainInteriorItem | null>(null);

  const fetchInteriors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApiData<DesainInteriorItem[]>("/desain-interiors");
      setInteriors(response || []);
    } catch (err: unknown) {
      console.warn("Gagal memuat katalog interior:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchInteriors();
  }, [fetchInteriors]);

  const handleOpenModal = (item?: DesainInteriorItem) => {
    if (item) {
      setEditingItem(item);
      setRoomType(item.roomType);
      setStyle(item.style);
      setDescription(item.description || "");
      setImageUrl(item.imageUrl);
    } else {
      setEditingItem(null);
      setRoomType("Living Room");
      setStyle("Modern Japandi");
      setDescription("");
      setImageUrl("");
    }
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Harap unggah foto konsep desain interior.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        roomType,
        style,
        description: description || undefined,
        imageUrl,
      };

      if (editingItem) {
        await api.put(`/desain-interiors/${editingItem.id}`, payload);
      } else {
        await api.post("/desain-interiors", payload);
      }

      setModalOpen(false);
      await fetchInteriors();
    } catch (err: unknown) {
      console.warn("Gagal menyimpan desain interior:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);
    try {
      await api.delete(`/desain-interiors/${deleteCandidate.id}`);
      setDeleteCandidate(null);
      await fetchInteriors();
    } catch (err: unknown) {
      console.warn("Gagal menghapus konsep interior:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const roomCategories = [
    "ALL",
    ...Array.from(new Set(interiors.map((i) => i.roomType))),
  ];

  const filteredInteriors = interiors.filter((item) => {
    const matchesRoom = roomFilter === "ALL" || item.roomType === roomFilter;
    const query = search.toLowerCase();
    const matchesSearch =
      item.roomType.toLowerCase().includes(query) ||
      item.style.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query));
    return matchesRoom && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#0A1E2F]">
            Katalog Desain Interior & Furniture
          </h1>
          <p className="mt-1 text-xs text-[#526474]">
            Kelola portofolio konsep ruangan, kitchen set kustom, dan pilihan gaya interior KilauBuild.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => void fetchInteriors()}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#CBD8DF] bg-white text-[#526474] hover:bg-[#F4F7F8]"
            title="Muat ulang data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-[#005592]" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#005592] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0066AE]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Tambah Konsep Interior</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#CBD8DF] bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {roomCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setRoomFilter(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-colors ${
                roomFilter === cat
                  ? "bg-[#005592] text-white"
                  : "bg-[#F4F7F8] text-[#526474] hover:bg-[#EAF3F8]"
              }`}
            >
              {cat === "ALL" ? "Semua Ruangan" : cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari gaya, ruangan, konsep..."
            className="w-full rounded-xl border border-[#CBD8DF] bg-[#F8FAFB] py-2 pl-9 pr-4 text-xs font-medium text-[#0A1E2F] placeholder-[#8A9BA8] transition-colors focus:border-[#005592] focus:bg-white focus:outline-none"
          />
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[#8A9BA8]" />
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-16 text-center text-xs text-[#71818D]">
            Memuat konsep desain interior...
          </div>
        ) : filteredInteriors.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#71818D]">
            Belum ada katalog interior yang sesuai. Klik "Tambah Konsep Interior" untuk mulai.
          </div>
        ) : (
          filteredInteriors.map((item) => {
            const imgSrc = resolveMediaUrl(item.imageUrl);
            return (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#CBD8DF] bg-white shadow-xs transition-all hover:border-[#005592]/40 hover:shadow-md"
              >
                <div className="relative h-48 w-full bg-[#F4F7F8]">
                  <Image
                    src={imgSrc}
                    alt={item.roomType}
                    fill
                    sizes="(max-width: 768px) 100vw, 350px"
                    className="object-cover"
                  />
                  <div className="absolute left-3 top-3 rounded-lg bg-[#004475] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xs">
                    {item.roomType}
                  </div>
                  <div className="absolute right-3 top-3 rounded-lg bg-white/95 px-2 py-0.5 text-[10px] font-bold text-[#005592] shadow-xs backdrop-blur-xs">
                    {item.style}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0A1E2F]">
                      <Sparkles className="h-3.5 w-3.5 text-[#005592]" />
                      <span>{item.roomType} — {item.style}</span>
                    </div>

                    {item.description && (
                      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#71818D]">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-1.5 border-t border-[#E1E9ED] pt-3">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-[#526474] hover:bg-[#EAF3F8] hover:text-[#005592]"
                      title="Edit Konsep"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteCandidate(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#CBD8DF] text-red-500 hover:bg-red-50"
                      title="Hapus Konsep"
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

      {/* Create / Edit Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? "Edit Konsep Interior" : "Tambah Konsep Desain Interior"}
        description="Perkaya galeri inspirasi desain interior dan custom furniture untuk calon klien."
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-[#294153]">Tipe Ruangan</label>
              <input
                type="text"
                required
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                placeholder="Contoh: Living Room, Kitchen Set, Bedroom"
                className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-[#294153]">Gaya Desain</label>
              <input
                type="text"
                required
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Contoh: Modern Japandi, Minimalis, Industrial"
                className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Deskripsi Konsep</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan aksen pencahayaan, material HPL/kayu, dan penataan ruang..."
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <MediaUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            label="Foto Konsep / Hasil Pengerjaan Interior"
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
              {submitting ? "Menyimpan..." : "Simpan Konsep"}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <AdminModal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          title="Konfirmasi Hapus Konsep Interior"
          description="Foto dan data konsep ini akan dihapus dari katalog publik."
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#526474]">
              Apakah Anda yakin ingin menghapus konsep{" "}
              <strong className="text-[#0A1E2F]">
                {deleteCandidate.roomType} ({deleteCandidate.style})
              </strong>?
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
