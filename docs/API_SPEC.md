# REST API Specification — KilauBuild (NestJS)

- **Base URL**: `http://localhost:3000/api/v1`
- **Interactive Swagger UI**: `http://localhost:3000/api/docs`
- **Security**: Bearer JWT Token (`Authorization: Bearer <token>`)

---

## 1. Standar Format Response

### Success Response
```json
{
  "statusCode": 200,
  "message": "Data retrieved successfully",
  "data": { ... }
}
```

### Error Response (Validation & Exception Filter)
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": [
    "email must be a valid email",
    "password must be longer than or equal to 6 characters"
  ],
  "timestamp": "2026-09-23T06:30:00.000Z",
  "path": "/api/v1/auth/login"
}
```

---

## 2. Public Endpoints (Tanpa Auth)

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/auth/login` | Login admin dengan rate-limiting & validasi ketat |
| `POST` | `/contacts` | Pengunjung mengirimkan formulir pertanyaan umum |
| `POST` | `/bookings` | Booking jadwal konsultasi/survey (validasi ketat agar tidak double booking) |
| `GET` | `/bookings/availability`| Cek slot jam yang masih kosong pada tanggal tertentu |
| `GET` | `/statistics` | Mengambil data counter statistik yang aktif |
| `GET` | `/instagram-posts` | Mengambil daftar feed Instagram |
| `GET` | `/faqs` | Mengambil daftar pertanyaan & jawaban yang aktif |
| `GET` | `/testimonies` | Mengambil ulasan pelanggan untuk section testimoni |
| `GET` | `/ongoing-projects` | Mengambil daftar proyek yang sedang berjalan |
| `GET` | `/project-dones` | Mengambil daftar portofolio proyek selesai (support query filter category) |
| `GET` | `/project-dones/:id` | Detail spesifik proyek selesai berserta galeri foto |
| `GET` | `/desain-interiors` | Mengambil galeri inspirasi desain interior |

---

## 3. Protected Endpoints (Admin Only — Membutuhkan Bearer Token)

### A. Auth & Admin Profile
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/auth/me` | Cek status login dan info admin yang aktif |
| `POST` | `/auth/change-password` | Ganti password akun admin |
| `POST` | `/auth/logout` | Invalidate / penanda logout di client |

### B. Dashboard Overview
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/dashboard/overview` | Ringkasan metrik (total proyek, total testimoni, pesan masuk belum dibaca) |

### C. Statistics Management
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/statistics` | Tambah counter statistik baru |
| `PUT` | `/statistics/:id` | Update data statistik |
| `DELETE`| `/statistics/:id` | Hapus data statistik |

### D. Instagram Posts Management
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/instagram-posts` | Tambah tautan post Instagram baru |
| `PUT` | `/instagram-posts/:id` | Update postingan Instagram |
| `DELETE`| `/instagram-posts/:id` | Hapus postingan Instagram |

### E. FAQ Management
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/faqs` | Tambah item FAQ baru |
| `PUT` | `/faqs/:id` | Update item FAQ |
| `DELETE`| `/faqs/:id` | Hapus item FAQ |

### F. Testimony Management
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/testimonies` | Tambah ulasan testimoni baru |
| `PUT` | `/testimonies/:id` | Update data testimoni |
| `DELETE`| `/testimonies/:id` | Hapus testimoni |

### G. Ongoing Projects Management
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/ongoing-projects` | Tambah proyek berjalan baru |
| `PUT` | `/ongoing-projects/:id` | Update progres / info proyek |
| `DELETE`| `/ongoing-projects/:id` | Hapus proyek berjalan |

### H. Project Done Management
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/project-dones` | Tambah portofolio proyek selesai baru (termasuk galeri foto) |
| `PUT` | `/project-dones/:id` | Update portofolio proyek selesai |
| `DELETE`| `/project-dones/:id` | Hapus portofolio proyek selesai |

### I. Desain Interior Management
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/desain-interiors` | Tambah inspirasi desain interior baru |
| `PUT` | `/desain-interiors/:id` | Update inspirasi desain interior |
| `DELETE`| `/desain-interiors/:id` | Hapus item desain interior |

### J. Contact & Feedbacks Inbox
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/contacts` | Menampilkan seluruh pesan masuk dari pengunjung |
| `PATCH`| `/contacts/:id/read` | Menandai pesan sudah dibaca (*isRead = true*) |
| `DELETE`| `/contacts/:id` | Hapus pesan dari inbox |

### K. Consultation & Survey Bookings Management
| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/bookings` | Menampilkan daftar seluruh booking survey (filter by status & date) |
| `PATCH`| `/bookings/:id/status` | Update status booking (`CONFIRMED`, `CANCELLED`, `COMPLETED`) |
| `DELETE`| `/bookings/:id` | Hapus data booking |

Endpoint publik terkait booking:

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/bookings` | Ajukan survey lokasi (tersedia setiap hari, Senin s/d Minggu) antara 09:00–20:00 WIB (interval 30 menit) |
| `GET` | `/bookings/availability?date=YYYY-MM-DD` | Lihat jam yang sudah terisi pada satu tanggal |
| `GET` | `/bookings/calendar?month=YYYY-MM` | Lihat tanggal dan jam yang sudah memiliki booking dalam satu bulan tanpa data pribadi klien |

### L. Media File Upload
| Method | Endpoint | Payload | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/media/upload` | `multipart/form-data` (`file`) | Mengunggah gambar (jpg, png, webp) dan mengembalikan file URL |

---

## 4. Security Hardening & Strict Validation Standards

1. **Email Validation**:
   - Wajib format email valid RFC 5322 (`@IsEmail()`).
   - Normalisasi lowercase untuk mencegah duplikasi case-sensitive.
2. **Password Policy (Ketat)**:
   - Minimal 8 karakter (`@MinLength(8)`).
   - Wajib kombinasi: minimal 1 huruf besar (uppercase), 1 huruf kecil (lowercase), 1 angka, dan 1 simbol khusus (`@$!%*?&`).
   - Hash password menggunakan `bcrypt` dengan salt rounds = 12.
3. **Rate Limiting (Anti Brute-Force & Anti Spam)**:
   - `@nestjs/throttler`:
     * `/auth/login`: Maksimal 5 percobaan per menit. Jika lewat, tolak dengan HTTP 429 Too Many Requests.
     * `/bookings` & `/contacts`: Maksimal 10 submit per 15 menit per IP address untuk mencegah spam bot.
4. **HTTP Header & Payload Security**:
   - `helmet` diaktifkan di NestJS untuk proteksi XSS, clickjacking, dan MIME-sniffing.
   - `ValidationPipe`: `whitelist: true` (membuang payload liar yang tidak ada di DTO) dan `forbidNonWhitelisted: true`.
5. **Client Mock Fallback (Preview / Vercel Environment)**:
   - Frontend dilengkapi response interceptor berbasis `mockData.ts` yang otomatis mengalihkan request ke penyimpanan `localStorage` jika koneksi backend offline (`ERR_NETWORK`).
   - Menyediakan endpoint mocking lengkap untuk 10 modul agar aplikasi dapat diuji coba tanpa server aktif.
