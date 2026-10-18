"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";
import api, { resolveMediaUrl } from "@/lib/api";

interface MediaUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

interface UploadResponse {
  message: string;
  data: {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    mimeType: string;
  };
}

export const MediaUploader = ({
  value,
  onChange,
  label = "Unggah Gambar",
  helperText = "Format JPG, PNG, atau WEBP (Maksimal 5MB)",
}: MediaUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input value so same file can be selected again if needed
    event.target.value = "";

    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran file melebihi 5MB.");
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setError("Format file tidak didukung. Harap gunakan JPG, PNG, atau WEBP.");
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<UploadResponse>("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // unwrapApiData or direct response data
      const responseData = response.data as unknown as UploadResponse["data"] | undefined;
      const uploadedUrl = responseData?.url || (response as unknown as { data?: { url?: string } })?.data?.url;

      if (uploadedUrl) {
        onChange(uploadedUrl);
      } else {
        setError("Gagal mendapatkan URL gambar dari server.");
      }
    } catch (uploadError: unknown) {
      console.warn("Upload media gagal:", uploadError);
      const apiErr = uploadError as { message?: string };
      setError(apiErr.message || "Gagal mengunggah gambar. Pastikan backend aktif.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    setError(null);
  };

  const previewUrl = value ? resolveMediaUrl(value) : null;

  return (
    <div className="w-full">
      {label && (
        <label className="mb-1.5 block text-xs font-bold text-[#294153]">
          {label}
        </label>
      )}

      {previewUrl ? (
        <div className="group relative h-48 w-full overflow-hidden rounded-xl border border-[#CBD8DF] bg-[#F4F7F8]">
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform group-hover:scale-102"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#0A1E2F] shadow-sm hover:bg-[#F4F7F8]"
            >
              <ImagePlus className="h-3.5 w-3.5 text-[#005592]" />
              Ganti
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-red-700"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#CBD8DF] bg-[#F8FAFB] px-6 py-8 text-center transition-colors hover:border-[#005592] hover:bg-[#EAF3F8]/40"
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#005592]" />
              <p className="mt-2 text-xs font-semibold text-[#005592]">Mengunggah gambar...</p>
            </div>
          ) : (
            <>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF3F8] text-[#005592]">
                <UploadCloud className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xs font-bold text-[#0A1E2F]">
                Klik untuk memilih file gambar
              </p>
              <p className="mt-1 text-[11px] text-[#71818D]">{helperText}</p>
            </>
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-xs font-semibold text-red-600">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
