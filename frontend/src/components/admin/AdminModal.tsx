"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const maxWidthMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-xl",
  xl: "max-w-2xl",
  "2xl": "max-w-4xl",
};

export const AdminModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
}: AdminModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={`relative z-10 flex max-h-[90vh] w-full ${maxWidthMap[maxWidth]} flex-col overflow-hidden rounded-2xl border border-[#CBD8DF] bg-white shadow-2xl animate-in fade-in-50 zoom-in-95`}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#CBD8DF] px-6 py-5">
          <div>
            <h3 id="modal-title" className="text-lg font-bold text-[#0A1E2F]">
              {title}
            </h3>
            {description && (
              <p className="mt-1 text-xs text-[#526474]">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#526474] transition-colors hover:bg-[#F4F7F8] hover:text-[#0A1E2F]"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 text-sm text-[#294153]">
          {children}
        </div>
      </div>
    </div>
  );
};
