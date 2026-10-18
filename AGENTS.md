# AGENTS.md — Development Guidelines & Instructions for AI Agents

Selamat datang di proyek **KilauBuild**! Dokumen ini adalah panduan standar dan pedoman teknis yang **MANDATORI** dipatuhi oleh seluruh AI coding assistant (Antigravity, Cursor, Copilot, dll.) saat mengembangkan kode di repositori ini.

---

## 1. Project Context & Objectives
- **Aplikasi**: KilauBuild (Company Profile & CMS Kontraktor / Jasa Desain Interior & Arsitektur).
- **Arsitektur**: **Modular Monolith** dengan pembagian:
  - `backend/`: NestJS REST API + Prisma ORM + Swagger OpenAPI.
  - `frontend/`: Next.js (App Router) + Tailwind CSS + Modern UI components.
  - `database`: Neon Serverless PostgreSQL.
  - `docs/`: Spesifikasi lengkap (`PRD.md`, `SCHEMA.md`, `API_SPEC.md`).

---

## 2. Backend Engineering Standards (NestJS)

1. **Modular Architecture**:
   - Setiap fitur wajib dipecah menjadi modul independen di `backend/src/modules/<feature-name>/`:
     - `<feature>.module.ts`
     - `<feature>.controller.ts`
     - `<feature>.service.ts`
     - `dto/` (misal: `create-<feature>.dto.ts`, `update-<feature>.dto.ts`)
   - Modul utama: `auth`, `users`, `statistics`, `faqs`, `testimonies`, `projects`, `interior`, `contacts`, `bookings`, `media`, `dashboard`.

2. **Strict TypeScript & Zero `any`**:
   - Dilarang keras menggunakan tipe `any`. Selalu definisikan tipe DTO, interface, atau return type yang eksplisit.
   - Semua input request body wajib divalidasi dengan `class-validator` (`@IsString()`, `@IsNotEmpty()`, `@IsOptional()`, dll.) dan ditransformasi oleh `class-transformer`.

3. **Swagger OpenAPI Documentation**:
   - Seluruh Controller wajib memiliki decorator `@ApiTags('<Feature>')` dan `@ApiBearerAuth()`.
   - Setiap endpoint wajib memiliki `@ApiOperation({ summary: '...' })` dan decorator response `@ApiResponse()`.
   - Setiap properti DTO wajib memiliki `@ApiProperty()` atau `@ApiPropertyOptional()`.

4. **Security & Authentication**:
   - Password wajib di-hash menggunakan `bcrypt` sebelum disimpan ke database.
   - Rute admin dilindungi dengan `@UseGuards(JwtAuthGuard)` dari `@nestjs/passport`.

5. **Prisma ORM & Database (Neon PostgreSQL)**:
   - Skema database didefinisikan secara tunggal di `backend/prisma/schema.prisma` merujuk pada `docs/SCHEMA.md`.
   - Gunakan `prismaService` melalui Dependency Injection, jangan instansiasi `new PrismaClient()` manual di dalam service.

---

## 3. Frontend Engineering Standards (Next.js)

1. **App Router Structure**:
   - `frontend/src/app/(public)/`: Halaman web publik untuk pengunjung (Landing page, Portofolio, Galeri, Form Kontak).
   - `frontend/src/app/(admin)/`: Halaman CMS internal (Dashboard, CRUD tabel data, Upload media).
   - `frontend/src/components/`: Komponen reusable (Navbar, Footer, Modal, Data Table, Image Gallery).
   - `frontend/src/services/` atau `lib/api.ts`: Konfigurasi Axios / Fetch client terpusat dengan token interceptor.

