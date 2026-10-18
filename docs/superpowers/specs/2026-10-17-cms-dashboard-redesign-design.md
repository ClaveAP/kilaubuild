# KilauBuild CMS Dashboard Redesign & Full CRUD Specification

## 1. Problem Statement & User Pain Points
1. **AI-Slop Header & Profile**:
   - The current admin top-right features an oversized horizontal pill wrapping an avatar `SK`, full name `Super Admin KilauBuild`, role badge `SUPERADMIN`, and email `admin@kilaubuild.com` in one bulky border.
   - The logout button sits as a high-contrast red-outlined block next to a detached refresh icon.
   - The header displays an AI-typical italic serif title ("*Operasional*") and a pseudo-realtime pulsing dot.
2. **Missing CMS Capabilities**:
   - The current dashboard only shows basic overview metrics and 2 static-like tables (Bookings and Contacts).
   - Core contractor business assets (Completed Projects with multi-photo galleries, Ongoing Projects with progress percentages, Interior Design catalogs, Testimonials, FAQs, Counter Statistics, Instagram feed, and Admin Password change) have no administrative UI despite having complete NestJS backend endpoints and Prisma models.
3. **Information Architecture**:
   - A single, monolithic vertical scroll view forces all modules into one page.
   - Needs transformation into a proper modular dashboard with a clean sidebar navigation, top bar with profile dropdown, and dedicated CRUD views for each domain.

## 2. Design System & Aesthetics (Anti-Slop & High-End)
- **Design Tokens** (per `docs/DESIGN_SYSTEM.md`):
  - Primary Brand Navy: `#004475` / Primary Brand Blue: `#005592`
  - Accent / Sky: `#66B2E0`
  - Background Shell: `#F4F7F8` (subtle warm industrial gray-blue, non-glare)
  - Card & Surfaces: `#FFFFFF` with clean 1px border `#CBD8DF` / `#E1E9ED`
  - Text: Primary `#0A1E2F` (deep navy-black), Secondary `#526474`
  - Status Tones:
    - Pending / Amber: `bg-amber-50 text-amber-800 border-amber-200`
    - Confirmed / Emerald: `bg-emerald-50 text-emerald-800 border-emerald-200`
    - Completed / Blue: `bg-blue-50 text-blue-800 border-blue-200`
    - Cancelled / Neutral: `bg-slate-100 text-slate-700 border-slate-200`
- **Typography**: Clean, sans-serif heading (`Plus Jakarta Sans` / `Inter`), strict zero italic-slop, clean tabular figures (`tabular-nums`).

## 3. Architecture & Component Decomposition
```text
frontend/src/
├── app/admin/dashboard/
│   └── page.tsx                         # Main Dashboard controller & view dispatcher
├── components/admin/
│   ├── AdminHeader.tsx                  # Topbar with breadcrumb, quick public site link, & Profile Dropdown
│   ├── AdminSidebar.tsx                 # Collapsible side navigation with icon badges & active indicators
│   ├── AdminModal.tsx                   # Accessible modal container with backdrop blur & smooth transition
│   ├── ChangePasswordModal.tsx          # Change password form modal with old & new password confirmation
│   ├── MediaUploader.tsx                # Reusable file drag-and-drop & upload widget with preview
│   └── views/
│       ├── OverviewView.tsx             # Metric counters, quick action cards, recent activity previews
│       ├── ProjectsView.tsx             # Tabs: "Proyek Selesai" (with Gallery) & "Proyek Berjalan" (Progress %)
│       ├── InteriorView.tsx             # Desain Interior & Custom Furniture catalog management
│       ├── BookingsView.tsx             # Survey consultation bookings table with status actions & WhatsApp direct
│       ├── ContactsView.tsx             # Contact form messages inbox with read/unread toggle & delete
│       └── ContentView.tsx              # Tabs: Testimoni, FAQ, Statistik Angka, Instagram Posts
```

## 4. Feature Specifications by Module

### 4.1. Header & Profile Dropdown (`AdminHeader.tsx`)
- Left: Mobile hamburger menu toggle + Breadcrumbs (e.g. `KilauBuild CMS / Portofolio Proyek`).
- Right:
  - "Lihat Web Publik" external link button.
  - Refresh Data icon button (contextual).
  - **Profile Avatar Dropdown**:
    - Compact trigger button: Avatar circle with initials, short name, chevron icon.
    - Floating popover/dropdown card (dismissible on outside click & ESC):
      - User name, email, role badge (`SUPERADMIN` / `ADMIN`).
      - Divider line.
      - "Ganti Kata Sandi" menu item (opens `ChangePasswordModal`).
      - "Keluar Akun" (Logout) item with subtle red styling.

