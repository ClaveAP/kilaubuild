"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  CalendarCheck,
  ChevronDown,
  FolderKanban,
  KeyRound,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Shield,
  X,
} from "lucide-react";
import type { AdminNavSection, AdminUser } from "./admin.types";

interface AdminSidebarProps {
  user: AdminUser | null;
  activeSection: AdminNavSection;
  onSelectSection: (section: AdminNavSection) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenChangePassword: () => void;
  onLogout: () => void;
  badges?: {
    pendingBookings?: number;
    unreadContacts?: number;
    totalProjects?: number;
  };
}

interface NavItem {
  id: AdminNavSection;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  badgeTone?: string;
}

interface UserProfileMenuProps {
  user: AdminUser | null;
  initials: string;
  onOpenChangePassword: () => void;
  onLogout: () => void;
}

const UserProfileMenu = ({
  user,
  initials,
  onOpenChangePassword,
  onLogout,
}: UserProfileMenuProps) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <div className="relative border-t border-[#E1E9ED] p-3" ref={profileRef}>
      <button
        type="button"
        onClick={() => setProfileMenuOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl p-2 text-left transition-colors hover:bg-[#F4F7F8] focus:outline-none cursor-pointer"
        aria-expanded={profileMenuOpen}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#004475] text-xs font-bold text-white shadow-xs">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-[#0A1E2F]">
              {user?.name || "Admin"}
            </p>
            <p className="truncate text-[10px] text-[#71818D]">
              {user?.email || "admin@kilaubuild.com"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#8A9BA8] transition-transform duration-200 ${
            profileMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Profile Popover / Dropdown Menu */}
      {profileMenuOpen && (
        <div
          onMouseDown={(e) => e.stopPropagation()}
          className="absolute bottom-full left-3 right-3 mb-2 rounded-2xl border border-[#CBD8DF] bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 z-50"
        >
          <div className="rounded-xl bg-[#F8FAFB] p-3">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#005592] text-[10px] font-bold text-white">
                {initials}
              </span>
              <span className="truncate text-xs font-bold text-[#0A1E2F]">
                {user?.name || "Admin"}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-md bg-[#005592]/10 px-2 py-0.5 text-[10px] font-bold text-[#005592]">
                <Shield className="h-3 w-3" />
                {user?.role || "SUPERADMIN"}
              </span>
            </div>
          </div>

          <div className="my-1.5 border-t border-[#E1E9ED]" />

          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(false);
              onOpenChangePassword();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#294153] transition-colors hover:bg-[#EAF3F8] hover:text-[#005592] cursor-pointer"
          >
            <KeyRound className="h-4 w-4 text-[#71818D]" />
            <span>Ganti Kata Sandi</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(false);
              onLogout();
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50 cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span>Keluar Akun</span>
          </button>
        </div>
      )}
    </div>
  );
};

export const AdminSidebar = ({
  user,
  activeSection,
  onSelectSection,
  isMobileOpen,
  onCloseMobile,
  onOpenChangePassword,
  onLogout,
  badges = {},
}: AdminSidebarProps) => {

  const mainNavItems: NavItem[] = [
    {
      id: "overview",
      label: "Ringkasan",
      icon: LayoutDashboard,
    },
    {
      id: "projects",
      label: "Portofolio Proyek",
      icon: FolderKanban,
      badge: badges.totalProjects,
      badgeTone: "bg-[#EAF3F8] text-[#005592]",
    },
    {
      id: "interior",
      label: "Desain Interior",
      icon: Armchair,
    },
  ];

  const commNavItems: NavItem[] = [
    {
      id: "bookings",
      label: "Reservasi Survey",
      icon: CalendarCheck,
      badge: badges.pendingBookings,
      badgeTone: "bg-amber-100 text-amber-800 font-bold",
    },
    {
      id: "contacts",
      label: "Pesan Masuk",
      icon: MessageSquare,
      badge: badges.unreadContacts,
      badgeTone: "bg-[#005592] text-white font-bold",
    },
  ];

  const contentNavItems: NavItem[] = [
    {
      id: "content",
      label: "Konten Publik",
      icon: Layers,
    },
  ];

  const handleNavClick = (section: AdminNavSection) => {
    onSelectSection(section);
    onCloseMobile();
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "SK";

  const renderNavGroup = (items: NavItem[]) => (
    <div className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNavClick(item.id)}
            className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
              isActive
                ? "bg-[#005592] text-white shadow-xs"
                : "text-[#526474] hover:bg-[#F4F7F8] hover:text-[#0A1E2F]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? "text-white" : "text-[#71818D] group-hover:text-[#005592]"
                }`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </div>

            {item.badge !== undefined && item.badge > 0 && (
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] ${
                  isActive ? "bg-white/20 text-white" : item.badgeTone || "bg-[#EAF3F8] text-[#005592]"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col justify-between border-r border-[#E1E9ED] bg-white text-[#0A1E2F]">
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-[#E1E9ED] px-6">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
          >
            <span className="relative flex h-8 w-8 shrink-0 overflow-hidden rounded-xl bg-white shadow-xs">
              <Image src="/logo.png" alt="" fill sizes="32px" className="object-contain" />
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold tracking-[-0.03em] text-[#004475]">
                KilauBuild
              </span>
              <span className="rounded bg-[#EAF3F8] px-1.5 py-0.2 text-[9px] font-bold text-[#005592]">
                CMS
              </span>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#526474] hover:bg-[#F4F7F8] lg:hidden"
            aria-label="Tutup menu navigasi"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section Groups */}
        <div className="overflow-y-auto px-4 py-5 space-y-6">
          <div>
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8A9BA8]">
              Main
            </div>
            {renderNavGroup(mainNavItems)}
          </div>

          <div>
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8A9BA8]">
              Komunikasi
            </div>
            {renderNavGroup(commNavItems)}
          </div>

          <div>
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#8A9BA8]">
              Konten & Tampilan
            </div>
            {renderNavGroup(contentNavItems)}
          </div>
        </div>
      </div>

      {/* Jiron-Style User Profile Item at Sidebar Bottom */}
      <UserProfileMenu
        user={user}
        initials={initials}
        onOpenChangePassword={onOpenChangePassword}
        onLogout={onLogout}
      />
    </aside>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Offcanvas */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
