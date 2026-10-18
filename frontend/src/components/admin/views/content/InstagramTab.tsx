"use client";

import { useState } from "react";
import Image from "next/image";
import { PlusCircle, Trash2 } from "lucide-react";
import api, { resolveMediaUrl } from "@/lib/api";
import { AdminModal } from "../../AdminModal";
import { MediaUploader } from "../../MediaUploader";
import type { InstagramPostItem } from "../../admin.types";

interface InstagramTabProps {
  posts: InstagramPostItem[];
  loading: boolean;
  onRefresh: () => Promise<void>;
}

export const InstagramTab = ({ posts, loading, onRefresh }: InstagramTabProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [postUrl, setPostUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");

  const [deleteCandidate, setDeleteCandidate] = useState<InstagramPostItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOpenModal = () => {
    setPostUrl("");
    setImageUrl("");
    setCaption("");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        postUrl,
        imageUrl,
        caption: caption || undefined,
      };

      await api.post("/instagram-posts", payload);
      setModalOpen(false);
      await onRefresh();
    } catch (err: unknown) {
      console.warn("Gagal menyimpan postingan Instagram:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteCandidate) return;
    setSubmitting(true);
    try {
      await api.delete(`/instagram-posts/${deleteCandidate.id}`);
      setDeleteCandidate(null);
      await onRefresh();
    } catch (err: unknown) {
      console.warn("Gagal menghapus postingan Instagram:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleOpenModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#005592] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0066AE]"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Tambah Feed IG</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16 text-center text-xs text-[#71818D]">
          Memuat data feed Instagram...
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center text-xs text-[#71818D]">
          Belum ada postingan Instagram tersimpan.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#CBD8DF] bg-white shadow-xs"
            >
              <div className="relative h-44 w-full bg-[#F4F7F8]">
                <Image
                  src={resolveMediaUrl(post.imageUrl)}
                  alt="IG Feed"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-3">
                <p className="line-clamp-2 text-xs text-[#526474]">
                  {post.caption || "Postingan Instagram"}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-[#E1E9ED] pt-2">
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-[#005592] hover:underline"
                  >
                    Buka Link IG
                  </a>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(post)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                    title="Hapus Feed IG"
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
        title="Tambah Postingan Instagram"
        maxWidth="md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">URL Link Postingan Instagram</label>
            <input
              type="url"
              required
              value={postUrl}
              onChange={(e) => setPostUrl(e.target.value)}
              placeholder="https://instagram.com/p/..."
              className="w-full rounded-xl border border-[#CBD8DF] px-3.5 py-2 text-xs text-[#0A1E2F] focus:border-[#005592] focus:outline-none"
            />
          </div>

          <MediaUploader
            value={imageUrl}
            onChange={(url) => setImageUrl(url)}
            label="Foto Feed Instagram"
          />

          <div>
            <label className="mb-1 block text-xs font-bold text-[#294153]">Caption Singkat</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Keterangan singkat postingan"
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
              Simpan Postingan
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <AdminModal
          isOpen={Boolean(deleteCandidate)}
          onClose={() => setDeleteCandidate(null)}
          title="Konfirmasi Hapus Feed IG"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-[#526474]">
              Apakah Anda yakin ingin menghapus postingan Instagram ini?
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
