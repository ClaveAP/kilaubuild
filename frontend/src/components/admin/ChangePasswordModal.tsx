"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound, Loader2, Lock } from "lucide-react";
import api from "@/lib/api";
import { AdminModal } from "./AdminModal";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
}: ChangePasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validatePasswordPolicy = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return "Kata sandi baru minimal 8 karakter.";
    }
    if (!/[A-Z]/.test(pwd)) {
      return "Kata sandi baru wajib mengandung minimal 1 huruf kapital (A-Z).";
    }
    if (!/[a-z]/.test(pwd)) {
      return "Kata sandi baru wajib mengandung minimal 1 huruf kecil (a-z).";
    }
    if (!/\d/.test(pwd)) {
      return "Kata sandi baru wajib mengandung minimal 1 angka (0-9).";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd)) {
      return "Kata sandi baru wajib mengandung minimal 1 simbol / karakter unik (!@#$%^&*).";
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const policyError = validatePasswordPolicy(newPassword);
    if (policyError) {
      setError(policyError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (oldPassword === newPassword) {
      setError("Kata sandi baru tidak boleh sama dengan kata sandi lama.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: unknown) {
      const apiErr = err as { message?: string | string[]; error?: string };
      const msg = Array.isArray(apiErr.message)
        ? apiErr.message.join(", ")
        : apiErr.message || "Gagal memperbarui kata sandi. Periksa kata sandi lama Anda.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Perbarui Kata Sandi Admin"
      description="Pastikan akun internal KilauBuild terlindungi dengan kata sandi yang kuat."
      maxWidth="md"
    >
      {success ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="mt-3 text-base font-bold text-[#0A1E2F]">
            Kata Sandi Berhasil Diperbarui
          </h4>
          <p className="mt-1 text-xs text-[#526474]">
            Gunakan kata sandi baru untuk login berikutnya.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="old-password"
              className="mb-1.5 block text-xs font-bold text-[#294153]"
            >
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                id="old-password"
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
                className="w-full rounded-xl border border-[#CBD8DF] bg-white px-3.5 py-2.5 pl-10 text-xs font-medium text-[#0A1E2F] transition-colors focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20"
              />
              <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#71818D]" />
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="mb-1.5 block text-xs font-bold text-[#294153]"
            >
              Kata Sandi Baru (Min. 8 Karakter)
            </label>
            <div className="relative">
              <input
                id="new-password"
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 8 karakter, huruf besar & simbol"
                className="w-full rounded-xl border border-[#CBD8DF] bg-white px-3.5 py-2.5 pl-10 text-xs font-medium text-[#0A1E2F] transition-colors focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20"
              />
              <KeyRound className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#71818D]" />
            </div>
            <p className="mt-1 text-[10px] text-[#71818D]">
              Wajib minimal 8 karakter dengan kombinasi huruf besar (A-Z), huruf kecil (a-z), angka (0-9), dan simbol (!@#$%^&*).
            </p>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="mb-1.5 block text-xs font-bold text-[#294153]"
            >
              Konfirmasi Kata Sandi Baru
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full rounded-xl border border-[#CBD8DF] bg-white px-3.5 py-2.5 pl-10 text-xs font-medium text-[#0A1E2F] transition-colors focus:border-[#005592] focus:outline-none focus:ring-2 focus:ring-[#005592]/20"
              />
              <KeyRound className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-[#71818D]" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-xl border border-[#CBD8DF] px-4 py-2.5 text-xs font-bold text-[#526474] hover:bg-[#F4F7F8]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-[#005592] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#0066AE] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>Simpan Kata Sandi</span>
            </button>
          </div>
        </form>
      )}
    </AdminModal>
  );
};