2. **Design & Aesthetics**:
   - Wajib merujuk pada `docs/DESIGN_SYSTEM.md` untuk seluruh token warna, tipografi, dan aset:
     * Primary Brand Blue: `#005592`
     * Primary Hover: `#0066AE`
     * Accent Sky Blue: `#66B2E0`
     * Dark Navy: `#004475`
     * Soft Blue Background: `#EBF4FA` / `#E3F2FD`
   - Tipografi: Seluruh Heading, Body text, dan Angka menggunakan `Poppins`. Aksen editorial serif menggunakan `Georgia` (italic).
   - Gunakan banner hero, logo, dan ikon layanan yang sudah diamankan di `frontend/public/`.
   - Sediakan skeleton loader saat data sedang di-fetch dan empty state yang ramah.
   - Jangan gunakan gambar placeholder rusak: gunakan asset yang ada di `frontend/public/uploads/` atau Unsplash/AI asset yang relevan.

---

## 4. Workflow & Do's & Don'ts

### Spec-Driven Gate: "No Code Before Spec" (MANDATORI)
Dokumen di folder `docs/` (`PRD.md`, `SCHEMA.md`, `API_SPEC.md`, `DESIGN_SYSTEM.md`) adalah **Single Source of Truth (SSOT)** dan cetak biru arsitektur KilauBuild.
1. **Dilarang keras menulis atau mengubah kode** (`.ts`, `.tsx`, `.prisma`, `.css`) jika perubahan logika bisnis, fitur baru, penambahan/perubahan endpoint, modifikasi database, atau perubahan desain **belum tercatat di dokumen spesifikasi terkait**:
   - Perubahan fungsionalitas / alur produk ➔ Wajib perbarui `docs/PRD.md`.
   - Perubahan tabel, relasi, enum, tipe kolom ➔ Wajib perbarui `docs/SCHEMA.md`.
   - Perubahan/penambahan endpoint, parameter, response ➔ Wajib perbarui `docs/API_SPEC.md`.
   - Perubahan font, warna, styling, komponen UI ➔ Wajib perbarui `docs/DESIGN_SYSTEM.md`.
2. **Prosedur Otomatis AI**: Saat menerima instruksi dari user yang mengubah perilaku atau menambah fitur aplikasi, AI **WAJIB** memperbarui file `.md` yang relevan terlebih dahulu atau dalam siklus edit yang sama. Jangan pernah meninggalkan dokumen dalam kondisi usang (*out-of-sync*) setelah kode selesai diubah.

### Prinsip Utama
- Terapkan **minimum sufficient change**: ubah sesedikit mungkin kode untuk menyelesaikan kebutuhan secara utuh dan benar.
- Hormati arsitektur, pola, naming, dan dependency yang sudah ada sebelum membuat pola baru.
- Jangan membuat fitur spekulatif, abstraksi prematur, fallback berlapis, atau konfigurasi yang belum dibutuhkan.
- Utamakan kode yang sederhana, eksplisit, mudah diuji, dan mudah dihapus dibanding solusi yang terlihat canggih tetapi menambah beban pemeliharaan.
- Satu sumber kebenaran untuk setiap data atau aturan bisnis. Jangan menduplikasi konstanta, validasi, tipe, query, atau business rule di banyak tempat.

### Sebelum Mengubah Kode
- Baca file terkait, dokumentasi, call site, tipe, dan test sebelum menentukan solusi.
- Periksa `git status` dan diff. Anggap perubahan yang sudah ada sebagai pekerjaan pengguna; jangan menimpa, menghapus, atau memformat ulang tanpa kebutuhan langsung.
- Identifikasi root cause. Jangan menambal gejala apabila penyebabnya dapat diperbaiki dengan perubahan yang tetap kecil.
- Pastikan perubahan berada pada modul pemilik perilaku tersebut. Hindari menyebarkan logic lintas layer tanpa alasan kuat.

