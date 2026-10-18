"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api, { getApiData } from "@/lib/api";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ChangePasswordModal } from "@/components/admin/ChangePasswordModal";
import { BookingsView } from "@/components/admin/views/BookingsView";
import { ContactsView } from "@/components/admin/views/ContactsView";
import { ContentView } from "@/components/admin/views/ContentView";
import { InteriorView } from "@/components/admin/views/InteriorView";
import { OverviewView } from "@/components/admin/views/OverviewView";
import { ProjectsView } from "@/components/admin/views/ProjectsView";
import type {
  AdminNavSection,
  AdminUser,
  DashboardOverviewData,
  RecentBooking,
} from "@/components/admin/admin.types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activeSection, setActiveSection] = useState<AdminNavSection>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [data, setData] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getApiData<DashboardOverviewData>("/dashboard/overview");
      setData(response);
    } catch (err: unknown) {
      console.warn("Gagal memuat ringkasan dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("kilaubuild_token");
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    const storedUser = localStorage.getItem("kilaubuild_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AdminUser);
      } catch (err: unknown) {
        console.warn("Gagal parse data user:", err);
      }
    }

    void fetchDashboard();
  }, [fetchDashboard, router]);

  const handleUpdateBookingStatus = async (
    bookingId: string,
    newStatus: RecentBooking["status"],
  ) => {
    setUpdatingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      await fetchDashboard();
    } catch (err: unknown) {
      console.warn("Gagal update status booking:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleMarkContactRead = async (contactId: string) => {
    setUpdatingId(contactId);
    try {
      await api.patch(`/contacts/${contactId}/read`);
      await fetchDashboard();
    } catch (err: unknown) {
      console.warn("Gagal menandai pesan:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kilaubuild_token");
    localStorage.removeItem("kilaubuild_user");
    window.location.href = "/admin/login";
  };

  const badges = {
    pendingBookings: data?.metrics.pendingBookings,
    unreadContacts: data?.metrics.unreadContacts,
    totalProjects:
      (data?.metrics.totalProjectsDone || 0) +
      (data?.metrics.totalOngoingProjects || 0),
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#0A1E2F]">
      {/* Sidebar Navigation with Jiron-style Profile at Bottom */}
      <AdminSidebar
        user={user}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenChangePassword={() => setChangePasswordOpen(true)}
        onLogout={handleLogout}
        badges={badges}
      />

      {/* Main Layout Area */}
      <div className="flex flex-col lg:pl-64">
        {/* Top Header with Clean Minimalist Utility Icons */}
        <AdminHeader
          activeSection={activeSection}
          onOpenChangePassword={() => setChangePasswordOpen(true)}
          onLogout={handleLogout}
          onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        />

        {/* View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeSection === "overview" && (
            <OverviewView
              user={user}
              data={data}
              loading={loading}
              onNavigate={setActiveSection}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onMarkContactRead={handleMarkContactRead}
              updatingId={updatingId}
            />
          )}

          {activeSection === "projects" && (
            <ProjectsView onRefreshStats={fetchDashboard} />
          )}

          {activeSection === "interior" && <InteriorView />}

          {activeSection === "bookings" && (
            <BookingsView onRefreshStats={fetchDashboard} />
          )}

          {activeSection === "contacts" && (
            <ContactsView onRefreshStats={fetchDashboard} />
          )}

          {activeSection === "content" && <ContentView />}
        </main>
      </div>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </div>
  );
}
