# KilauBuild Design System & Brand Tokens

Dokumen ini mendokumentasikan sistem desain, token warna, tipografi, dan aset visual resmi dari KilauBuild yang diekstraksi dari desain aslinya.

---

## 1. Brand Identity & Tagline
- **Nama Brand**: KilauBuild
- **Tagline Utama**: *"Bangun Dulu Baru Bayar"*
- **Sub-tagline**: *"Solusi terbaik untuk membangun atau merenovasi rumah impian anda"*
- **Official Contact**:
  - WhatsApp / Telp: `+62 877-7636-0795`
  - Email: `kilaubuild@gmail.com`
  - Lokasi: `Jl. Raya Citayam No.34, RT./Rw.001/004, Pd. Jaya, Kec. Cipayung, Kota Depok, Jawa Barat 16444`

---

## 2. Color Palette (Tailwind & CSS Tokens)

| Token Name | Hex Code | Penggunaan |
| :--- | :--- | :--- |
| **Brand Primary** | `#005592` | Warna dominan navbar, footer, primary buttons, gradients hero |
| **Brand Primary Hover** | `#0066AE` | Hover state button, link aktif |
| **Brand Accent (Light)** | `#66B2E0` | CTA button ("Hubungi Kami"), badge highlight, border aksen |
| **Brand Dark / Navy** | `#004475` | Dark section, deep contrast backgrounds |
| **Soft Blue Background** | `#EBF4FA` / `#E3F2FD` | Background card statistik, testimonial highlight card |
| **Text Dark** | `#111827` (Gray-900) | Teks heading, paragraf gelap |
| **Text Muted** | `#4B5563` (Gray-600) | Subtitle, meta info, label formulir |
| **Card / Surface Light**| `#FFFFFF` | Background utama container & kartu |
| **Border Muted** | `#E5E7EB` (Gray-200) | Garis pemisah tabel, border card, input focus |

### Instagram Feed Gradient:
- `linear-gradient(45deg, #833AB4, #FD1D1D, #F77737)`

---

## 3. Typography
- **Heading / Titles**: `Roboto`, `Plus Jakarta Sans`, atau `Outfit` (`font-semibold` / `font-bold`).
- **Body / Paragraphs**: `Inter`, sans-serif (`font-normal` / `font-light`).

---

## 4. Brand & UI Assets (Tersimpan di `_backup_data/`)
Semua aset asli sudah diekstrak dan siap di-import ke Next.js (`frontend/public/`):
- Logo: `_backup_data/brand_assets/logo.png`, `logo-kilau-build.jpg`
- Hero Headers: `header.png`, `headerhompage.png`, `header-hk.png`, `header-kb.png`, `header-lk.png`
- Layanan & Konstruksi:
  - `bangun dari 0.png`
  - `renovasi.png`
  - `design.png`
  - `house design.png`
  - `on going project.png`
- Founder / Team: `owner.jpeg`
- Ilustrasi & Login: `bgadminlogin.jpg`, `lokasi.jpg`, `kilauTips1.png`