### Aturan Implementasi
- Edit hanya file yang relevan. Jangan melakukan refactor, rename, reformat massal, atau perubahan metadata yang tidak diperlukan.
- Gunakan utilitas atau komponen yang sudah ada sebelum menambah file, helper, hook, service, dependency, atau state baru.
- Tambahkan abstraksi hanya jika benar-benar mengurangi kompleksitas atau duplikasi nyata, bukan untuk kemungkinan kebutuhan masa depan.
- Jangan menambah package jika standard library atau dependency yang sudah terpasang cukup. Jika package baru memang perlu, pilih yang terawat dan jelaskan alasannya.
- Pertahankan kompatibilitas API dan database kecuali perubahan kontrak diminta secara eksplisit. Perubahan kontrak harus diperbarui pada tipe, validasi, dokumentasi, dan consumer terkait.
- Jangan menyimpan data turunan yang dapat dihitung dengan murah dari sumber data utama.
- Hindari `any`, type assertion yang tidak aman, silent catch, magic value, dead code, dan komentar yang hanya mengulang kode.
- Jangan copy-paste seluruh file untuk perubahan kecil. Buat patch terarah dan pertahankan struktur serta gaya lokal.

### Database & Backend
- Query harus mengambil field yang diperlukan saja, menggunakan index/constraint yang sesuai, dan menghindari N+1 query.
- Validasi aturan bisnis di backend meskipun frontend juga melakukan validasi.
- Operasi multi-step yang harus atomik wajib memakai transaction.
- Migration dan seeding harus idempotent sejauh memungkinkan; jangan menjalankan destructive migration tanpa instruksi dan persetujuan eksplisit.
- Jangan melakukan network call, query database, atau pekerjaan mahal berulang kali jika hasil aman untuk digunakan kembali dalam scope request yang sama.

### Frontend
- Hindari state yang dapat diturunkan dari props atau state lain, effect yang tidak perlu, dan fetch ganda.
- Pertahankan komponen fokus pada satu tanggung jawab, tetapi jangan memecah komponen kecil hanya demi jumlah file.
- Selalu tangani loading, empty, error, disabled, dan responsive state sesuai risiko fitur.
- Optimalkan setelah ada alasan terukur; jangan menambahkan memoization, virtualization, atau caching secara membabi buta.

### Verifikasi & Selesai
- Jalankan pemeriksaan paling kecil yang relevan terlebih dahulu, lalu perluas sesuai blast radius: typecheck, lint, unit test, build, dan test integrasi bila diperlukan.
- Untuk bug fix, tambahkan atau perbarui test yang mereproduksi bug jika infrastrukturnya tersedia dan biayanya masuk akal.
- Periksa diff akhir untuk memastikan tidak ada secret, debug log, generated file, perubahan lockfile tak disengaja, atau perubahan di luar scope.
- Jangan menyatakan selesai jika build/test penting belum dijalankan. Jika tidak dapat dijalankan, sebutkan alasan dan risiko tersisanya.
- Laporan akhir harus singkat: apa yang berubah, alasan keputusan penting, hasil verifikasi, dan hal yang masih perlu tindakan pengguna.

### DO
- Selalu jadikan dokumen di `docs/` (`PRD.md`, `SCHEMA.md`, `API_SPEC.md`, `DESIGN_SYSTEM.md`) sebagai acuan tunggal dan perbarui terlebih dahulu sebelum/bersamaan dengan penulisan kode.
- Selalu cek `docs/API_SPEC.md` dan `docs/SCHEMA.md` sebelum membuat endpoint atau query baru.
- Berikan error handling yang jelas menggunakan Exception bawaan NestJS (`NotFoundException`, `BadRequestException`, `UnauthorizedException`).
- Gunakan environment variables (`.env`) untuk URL database, JWT secret, dan port server.

### DON'T
- Dilarang keras menulis kode fitur, endpoint, database, atau styling baru tanpa mencatatkannya di file `docs/` terkait.
- Dilarang menyimpan credentials atau secret key di dalam kode sumber.
- Dilarang mengubah skema database secara drastis tanpa mendokumentasikannya di `docs/SCHEMA.md`.
- Dilarang membuat endpoint tanpa dokumentasi Swagger.