### 4.2. Sidebar Navigation (`AdminSidebar.tsx`)
- Logo KilauBuild + "CMS Console" badge.
- Navigation Menu Items:
  1. `overview` (Ringkasan) — `LayoutDashboard`
  2. `projects` (Portofolio Proyek) — `FolderKanban` (Badge: total projects count)
  3. `interior` (Desain Interior) — `Armchair` (Badge: total interior designs)
  4. `bookings` (Reservasi Survey) — `CalendarDays` (Badge: pending bookings count in amber)
  5. `contacts` (Pesan Masuk) — `MessageSquare` (Badge: unread count in blue)
  6. `content` (Konten Publik: Testimoni, FAQ, Stats, IG) — `Layers`
- Active state: `#EAF3F8` background with `#005592` text and bold indicator bar.

### 4.3. Overview View (`OverviewView.tsx`)
- 4 Primary Stat Cards:
  - Total Booking Survey (Pending count)
  - Pesan Masuk (Unread count)
  - Proyek Selesai (Portofolio count)
  - Proyek Berjalan (On-site count)
- Quick Action shortcuts:
  - "Tambah Proyek Baru" ➔ switches to Projects view and opens Add modal
  - "Tambah Konsep Interior" ➔ switches to Interior view and opens Add modal
  - "Lihat Booking Hari Ini" ➔ switches to Bookings view
- Recent Bookings & Recent Contacts dual-column preview cards.

### 4.4. Projects View (`ProjectsView.tsx`)
- Sub-tabs: **Proyek Selesai** | **Proyek Sedang Berjalan**
- **Proyek Selesai**:
  - Grid card or table: Cover image thumbnail, title, category, budget range, completion date, gallery count.
  - CRUD operations:
    - Create / Edit modal: Title, Category, Budget Range, Completion Date, Description, Cover Image upload.
    - Delete confirmation modal.
    - Gallery management: Add additional images to `ProjectImage` table.
- **Proyek Sedang Berjalan**:
  - Cards: Title, location, progress percentage visual bar (0-100%), description, image.
  - CRUD operations:
    - Create / Edit modal: Title, Location, Progress Percentage (range slider / input 0-100), Description, Image upload.
    - Delete confirmation modal.

### 4.5. Interior View (`InteriorView.tsx`)
- Grid cards displaying room type (e.g. *Kitchen Set*, *Living Room*), interior style (e.g. *Modern Japandi*, *Minimalis*), description, image preview.
- CRUD operations:
  - Create / Edit modal: Room Type, Style, Description, Image Upload.
  - Delete confirmation modal.

### 4.6. Bookings View (`BookingsView.tsx`)
- Filter tabs: `Semua` | `Menunggu (Pending)` | `Dikonfirmasi` | `Selesai` | `Dibatalkan`.
- Search bar by client name, email, or phone.
- Data table: Client name & email, Service type & location, Booking date & time slot, WhatsApp click-to-chat button, status badge, status switcher dropdown.

### 4.7. Contacts View (`ContactsView.tsx`)
- Filter: `Semua` | `Belum Dibaca` | `Sudah Dibaca`.
- Table: Sender name & email, phone, subject, message preview, timestamp, status.
- Action: "Tandai Dibaca", "Lihat Detail Pesan", "Hapus Pesan".

### 4.8. Content View (`ContentView.tsx`)
- Sub-tabs:
  1. **Testimoni Klien**: Client name, project type, review, rating (1-5 stars), photo. Add/Edit/Delete.
  2. **FAQ**: Question, Answer, Display Order, Active/Inactive switch. Add/Edit/Delete.
  3. **Statistik Counter**: Title, value (e.g. `150+`), unit, display order. Add/Edit/Delete.
  4. **Instagram Post**: Post URL, Image URL, Caption. Add/Edit/Delete.

### 4.9. Password Change Modal (`ChangePasswordModal.tsx`)
- Fields: Current password (`oldPassword`), New password (`newPassword`), Confirm new password.
- Client-side validation: Matching passwords, minimum 6 characters.
- Calls `POST /api/v1/auth/change-password` with Bearer JWT.
- Success feedback and auto-close.

## 5. Security & Error Handling
- JWT token passed in Axios request interceptor (`Authorization: Bearer <token>`).
- If token expires (401), automatically clears localStorage and redirects to `/admin/login`.
- Optimistic feedback or clear error toasts on network/server failures.
- File upload validation (JPG, PNG, WEBP, max 5MB) matching backend multer rules.
