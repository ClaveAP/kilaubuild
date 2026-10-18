# Deploy KilauBuild ke Vercel

Neon tetap menjadi database PostgreSQL. Repo ini dideploy sebagai dua Vercel Project yang menggunakan repository Git yang sama.

## 1. Deploy backend

1. Import repository ini di Vercel.
2. Buat project bernama, misalnya, `kilaubuild-api`.
3. Atur **Root Directory** ke `backend`.
4. Framework akan dibaca sebagai **NestJS** dari `backend/vercel.json`.
5. Tambahkan Environment Variables untuk Production dan Preview:

```env
NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST-pooler.REGION.aws.neon.tech/DATABASE?sslmode=require
JWT_SECRET=GANTI_DENGAN_SECRET_RANDOM_YANG_PANJANG
JWT_EXPIRATION=7d
THROTTLE_TTL=60000
THROTTLE_LIMIT=20
CORS_ORIGIN=https://DOMAIN-FRONTEND.vercel.app
```

Gunakan pooled connection string Neon, yaitu hostname yang mengandung `-pooler`. Setelah deploy, API tersedia di:

```text
https://DOMAIN-BACKEND.vercel.app/api/v1
https://DOMAIN-BACKEND.vercel.app/api/docs
```

`CORS_ORIGIN` boleh berisi beberapa domain yang dipisahkan koma. Jika domain frontend belum diketahui saat deploy pertama, isi setelah project frontend dibuat lalu redeploy backend.

## 2. Deploy frontend

1. Import repository yang sama sebagai Vercel Project kedua.
2. Beri nama, misalnya, `kilaubuild-web`.
3. Atur **Root Directory** ke `frontend`.
4. Framework akan dibaca sebagai **Next.js** dari `frontend/vercel.json`.
5. Tambahkan Environment Variable berikut sebelum build:

```env
NEXT_PUBLIC_API_URL=https://DOMAIN-BACKEND.vercel.app/api/v1
```

Setelah URL frontend tersedia, pastikan URL tersebut sudah menjadi nilai `CORS_ORIGIN` pada project backend.

## 3. Menjalankan lokal

Jalankan backend:

```bash
cd backend
npm install
npm run start:dev
```

Jalankan frontend dari terminal kedua:

```bash
cd frontend
npm install
npm run dev
```

Frontend lokal terbuka di `http://localhost:3001`, sedangkan backend lokal berjalan di `http://localhost:3000`.

## Catatan media

Foto bawaan yang sudah berada di folder `public` aman ikut deployment. Endpoint upload admin yang menulis file ke disk lokal tidak boleh dijadikan penyimpanan permanen di Vercel Functions. Saat fitur admin dikerjakan, pindahkan upload baru ke Vercel Blob atau object storage lain dan simpan URL hasil upload ke Neon.
