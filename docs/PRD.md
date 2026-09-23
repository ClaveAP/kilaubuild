# Product Requirements Document (PRD) — KilauBuild

## 1. Executive Summary
**KilauBuild** adalah platform digital untuk perusahaan kontraktor dan penyedia jasa desain interior & konstruksi arsitektur. Platform ini berfungsi ganda:
1. **Public Showcase & Lead Generation**: Menyajikan portofolio proyek selesai, proyek berjalan (*ongoing*), galeri desain interior, counter statistik prestasi, ulasan klien (*testimoni*), feed Instagram, FAQ, dan formulir pengajuan konsultasi/feedback.
2. **Internal Content Management System (CMS)**: Dashboard admin yang aman untuk mengelola seluruh konten website secara dinamis tanpa perlu mengubah kode.

---

## 2. User Personas & Flows

### 2.1. Public Visitors (Calon Klien / Pemilik Properti)
- **Goal**: Menilai kredibilitas KilauBuild melalui portofolio, legalitas, statistik pencapaian, dan mengajukan konsultasi atau penawaran harga.
- **Key Flows**:
  - Melihat hero section dan counter statistik (proyek selesai, klien puas, tahun pengalaman).
  - Menjelajahi galeri portofolio (*Project Done* & *Ongoing Projects*) dengan filter kategori dan detail proyek.
  - Membaca ulasan klien (*Testimoni*) dan FAQ.
  - Mengirim pesan atau permintaan penawaran melalui form kontak (*Feedback / Contact Us*).

### 2.2. Admin / Content Manager
- **Goal**: Memperbarui portofolio berkala, memantau pesan masuk dari calon klien, mengunggah dokumentasi proyek terbaru.
- **Key Flows**:
  - Login dengan kredensial aman (Email & Password ber-hash bcrypt).
  - Mengakses Dashboard Overview (ringkasan jumlah proyek, testimoni, pesan belum dibaca).
  - Melakukan operasi CRUD (Create, Read, Update, Delete) + Upload Gambar untuk:
    - Statistik
    - FAQ
    - Testimoni
    - Proyek Selesai (*Project Done*)
    - Proyek Berjalan (*Ongoing Project*)
    - Desain Interior
    - Instagram Posts Feed
  - Membaca dan menandai pesan masuk (*Contact/Feedback*).
  - Mengubah password admin secara mandiri.

---

## 3. System Architecture & Tech Stack

- **Pattern**: Modular Monolith (Dedicated Backend + Dedicated Frontend)
- **Backend**:
  - Framework: **NestJS** (Node.js runtime, TypeScript)
  - Database ORM: **Prisma ORM**
  - Database: **Neon Serverless PostgreSQL**
  - Autentikasi: JWT (JSON Web Token) dengan Passport & bcrypt
  - Validasi: `class-validator` & `class-transformer`
  - Dokumentasi API: **Swagger OpenAPI (`/api/docs`)**
- **Frontend**:
  - Framework: **Next.js** (App Router, TypeScript)
  - Styling: **Tailwind CSS** + Komponen modern (Shadcn UI / Lucide Icons)
  - State & Data Fetching: React Query (TanStack Query) / Axios
- **Asset Storage**:
  - Local disk storage (development) / Cloudinary/Supabase/S3-compatible (production ready).

---

## 4. Feature Specifications

### 4.1. Module: Auth & Security
- Endpoint login menghasilkan Bearer JWT token (masa berlaku misal 1–7 hari).
- Password di-hash menggunakan `bcrypt` (salt rounds >= 10).
- Guard berbasis `@UseGuards(JwtAuthGuard)` untuk memproteksi seluruh rute CMS.
- Fitur ganti password dengan verifikasi password lama.

### 4.2. Module: Statistics
- Menampilkan metrik seperti: "150+ Proyek Selesai", "98% Klien Puas", "5+ Tahun Pengalaman".
- Atribut: Judul, Nilai numerik/string, Satuan, Urutan tampilan.

### 4.3. Module: Projects (Done & Ongoing)
- **Project Done**: Judul, Kategori (Rumah Tinggal, Komersial, Kantor, dll.), Rentang Budget, Tanggal Selesai, Deskripsi, Galeri Gambar (Multiple images).
- **Ongoing Project**: Judul, Lokasi, Persentase Progres (0–100%), Deskripsi, Gambar Utama.

### 4.4. Module: Desain Interior
- Galeri konsep ruangan: Ruang Tamu, Kamar Utama, Kitchen Set, dsb.
- Atribut: Tipe Ruangan, Gaya Desain (Modern Minimalis, Japandi, Industrial, Luxury), Deskripsi, URL Foto.

### 4.5. Module: Testimonials
- Ulasan kepuasan pelanggan.
- Atribut: Nama Klien, Jenis Proyek, Ulasan/Review, Rating (1–5 bintang), Foto Klien/Proyek.

### 4.6. Module: FAQs
- Tanya-jawab seputar estimasi biaya, alur pengerjaan, garansi renovasi.
- Atribut: Pertanyaan, Jawaban, Status Aktif (Boolean), Urutan (*order*).

### 4.7. Module: Contact & Feedbacks
- Formulir publik untuk pengunjung yang ingin berkonsultasi.
- Atribut: Nama, Email, Nomor Telepon/WhatsApp, Subjek, Pesan, Status Dibaca (*isRead*).
- Hanya Admin yang bisa melihat riwayat pesan dan menandai *isRead*.

---

## 5. Non-Functional Requirements (NFR)
1. **Response Time**: Response API < 200ms untuk rute publik dengan bantuan database indexing.
2. **Data Consistency**: Relasi cascading yang aman dan integritas ACID dari PostgreSQL.
3. **Responsive UI**: Tampilan mobile-first dan desktop-optimized untuk kenyamanan calon klien.
4. **Developer Experience**: Dokumentasi API Swagger interaktif yang selalu sinkron dengan kode backend.
