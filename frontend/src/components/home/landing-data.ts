"use client";

import {
  Hammer,
  HouseLine,
  PaintBrush,
  PencilRuler,
  type Icon,
} from "@phosphor-icons/react";

export interface ServiceItem {
  title: string;
  image: string;
  icon: Icon;
  tag: string;
  description: string;
  features: string[];
}

export interface StatisticItem {
  id: string;
  title: string;
  value: string;
  unit?: string;
  order?: number;
}

export interface ProjectGallery {
  id: string;
  imageUrl: string;
  caption?: string;
}

export interface ProjectDone {
  id: string;
  title: string;
  category: string;
  budgetRange?: string;
  completionDate?: string;
  description?: string;
  coverImage?: string;
  gallery?: ProjectGallery[];
}

export interface OngoingProject {
  id: string;
  title: string;
  location: string;
  progressPercentage: number;
  description?: string;
  imageUrl?: string;
}

export interface InteriorItem {
  id: string;
  roomType: string;
  style: string;
  description?: string;
  imageUrl: string;
}

export interface TestimonyItem {
  id: string;
  clientName: string;
  projectType: string;
  review: string;
  rating: number;
  photoUrl?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const defaultStats: StatisticItem[] = [
  { id: "stat-1", title: "Proyek Selesai", value: "150+", unit: "Unit Bangunan Siap Huni", order: 1 },
  { id: "stat-2", title: "Kepuasan Klien", value: "98%", unit: "Tingkat Kepuasan Pemilik", order: 2 },
  { id: "stat-3", title: "Tahun Pengalaman", value: "5+", unit: "Tahun Dedikasi Lapangan", order: 3 },
  { id: "stat-4", title: "Tenaga Ahli", value: "45+", unit: "Arsitek & Tukang Berpengalaman", order: 4 },
];

export const services: ServiceItem[] = [
  {
    title: "Bangun Rumah dari Nol",
    image: "/bangun dari 0.png",
    icon: HouseLine,
    tag: "Konstruksi Total",
    description:
      "Layanan konstruksi lengkap mulai dari pondasi, struktur bertulang, dinding, atap, sampai finishing siap huni.",
    features: [
      "Struktur berstandar SNI",
      "Termin sesuai progres fisik",
      "Material tercantum di RAB",
    ],
  },
  {
    title: "Renovasi Rumah & Bangunan",
    image: "/renovasi.png",
    icon: Hammer,
    tag: "Peremajaan Properti",
    description:
      "Perluasan ruangan, penambahan lantai, renovasi fasad, perbaikan atap bocor, hingga transformasi denah hunian lama.",
    features: [
      "Survey struktur awal",
      "Tahap kerja dan biaya tercatat",
      "Garansi retensi 3 bulan",
    ],
  },
  {
    title: "Desain Arsitektur & RAB",
    image: "/design.png",
    icon: PencilRuler,
    tag: "Perencanaan & 3D",
    description:
      "Perencanaan denah fungsional, visualisasi 3D, gambar kerja teknis, dan rincian biaya untuk keputusan yang lebih pasti.",
    features: [
      "Konsultasi konsep arsitektur",
      "RAB merinci volume, material, dan biaya",
      "File DED lengkap",
    ],
  },
  {
    title: "Desain Interior & Custom Furniture",
    image: "/house design.png",
    icon: PaintBrush,
    tag: "Interior & Estetika",
    description:
      "Kitchen set, wardrobe, backdrop TV, dan partisi ruangan dengan ukuran presisi serta material HPL multiplek pilihan.",
    features: [
      "Custom sesuai ukuran ruang",
      "Sampel tekstur sebelum produksi",
      "Produksi mengikuti gambar ukuran",
    ],
  },
];

export const fallbackDoneProjects: ProjectDone[] = [
  {
    id: "fallback-done-1",
    title: "Interior Ruang Keluarga",
    category: "Desain Interior",
    budgetRange: "Konsep ruang",
    coverImage: "/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png",
    description:
      "Konsep living room dengan area duduk, pencahayaan, dan penyimpanan yang disusun untuk aktivitas keluarga.",
    gallery: [
      {
        id: "fallback-done-1-a",
        imageUrl: "/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png",
        caption: "Visual ruang keluarga",
      },
    ],
  },
  {
    id: "fallback-done-2",
    title: "Fasad Rumah Modern",
    category: "Desain Arsitektur",
    budgetRange: "Desain fasad",
    coverImage: "/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png",
    description:
      "Komposisi fasad rumah dengan bukaan lebar, garis vertikal, dan perlindungan matahari pada lantai atas.",
    gallery: [
      {
        id: "fallback-done-2-a",
        imageUrl: "/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png",
        caption: "Tampak depan rumah",
      },
    ],
  },
  {
    id: "fallback-done-3",
    title: "Hunian Dua Lantai",
    category: "Desain Arsitektur",
    budgetRange: "Desain fasad",
    coverImage: "/uploads/project_done/ahKGulPHqwNDLemCcSLEKSXDJeDvougfMgY39Opt.png",
    description:
      "Desain rumah dua lantai dengan permainan bidang, balkon, dan area masuk yang terlindung.",
    gallery: [
      {
        id: "fallback-done-3-a",
        imageUrl: "/uploads/project_done/ahKGulPHqwNDLemCcSLEKSXDJeDvougfMgY39Opt.png",
        caption: "Tampak depan rumah dua lantai",
      },
    ],
  },
];

export const fallbackOngoingProjects: OngoingProject[] = [
  {
    id: "fallback-ongoing-1",
    title: "Pembangunan Rumah Baru",
    location: "Depok",
    progressPercentage: 72,
    imageUrl: "/uploads/ongoing_project/EMnZBbZXShmZfC9I4GUIAL898DBmctQjOJcgOnlg.png",
    description: "Tahap pekerjaan struktur dan dinding berjalan sesuai jadwal termin.",
  },
  {
    id: "fallback-ongoing-2",
    title: "Renovasi Area Hunian",
    location: "Jabodetabek",
    progressPercentage: 54,
    imageUrl: "/uploads/ongoing_project/emHd2slnV7EYLcSjcXplQEq56cNv0wDqnFtbt3qt.png",
    description: "Pengerjaan lapangan terdokumentasi agar progres mudah diverifikasi pemilik.",
  },
  {
    id: "fallback-ongoing-3",
    title: "Pengerjaan Finishing",
    location: "Bogor",
    progressPercentage: 86,
    imageUrl: "/uploads/ongoing_project/o45KoPV4rTnXoPHEQRyjDjdipUJhA8eMC6lacgOf.png",
    description: "Finishing akhir, pengecekan detail, dan persiapan serah terima bertahap.",
  },
];

export const fallbackInteriors: InteriorItem[] = [
  {
    id: "fallback-interior-1",
    roomType: "Bedroom",
    style: "Modern Minimalis",
    imageUrl: "/uploads/design_interior/Pni31dq7Oin6qKqwgZnQrMZHKIyDdVaWYPaW9PXO.png",
    description: "Ruang keluarga bersih, terang, dan mudah dirawat untuk aktivitas harian.",
  },
  {
    id: "fallback-interior-2",
    roomType: "Kitchen Set",
    style: "Contemporary",
    imageUrl: "/uploads/design_interior/F0hXjhkzPXMMTXXgswIN5Jclojjb7PH3isKK6PRH.png",
    description: "Kitchen set custom dengan layout penyimpanan presisi dan material HPL.",
  },
  {
    id: "fallback-interior-3",
    roomType: "Bathroom",
    style: "Japandi",
    imageUrl: "/uploads/design_interior/Dbv5R7GLSW043VSbWSHwVItODLgid6THJfLn5Mi5.png",
    description: "Kamar nyaman dengan penyimpanan built-in dan warna natural yang tenang.",
  },
];

export const fallbackTestimonies: TestimonyItem[] = [
  {
    id: "fallback-testimony-1",
    clientName: "Bapak Hendra",
    projectType: "Renovasi Rumah",
    rating: 5,
    review:
      "Progress selalu dikabari, material jelas, dan pembayaran termin terasa aman karena bisa cek hasil fisik dulu.",
  },
  {
    id: "fallback-testimony-2",
    clientName: "Ibu Ratna",
    projectType: "Interior Custom",
    rating: 5,
    review:
      "Timnya detail saat ukur ruangan. Hasil kitchen set rapi dan sesuai desain yang disepakati.",
  },
  {
    id: "fallback-testimony-3",
    clientName: "Bapak Arif",
    projectType: "Bangun Rumah Baru",
    rating: 5,
    review:
      "RAB dijelaskan satu per satu, jadi keputusan biaya lebih tenang sejak awal proyek.",
  },
];

export const fallbackFaqs: FaqItem[] = [
  {
    id: "fallback-faq-1",
    question: "Apa maksud sistem Bangun Dulu Baru Bayar?",
    answer:
      "Pembayaran dilakukan bertahap sesuai progres fisik. Anda dapat memeriksa pekerjaan di lapangan sebelum menyelesaikan termin berikutnya.",
  },
  {
    id: "fallback-faq-2",
    question: "Apakah survey dan RAB dikenakan biaya?",
    answer:
      "Konsultasi awal, survey lokasi, dan estimasi RAB awal disediakan gratis untuk membantu Anda memahami kebutuhan proyek.",
  },
  {
    id: "fallback-faq-3",
    question: "Area layanan KilauBuild mencakup mana saja?",
    answer:
      "Fokus layanan berada di Depok dan Jabodetabek, dengan penyesuaian jadwal survey sesuai lokasi proyek.",
  },
  {
    id: "fallback-faq-4",
    question: "Apakah proyek mendapatkan garansi?",
    answer:
      "Ya, KilauBuild menyediakan garansi retensi pekerjaan selama 3 bulan untuk menjaga kualitas setelah serah terima.",
  },
];
