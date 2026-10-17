# KilauBuild — Enterprise Company Profile & Modular CMS Platform

> **Platform digital terintegrasi untuk perusahaan kontraktor, penyedia jasa arsitektur, dan desain interior berbasis di Depok & Jabodetabek.**

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-12.0-red?style=flat&logo=nestjs)](https://nestjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon%20Postgres-00E599?style=flat&logo=postgresql)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)

---

## 📌 Sekilas Proyek

**KilauBuild** menghadirkan pengalaman digital modern bagi pemilik properti yang membutuhkan kontraktor bangunan dan interior terpercaya dengan mekanisme transparan:

* **Value Proposition**: *"Bangun Dulu Baru Bayar"* — Pembayaran konstruksi bertahap berbasis termin fisik riil yang telah diverifikasi langsung oleh klien di lapangan.
* **Layanan Utama**:
  1. **Bangun Rumah Baru dari 0**: Konstruksi struktur sipil, MEP, dan finishing arsitektural.
  2. **Renovasi Total & Parsial**: Perluasan ruangan, fasad, dak lantai 2, dan perbaikan struktural.
  3. **Desain Interior & Custom Furniture**: Kitchen set modular, backdrop TV, wardobe, dan tata ruang estetik.
  4. **Layanan Pra-Konstruksi Gratis**: Survey lokasi, konsultasi teknis, dan estimasi Rencana Anggaran Biaya (RAB) tanpa biaya di awal.

Platform ini memadukan **Public Showcase** berkonversi tinggi dan **Internal CMS (Content Management System)** yang modular, aman, dan mudah digunakan oleh staf operasional.

---

## 🏗️ Arsitektur Monorepo

Repository ini mengadopsi pola **Modular Monolith**:

```text
pjbl/
├── backend/                  # NestJS REST API Server
│   ├── prisma/               # Schema Prisma, Migrasi, & Seeder Data
│   ├── src/                  # Kode Sumber Modular NestJS
│   │   ├── common/           # Interceptors, Filters, Guards
│   │   ├── config/           # Environment validation & configuration
│   │   ├── modules/          # Feature Modules (auth, projects, testimonies, faqs, contacts, dll.)
│   │   ├── main.ts           # Entry point API server
│   │   └── vercel.ts         # Serverless handler untuk Vercel Functions
│   ├── test/                 # Unit & E2E Tests (Vitest)
│   ├── vercel.json           # Konfigurasi deploy backend Vercel
│   └── .env.example          # Template environment variable backend
│
├── frontend/                 # Next.js 16 App Router Client
│   ├── public/               # Asset statis publik & media lokal
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/     # Rute publik (Landing page, Portofolio, Galeri, Kontak)
│   │   │   └── admin/        # Rute internal CMS (Dashboard, CRUD data, Booking)
│   │   ├── components/       # Reusable UI & Interactive Components
│   │   ├── lib/              # Client API wrapper, Axios instance, Utils
│   │   └── types/            # TypeScript Interface & Entity Types
│   ├── vercel.json           # Konfigurasi deploy frontend Vercel
│   └── .env.example          # Template environment variable frontend
│
├── docs/                     # Dokumentasi Teknis & Spesifikasi Lengkap
│   ├── PRD.md                # Product Requirements Document
│   ├── SCHEMA.md             # Data Dictionary & Relasi Database
│   ├── API_SPEC.md           # Spesifikasi Lengkap Endpoint REST API
│   └── DESIGN_SYSTEM.md      # Panduan Desain, Token Warna, & Tipografi
│
├── _backup_data/             # Foto Asli Proyek, Logo, & SQL Backup untuk Seeding
├── AGENTS.md                 # Panduan Rekayasa & Standar Kualitas AI/Developer
├── DEPLOY_VERCEL.md          # Panduan Detail Deployment ke Vercel
├── PRODUCT.md                # Ringkasan Nilai Bisnis & Target Persona
└── README.md                 # Dokumentasi Utama Proyek (File ini)
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [NestJS 12](https://nestjs.com/) (Express platform)
- **Database & ORM**: [Neon Serverless PostgreSQL](https://neon.tech/) via [Prisma ORM 6](https://www.prisma.io/)
- **Documentation**: [Swagger OpenAPI](https://swagger.io/) (`@nestjs/swagger` + `swagger-ui-express`)
- **Keamanan & Validasi**:
  - `bcrypt` untuk hashing password kredensial
  - `passport-jwt` untuk autentikasi berbasis Bearer Token
  - `helmet` untuk HTTP security headers
  - `@nestjs/throttler` untuk rate limiting
  - `class-validator` & `class-transformer` untuk validasi DTO ketat
- **Testing**: [Vitest 4](https://vitest.dev/)

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: React 19, Tailwind CSS v4
- **Komponen & Animasi**:
  - `motion` (Framer Motion v14) untuk transisi halus
  - `lucide-react` & `@phosphor-icons/react` untuk icon set premium
  - `date-fns` & `react-day-picker` untuk pemilihan tanggal survey
- **HTTP Client**: `axios` terpusat dengan interceptor otorisasi token

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### 1. Prasyarat Sistem
- **Node.js**: v20.x atau v24.x (Direkomendasikan Node 24)
- **NPM**: v9.x ke atas
- **Database**: Instance PostgreSQL aktif (disarankan Neon PostgreSQL pooled connection)

---

### 2. Konfigurasi Backend

Masuk ke folder `backend`:
```bash
cd backend
```

Pasang dependencies:
```bash
npm install
```

Salin file environment:
```bash
cp .env.example .env
```

Sesuaikan konfigurasi di `backend/.env`:
```env
PORT=3000
NODE_ENV=development

# Neon PostgreSQL connection string (gunakan pooled connection yang mengandung -pooler)
DATABASE_URL="postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DATABASE?sslmode=require"

# JWT Secret untuk sesi CMS Admin
JWT_SECRET="ganti-dengan-string-rahasia-yang-panjang-dan-aman"
JWT_EXPIRATION="7d"

# Rate Limiter
THROTTLE_TTL=60000
THROTTLE_LIMIT=20

# CORS Whitelist (Izinkan akses dari Frontend Next.js)
CORS_ORIGIN="http://localhost:3001,http://localhost:3000"
```

Sinkronisasi skema database & jalankan seeding data awal:
```bash
# Push skema Prisma ke PostgreSQL
npm run db:push

# Generate client Prisma terbaru
npm run postinstall

# Jalankan seeder data awal (admin default, portofolio, faqs, testimoni)
npm run db:seed
```

Jalankan backend dalam mode development:
```bash
npm run start:dev
```
Backend akan aktif di `http://localhost:3000`.

---

### 3. Konfigurasi Frontend

Buka jendela terminal baru, lalu masuk ke folder `frontend`:
```bash
cd frontend
```

Pasang dependencies:
```bash
npm install
```

Salin file environment:
```bash
cp .env.example .env.local
```

Isi konfigurasi di `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"
```

Jalankan server development Next.js (port 3001 agar tidak bentrok dengan backend port 3000):
```bash
npm run dev -- --port 3001
```
Frontend akan aktif di `http://localhost:3001`.

---

## 📖 Dokumentasi API & Kredensial Default

### 1. Swagger Interactive Docs
Saat backend berjalan, dokumentasi OpenAPI Swagger dapat diakses di:
👉 **`http://localhost:3000/api/docs`**

Swagger mencakup seluruh endpoint publik dan modul CMS terproteksi:
- `POST /api/v1/auth/login` — Login admin & penerbitan JWT
- `GET /api/v1/auth/profile` — Profil pengguna saat ini
- `GET /api/v1/statistics` — Statistik metrik publik (proyek selesai, kepuasan, tahun berdiri)
- `GET/POST/PATCH/DELETE /api/v1/projects` — Manajemen portofolio proyek
- `GET/POST/PATCH/DELETE /api/v1/testimonies` — Manajemen testimoni klien
- `GET/POST/PATCH/DELETE /api/v1/faqs` — Pertanyaan yang sering diajukan
- `POST /api/v1/contacts` — Pengiriman form booking survey & pesan konsultasi
- `GET /api/v1/dashboard/summary` — Ringkasan metrik analitik dashboard admin

### 2. Akun Admin Default (Hasil Seeding)
Setelah menjalankan `npm run db:seed`, akun superadmin default dapat langsung digunakan untuk masuk ke CMS:
- **URL Login CMS**: `http://localhost:3001/admin/login`
- **Email**: `admin@kilaubuild.com`
- **Password**: `Password123!`

*(Catatan: Segera perbarui password admin pada deployment lingkungan production).*

---

## 🌐 Panduan Deployment ke Vercel

KilauBuild dirancang untuk dideploy sebagai **dua Vercel Projects** terpisah dari satu repositori Git yang sama:

1. **Project Backend (`kilaubuild-api`)**:
   - **Root Directory**: `backend`
   - **Framework**: `NestJS` (dikonfigurasi via `backend/vercel.json`)
   - **Environment Variables**: `NODE_ENV`, `DATABASE_URL` (Neon Pooled), `JWT_SECRET`, `CORS_ORIGIN`.

2. **Project Frontend (`kilaubuild-web`)**:
   - **Root Directory**: `frontend`
   - **Framework**: `Next.js`
   - **Environment Variables**: `NEXT_PUBLIC_API_URL` (mengarah ke URL backend production).

Untuk langkah detail langkah demi langkah, silakan baca dokumentasi [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md).

---

## 📚 Dokumen Terkait

- [Product Requirements Document (PRD)](docs/PRD.md)
- [Database Schema & Dictionary](docs/SCHEMA.md)
- [API Specification Reference](docs/API_SPEC.md)
- [Design System & Brand Tokens](docs/DESIGN_SYSTEM.md)
- [Vercel Deployment Guide](DEPLOY_VERCEL.md)
- [AI & Developer Engineering Guidelines (AGENTS.md)](AGENTS.md)

---

## 📄 Lisensi
Hak cipta © 2026 KilauBuild. Seluruh hak cipta dilindungi undang-undang.
