# Database Schema Specification (Neon PostgreSQL + Prisma ORM)

Dokumen ini mendefinisikan skema database PostgreSQL untuk Neon, hasil migrasi dan modernisasi dari skema Laravel lama.

---

## 1. Konfigurasi Datasource & Generator

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

> **Tips Neon**: Gunakan format URL Pooled untuk aplikasi (`postgresql://user:pass@ep-xyz-pooler.us-east-2.aws.neon.tech/kilaubuild?sslmode=require&pgbouncer=true`) dan Direct URL (`DIRECT_URL`) untuk migration.

---

## 2. Definisi Model Prisma

```prisma
enum Role {
  ADMIN
  SUPERADMIN
}

// ----------------------------------------------------
// 1. User / Admin Model
// ----------------------------------------------------
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

// ----------------------------------------------------
// 2. Statistics Counter
// ----------------------------------------------------
model Statistic {
  id        String   @id @default(cuid())
  title     String   // e.g. "Proyek Selesai"
  value     String   // e.g. "150+"
  unit      String?  // e.g. "Unit / Klien"
  order     Int      @default(0)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("statistics")
}

// ----------------------------------------------------
// 3. Instagram Feed Posts
// ----------------------------------------------------
model InstagramPost {
  id        String   @id @default(cuid())
  caption   String?  @db.Text
  postUrl   String   @map("post_url")
  imageUrl  String   @map("image_url")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("instagram_posts")
}

// ----------------------------------------------------
// 4. FAQs
// ----------------------------------------------------
model Faq {
  id        String   @id @default(cuid())
  question  String
  answer    String   @db.Text
  order     Int      @default(0)
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("faqs")
}

// ----------------------------------------------------
// 5. Testimonials
// ----------------------------------------------------
model Testimony {
  id          String   @id @default(cuid())
  clientName  String   @map("client_name")
  projectType String   @map("project_type") // e.g. "Renovasi Rumah 2 Lantai"
  review      String   @db.Text
  rating      Int      @default(5) // Skala 1 - 5
  photoUrl    String?  @map("photo_url")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("testimonies")
}

// ----------------------------------------------------
// 6. Ongoing Projects (Proyek Sedang Berjalan)
// ----------------------------------------------------
model OngoingProject {
  id                 String   @id @default(cuid())
  title              String
  location           String
  progressPercentage Int      @default(0) @map("progress_percentage") // 0 - 100
  description        String?  @db.Text
  imageUrl           String?  @map("image_url")
  createdAt          DateTime @default(now()) @map("created_at")
  updatedAt          DateTime @updatedAt @map("updated_at")

  @@map("ongoing_projects")
}

// ----------------------------------------------------
// 7. Project Done (Proyek Selesai & Portofolio)
// ----------------------------------------------------
model ProjectDone {
  id             String         @id @default(cuid())
  title          String
  category       String         // e.g. "Residensial", "Komersial"
  budgetRange    String?        @map("budget_range") // e.g. "Rp 200jt - Rp 500jt"
  completionDate DateTime?      @map("completion_date")
  description    String?        @db.Text
  coverImage     String?        @map("cover_image")
  gallery        ProjectImage[]
  createdAt      DateTime       @default(now()) @map("created_at")
  updatedAt      DateTime       @updatedAt @map("updated_at")

  @@map("project_dones")
}

model ProjectImage {
  id            String      @id @default(cuid())
  projectDoneId String      @map("project_done_id")
  imageUrl      String      @map("image_url")
  caption       String?
  projectDone   ProjectDone @relation(fields: [projectDoneId], references: [id], onDelete: Cascade)
  createdAt     DateTime    @default(now()) @map("created_at")

  @@map("project_images")
}

// ----------------------------------------------------
// 8. Desain Interior
// ----------------------------------------------------
model DesainInterior {
  id          String   @id @default(cuid())
  roomType    String   @map("room_type") // e.g. "Living Room", "Kitchen Set"
  style       String   // e.g. "Modern Luxury", "Japandi", "Minimalis"
  description String?  @db.Text
  imageUrl    String   @map("image_url")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("desain_interiors")
}

// ----------------------------------------------------
// 9. Contact / Feedback Messages (Pesan Umum)
// ----------------------------------------------------
model Contact {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String   @db.Text
  isRead    Boolean  @default(false) @map("is_read")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("contacts")
}

// ----------------------------------------------------
// 10. Consultation & Survey Bookings (Sistem Booking Kalender Ketat)
// ----------------------------------------------------
enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

model Booking {
  id            String        @id @default(cuid())
  clientName    String        @map("client_name")
  email         String
  phone         String        // WhatsApp number
  serviceType   String        @map("service_type") // e.g. "Bangun Baru", "Renovasi", "Desain Interior"
  bookingDate   DateTime      @map("booking_date") // Tanggal survey/konsultasi
  timeSlot      String        @map("time_slot")    // Jam mulai format HH:mm, hari kerja 09:00-20:00 WIB
  location      String        @db.Text             // Alamat lokasi survey
  notes         String?       @db.Text             // Catatan kebutuhan proyek
  status        BookingStatus @default(PENDING)
  createdAt     DateTime      @default(now()) @map("created_at")
  updatedAt     DateTime      @updatedAt @map("updated_at")

  // Constraint: Mencegah double booking pada tanggal dan time slot yang sama yang sudah terkonfirmasi
  @@index([bookingDate, timeSlot])
  @@map("bookings")
}
```

---

## 3. Strategi Indexing & Performance
- Indexing unik pada `User(email)`.
- Indexing pada `ProjectDone(category)` dan `DesainInterior(roomType)` untuk pencarian cepat.
- Indexing pada `Contact(isRead, createdAt)` untuk query inbox admin.
- Indexing pada `Booking(bookingDate, timeSlot, status)` untuk validasi ketersediaan jadwal instan.
