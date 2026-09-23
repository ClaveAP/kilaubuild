# AGENTS.md — Development Guidelines & Instructions for AI Agents

Selamat datang di proyek **KilauBuild**! Dokumen ini adalah panduan standar dan pedoman teknis yang **MANDATORI** dipatuhi oleh seluruh AI coding assistant (Antigravity, Cursor, Copilot, dll.) saat mengembangkan kode di repositori ini.

---

## 1. Project Context & Objectives
- **Aplikasi**: KilauBuild (Company Profile & CMS Kontraktor / Jasa Desain Interior & Arsitektur).
- **Arsitektur**: **Modular Monolith** dengan pembagian:
  - `backend/`: NestJS REST API + Prisma ORM + Swagger OpenAPI.
  - `frontend/`: Next.js (App Router) + Tailwind CSS + Modern UI components.
  - `database`: Neon Serverless PostgreSQL.
  - `_backup_data/`: Berisi foto-foto asli portofolio, logo, dan file dump SQL lama untuk kebutuhan seeder.
  - `docs/`: Spesifikasi lengkap (`PRD.md`, `SCHEMA.md`, `API_SPEC.md`).

---

## 2. Backend Engineering Standards (NestJS)

1. **Modular Architecture**:
   - Setiap fitur wajib dipecah menjadi modul independen di `backend/src/modules/<feature-name>/`:
     - `<feature>.module.ts`
     - `<feature>.controller.ts`
     - `<feature>.service.ts`
     - `dto/` (misal: `create-<feature>.dto.ts`, `update-<feature>.dto.ts`)
   - Modul utama: `auth`, `users`, `statistics`, `faqs`, `testimonies`, `projects`, `interior`, `contacts`, `media`, `dashboard`.

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
   - Tipografi: Heading menggunakan `Roboto` / `Plus Jakarta Sans`, Body text menggunakan `Inter`.
   - Gunakan banner hero, logo, dan ikon layanan yang sudah diamankan di `_backup_data/brand_assets/fe_assets/`.
   - Sediakan skeleton loader saat data sedang di-fetch dan empty state yang ramah.
   - Jangan gunakan gambar placeholder rusak: gunakan asset yang ada di `_backup_data/uploaded_assets` atau Unsplash/AI asset yang relevan.

---

## 4. Workflow & Do's & Don'ts

### DO:
- Selalu cek `docs/API_SPEC.md` dan `docs/SCHEMA.md` sebelum membuat endpoint atau query baru.
- Berikan error handling yang jelas menggunakan Exception bawaan NestJS (`NotFoundException`, `BadRequestException`, `UnauthorizedException`).
- Gunakan environment variables (`.env`) untuk URL database, JWT secret, dan port server.

### DON'T:
- Dilarang menyimpan credentials atau secret key di dalam kode sumber.
- Dilarang mengubah skema database secara drastis tanpa mendokumentasikannya di `docs/SCHEMA.md`.
- Dilarang membuat endpoint tanpa dokumentasi Swagger.
