# KilauBuild — Modern Design System & Brand Tokens

Dokumen ini mendokumentasikan sistem desain, token warna, tipografi, komponen UI, dan aset visual resmi **KilauBuild** yang diterapkan secara aktif pada aplikasi (Next.js 16 + Tailwind CSS v4).

---

## 1. Brand Identity & Filosofi Desain

* **Nama Brand**: KilauBuild
* **Tagline Utama**: *"Bangun Dulu Baru Bayar"*
* **Sub-tagline Editorial**: *"Rumah bagus. Proses jelas. Bangun rumah, lebih tenang."*
* **Karakter Visual**: Architectural, Editorial Minimalist, Transparan, Presisi, dan Terpercaya.
* **Kontak Resmi**:
  * WhatsApp: `+62 877-7636-0795`
  * Email: `kilaubuild@gmail.com`
  * Lokasi Workshop: `Jl. Raya Citayam No.34, Pd. Jaya, Kec. Cipayung, Kota Depok, Jawa Barat 16444`

---

## 2. Tipografi Resmi (Typography)

Seluruh sistem tipografi KilauBuild telah distandarisasi untuk keseragaman estetika editorial modern:

| Role | Font Family | Weights | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Primary Headings** | `Poppins`, sans-serif | `600`, `700`, `800` | Judul hero, section headings, judul kartu, modal |
| **Body & Paragraphs** | `Poppins`, sans-serif | `400`, `500` | Teks paragraf, deskripsi layanan, subtitle, input form |
| **Numeric & Metrics** | `Poppins`, sans-serif | `600`, `700` (`tabular-nums`) | Statistik angka (150+, 98%), tanggal, nomor langkah (01, 02) |
| **Editorial Accent** | `Georgia`, serif | `italic`, `400` | Kata penekanan artistik di hero/subjudul (misal: *jelas.*, *tenang.*) |

### Variabel CSS Tipografi (`globals.css`):
```css
--font-heading: var(--font-poppins), system-ui, sans-serif;
--font-sans: var(--font-poppins), system-ui, sans-serif;
--font-numeric: var(--font-poppins), sans-serif;
--font-editorial: Georgia, Cambria, "Times New Roman", Times, serif;
--font-serif: Georgia, Cambria, "Times New Roman", Times, serif;
```

---

## 3. Color Tokens & Palette

Sistem warna menggunakan kombinasi warna biru arsitektural (*Deep Sapphire*), aksen langit (*Sky Blue*), dan kertas arsitek (*Paper*):

### A. Brand Colors
| Token Name | Hex Code | Utility Class | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Brand Primary** | `#005592` | `bg-[#005592]`, `text-[#005592]` | Primary button, sidebar active, header accent, icon highlight |
| **Brand Hover** | `#0066AE` | `hover:bg-[#0066AE]` | Hover state pada tombol dan link navigasi |
| **Brand Accent** | `#66B2E0` | `text-[#66B2E0]`, `bg-[#66B2E0]` | Focus ring outline, badge chip, micro-detail |
| **Brand Dark / Navy** | `#004475` | `bg-[#004475]` | Dark section background, footer deep contrast |
| **Brand Soft Tint** | `#EBF4FA` | `bg-[#EBF4FA]` | Background kartu metrik, container inset foto, badge |
| **Brand Light Tint** | `#E3F2FD` | `bg-[#E3F2FD]` | Highlight card selang-seling, subtle state |

### B. Neutral & Ink (Teks & Garis)
| Token Name | Hex Code | Utility Class | Penggunaan |
| :--- | :--- | :--- | :--- |
| **Ink (Deep Text)** | `#0A1E2F` | `text-[#0A1E2F]` | Teks heading utama, judul tebal, label formulir aktif |
| **Ink Muted** | `#526474` | `text-[#526474]` | Teks deskripsi, paragraf, subtitle, tanggal |
| **Ink Subtle** | `#41596B` | `text-[#41596B]` | Teks placeholder, label sekunder |
| **Paper Background** | `#F4F7F8` | `bg-[#F4F7F8]` | Latar belakang dasar halaman publik (body) |
| **Paper Admin** | `#F7F9FB` | `bg-[#F7F9FB]` | Latar belakang layout dashboard CMS |
| **Paper Blue Surface** | `#EAF3F8` | `bg-[#EAF3F8]` | Background badge, kartu ulasan, avatar icon circle |
| **Line / Border Muted**| `#CBD8DF` | `border-[#CBD8DF]` | Garis pemisah section, border kartu, table divider |
| **Line Strong** | `#9DB3BF` | `border-[#9DB3BF]` | Border tombol sekunder, garis grid arsitektur |

