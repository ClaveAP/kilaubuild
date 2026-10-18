# KilauBuild CMS Dashboard Redesign & Full CRUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the KilauBuild admin dashboard from an AI-slop single page into an authentic, premium contractor CMS dashboard with a responsive sidebar, clean topbar profile dropdown, and complete CRUD capabilities for all business entities.

**Architecture:** A modular React component structure with an application shell (sidebar + header), shared modal and media uploader primitives, and domain-specific view modules that bind to existing NestJS REST API endpoints via the centralized Axios client.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript Strict, Tailwind CSS v4, Lucide Icons, Axios.

**Spec:** `docs/superpowers/specs/2026-10-17-cms-dashboard-redesign-design.md`

## Global Constraints
- Primary Brand Blue: `#005592`, Primary Hover: `#0066AE`, Dark Navy: `#004475`, Soft Blue: `#EAF3F8`.
- Strict TypeScript: No `any` types; all API payload interfaces and state explicitly defined.
- Zero AI-slop: No exaggerated italic-serif titles, no chunky all-in-one pill headers, no pulsing fake dots.
- Preserve existing working auth session tokens (`kilaubuild_token` and `kilaubuild_user` in `localStorage`).
- Ensure all responsive states (mobile drawer toggle + desktop fixed sidebar) work seamlessly.

---

### Task 1: Admin Shell — Header with Clean Profile Dropdown & Sidebar Navigation
**Files:**
- Create: `frontend/src/components/admin/AdminHeader.tsx`
- Create: `frontend/src/components/admin/AdminSidebar.tsx`
- Create: `frontend/src/components/admin/admin.types.ts`

**Interfaces:**
- `AdminNavSection`: `'overview' | 'projects' | 'interior' | 'bookings' | 'contacts' | 'content'`
- `AdminUser`: `{ id: string; name: string; email: string; role: string; }`
- `AdminHeaderProps`: `{ user: AdminUser | null; activeSection: AdminNavSection; onOpenChangePassword: () => void; onLogout: () => void; onToggleMobileSidebar: () => void; onRefresh: () => void; isRefreshing: boolean; }`
- `AdminSidebarProps`: `{ activeSection: AdminNavSection; onSelectSection: (section: AdminNavSection) => void; isMobileOpen: boolean; onCloseMobile: () => void; badges?: { pendingBookings?: number; unreadContacts?: number; totalProjects?: number; }; }`

- [ ] **Step 1: Create type definitions** in `frontend/src/components/admin/admin.types.ts`.
- [ ] **Step 2: Create AdminHeader** with breadcrumbs, public site link, and profile avatar dropdown menu (with name, email, role badge, change password button, and red subtle logout button).
- [ ] **Step 3: Create AdminSidebar** with logo, navigation links, count badges, and responsive backdrop for mobile view.
- [ ] **Step 4: Typecheck frontend** with local tsc binary to ensure types compile.

---

### Task 2: Shared CMS Utilities — Modal, Password Changer & Media Uploader
**Files:**
- Create: `frontend/src/components/admin/AdminModal.tsx`
- Create: `frontend/src/components/admin/ChangePasswordModal.tsx`
- Create: `frontend/src/components/admin/MediaUploader.tsx`

**Interfaces:**
- `AdminModalProps`: `{ isOpen: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'; }`
- `ChangePasswordModalProps`: `{ isOpen: boolean; onClose: () => void; }`
- `MediaUploaderProps`: `{ value?: string | null; onChange: (url: string) => void; label?: string; }`

- [ ] **Step 1: Implement AdminModal** with accessible dialog semantics, ESC listener, backdrop blur, and scroll lock.
- [ ] **Step 2: Implement MediaUploader** connecting to `POST /media/upload` via `FormData` with image preview, remove action, and 5MB size limit.
- [ ] **Step 3: Implement ChangePasswordModal** connecting to `POST /auth/change-password` with old password, new password, validation, and error alert.
- [ ] **Step 4: Verify with tsc**.

---

### Task 3: Overview View — Operational Metric Cards & Quick Action Hub
**Files:**
- Create: `frontend/src/components/admin/views/OverviewView.tsx`

**Interfaces:**
- `OverviewViewProps`: `{ data: DashboardOverviewData | null; loading: boolean; onNavigate: (section: AdminNavSection) => void; onUpdateBookingStatus: (id: string, status: BookingStatus) => Promise<void>; onMarkContactRead: (id: string) => Promise<void>; }`

- [ ] **Step 1: Implement OverviewView** with:
  - 4 high-end metric cards (Booking Survey, Pesan Masuk, Proyek Selesai, Proyek Berjalan) with clean typography.
  - Action banner shortcuts ("Tambah Proyek", "Tambah Interior", "Kelola Survey").
  - Latest 5 bookings preview table with WhatsApp link and status changer.
  - Latest 5 contacts preview table with mark as read button.