### C. Semantic & Status
| Status | Background | Text | Border | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Success / Done** | `#ECFDF5` | `#059669` | `#A7F3D0` | Status proyek Selesai, Booking Dikonfirmasi |
| **Warning / Pending** | `#FFFBEB` | `#D97706` | `#FDE68A` | Status Booking Pending, Menunggu Konfirmasi |
| **Danger / Cancelled**| `#FEF2F2` | `#DC2626` | `#FECACA` | Status Booking Dibatalkan, Penanda Hari Minggu |

---

## 4. Standar Komponen UI (Component Standards)

### A. Tombol (Pill Aesthetics)
Semua tombol aksi utama menggunakan gaya **Pill Capsule** (`rounded-full` / `border-radius: 9999px`) dengan transisi halus:
* **Primary Button**: `bg-[#005592] hover:bg-[#0066AE] text-white rounded-full min-h-[44px] sm:min-h-[48px] px-5 sm:px-6 shadow-xs`
* **Secondary Outline Button**: `border border-[#CBD8DF] bg-white hover:bg-[#F8FBFD] text-[#0A1E2F] rounded-full`
* **Icon Pill CTA**: Tombol aksi dengan circular micro-icon container di sebelah kanan yang bergerak sedikit saat hover:
  ```tsx
  <a className="group flex min-h-11 items-center justify-between rounded-full bg-[#005592] py-1.5 pl-5 pr-2 text-xs font-bold text-white transition-all hover:bg-[#0066AE]">
    <span>Jadwalkan Survey</span>
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform group-hover:translate-x-0.5">
      <ArrowUpRight size={14} weight="bold" />
    </span>
  </a>
  ```

### B. Form Inputs (`.form-field`)
* **Ukuran Font Minimum**: `1rem` (16px) untuk mencegah auto-zoom pada browser iOS Safari / mobile.
* **Border & Focus**: Border default `#B8C7CF`, saat focus berubah menjadi border `#005592` dengan glow ring `box-shadow: 0 0 0 3px rgba(0, 85, 146, 0.18)`.
* **Border Radius**: `0.75rem` (12px).

### C. Kalender Booking Survey
* Menggunakan `react-day-picker` yang disesuaikan secara visual.
* **Hari Minggu**: Diberi penanda warna merah khusus (`#DC2626` font-semibold) untuk membedakan hari libur operasional tukang namun tetap dapat dipilih untuk survey.
* **Tanggal Terpilih**: Lingkaran penuh berwarna `#005592` dengan teks putih.

### D. Architectural Grid Background (`.site-grid`)
Garis arsitektur tipis 64px (`4rem`) transparan pada beberapa section untuk memperkuat citra kontraktor teknis:
```css
.site-grid {
  background-image:
    linear-gradient(to right, rgba(0, 85, 146, 0.055) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 85, 146, 0.055) 1px, transparent 1px);
  background-size: 4rem 4rem;
}
```

---

## 5. UI Assets & Media Directory

Semua asset visual yang digunakan aktif oleh website disimpan di:
* **Foto Screenshot Hero Section**: `docs/assets/hero-section.png` (digunakan di `README.md`).
* **Logo Resmi**: `frontend/public/logo.png`, `frontend/public/logo-kilau-build.jpg`.
* **Hero Banner Asli**: `frontend/public/headerhompage.png`, `header.png`, `header-hk.png`.
* **Dokumentasi Proyek Lapangan**:
  * `frontend/public/uploads/project_done/` (Portofolio selesai).
  * `frontend/public/uploads/ongoing_project/` (Proyek berjalan).
  * `frontend/public/uploads/design_interior/` (Katalog interior).
  * `frontend/public/uploads/instagram_posts/` (Dokumentasi sosial media).
* **Ikon Layanan Publik**:
  * `frontend/public/bangun dari 0.png`
  * `frontend/public/renovasi.png`
  * `frontend/public/design.png`
  * `frontend/public/house design.png`

---

## 6. Layout Shell & Responsive Breakpoints

* **Mobile First**: Navbar ringkas 72px dengan tombol menu slide-in dan drawer booking instan.
* **Desktop (lg >= 1024px)**:
  * Sidebar tetap di sebelah kiri (`w-[244px]` fixed) dengan navigasi vertikal bernomor (`01 Beranda`, `02 Tentang kami`, dll.) dan micro-info lokasi Depok.
  * Area konten utama otomatis menggeser margin kiri (`lg:pl-[244px]`).
* **Container Max Width**: `site-shell` selebar `min(100% - 2rem, 82rem)` (~1312px).