- [ ] **Step 2: Verify with tsc**.

---

### Task 4: Bookings & Contacts Management Views
**Files:**
- Create: `frontend/src/components/admin/views/BookingsView.tsx`
- Create: `frontend/src/components/admin/views/ContactsView.tsx`

**Interfaces:**
- `BookingsViewProps`: `{ onRefreshStats: () => void; }`
- `ContactsViewProps`: `{ onRefreshStats: () => void; }`

- [ ] **Step 1: Implement BookingsView** with:
  - Status filters (`Semua`, `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`).
  - Search input for client name, phone, and service type.
  - Table with client info, booking date, time slot, location, WhatsApp direct button.
  - Status dropdown selector directly patching `PATCH /bookings/:id/status`.
- [ ] **Step 2: Implement ContactsView** with:
  - Read filter (`Semua`, `Belum Dibaca`, `Sudah Dibaca`).
  - View full message detail modal.
  - Actions to mark as read (`PATCH /contacts/:id/read`) and delete (`DELETE /contacts/:id`).
- [ ] **Step 3: Verify with tsc**.

---

### Task 5: Projects View — Proyek Selesai (with Gallery) & Proyek Berjalan (with Progress %)
**Files:**
- Create: `frontend/src/components/admin/views/ProjectsView.tsx`

**Interfaces:**
- `ProjectsViewProps`: `{ onRefreshStats: () => void; }`

- [ ] **Step 1: Implement ProjectsView** with sub-tabs: "Proyek Selesai (Portofolio)" & "Proyek Sedang Berjalan".
- [ ] **Step 2: Build Proyek Selesai CRUD**:
  - List with cover image, category badge, budget range, completion date.
  - Create / Edit modal with title, category, budget, date, description, cover image upload via `MediaUploader`.
  - Delete action with confirmation.
- [ ] **Step 3: Build Proyek Berjalan CRUD**:
  - List with title, location, progress percentage visual indicator (e.g. 75%), description, image.
  - Create / Edit modal with title, location, progress percentage slider/number input (0-100), image upload.
  - Delete action with confirmation.
- [ ] **Step 4: Verify with tsc**.

---

### Task 6: Interior View — Desain Interior & Custom Furniture Catalog
**Files:**
- Create: `frontend/src/components/admin/views/InteriorView.tsx`

**Interfaces:**
- `InteriorViewProps`: `{}`

- [ ] **Step 1: Implement InteriorView** with:
  - Grid card list of interior concepts (room type, style, image, description).
  - Room type filter (Living Room, Kitchen Set, Bedroom, dll.).
  - Create / Edit modal connecting to `POST/PATCH /desain-interiors`.
  - Delete confirmation connecting to `DELETE /desain-interiors/:id`.
- [ ] **Step 2: Verify with tsc**.

---

### Task 7: Content View — Testimonials, FAQs, Counter Stats & Instagram Feed
**Files:**
- Create: `frontend/src/components/admin/views/ContentView.tsx`

**Interfaces:**
- `ContentViewProps`: `{}`

- [ ] **Step 1: Implement ContentView** with 4 tabs: "Testimoni", "FAQ", "Statistik", "Instagram Feed".
- [ ] **Step 2: Testimoni CRUD**: Client name, project type, review, rating (1-5 stars), photo.
- [ ] **Step 3: FAQ CRUD**: Question, answer, order number, active/inactive toggle switch.
- [ ] **Step 4: Statistik Counter CRUD**: Title, value, unit, display order.
- [ ] **Step 5: Instagram Feed CRUD**: Post URL, Image URL, caption.
- [ ] **Step 6: Verify with tsc**.

---

### Task 8: Main Dashboard Page Integration & Final Polish
**Files:**
- Modify: `frontend/src/app/admin/dashboard/page.tsx`

- [ ] **Step 1: Refactor `page.tsx`** to orchestrate:
  - Auth token verification and redirect to `/admin/login` if unauthenticated.
  - Global overview metrics fetch.
  - `AdminSidebar` + `AdminHeader` layout shell.
  - Active view rendering based on state (`overview`, `projects`, `interior`, `bookings`, `contacts`, `content`).
  - `ChangePasswordModal` state integration.
  - Refresh handling across all subviews.
- [ ] **Step 2: Run full TypeScript compilation** (`./frontend/node_modules/.bin/tsc --project frontend/tsconfig.json --noEmit`).
- [ ] **Step 3: Verify frontend build** (`npm --prefix frontend run build`).
- [ ] **Step 4: Test in browser** to confirm high-end aesthetics, no visual slop, and smooth user experience.
