import type {
  DesainInteriorItem,
  FaqItem,
  InstagramPostItem,
  OngoingProjectItem,
  ProjectDoneItem,
  RecentBooking,
  RecentContact,
  StatisticItem,
  TestimonyItem,
} from '@/components/admin/admin.types';

export const INITIAL_DONE_PROJECTS: ProjectDoneItem[] = [
  {
    id: 'done-1',
    title: 'Hunian Modern Tropis 2 Lantai',
    category: 'Residensial',
    budgetRange: 'Rp 450 Jt - Rp 650 Jt',
    completionDate: '2025-10-15T00:00:00.000Z',
    description: 'Rumah tinggal dua lantai dengan pencahayaan alami, sirkulasi silang, dan fasad modern tropis bernuansa hangat.',
    coverImage: '/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png',
    gallery: [
      { id: 'gal-1', imageUrl: '/uploads/project_done/ahKGulPHqwNDLemCcSLEKSXDJeDvougfMgY39Opt.png', caption: 'Tampak depan fasad' },
      { id: 'gal-2', imageUrl: '/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png', caption: 'Detail pengerjaan eksterior' },
    ],
  },
  {
    id: 'done-2',
    title: 'Renovasi Hunian Keluarga & Fasad',
    category: 'Renovasi',
    budgetRange: 'Termin Progres',
    completionDate: '2026-02-20T00:00:00.000Z',
    description: 'Transformasi hunian lama menjadi ruang keluarga yang lebih lapang, terang, dan fungsional dengan material berkualitas.',
    coverImage: '/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png',
    gallery: [
      { id: 'gal-3', imageUrl: '/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png', caption: 'Area utama renovasi' },
    ],
  },
  {
    id: 'done-3',
    title: 'Finishing Interior & Penataan Ruang',
    category: 'Interior',
    budgetRange: 'Material Terpilih',
    completionDate: '2026-05-12T00:00:00.000Z',
    description: 'Penyelesaian interior hunian dengan perhatian pada detail estetika, fungsi penyimpanan, dan kerapian finishing.',
    coverImage: '/uploads/project_done/ahKGulPHqwNDLemCcSLEKSXDJeDvougfMgY39Opt.png',
    gallery: [
      { id: 'gal-4', imageUrl: '/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png', caption: 'Detail kerapian interior' },
    ],
  },
];

export const INITIAL_ONGOING_PROJECTS: OngoingProjectItem[] = [
  {
    id: 'ongoing-1',
    title: 'Renovasi Rumah Tinggal & Kolam Renang',
    location: 'Cinere, Depok',
    progressPercentage: 70,
    description: 'Tahap pemasangan keramik lantai, plafon gypsum, dan waterproofing area kolam renang.',
    imageUrl: '/uploads/ongoing_project/EMnZBbZXShmZfC9I4GUIAL898DBmctQjOJcgOnlg.png',
  },
  {
    id: 'ongoing-2',
    title: 'Pembangunan Rumah Baru Minimalis',
    location: 'Sawangan, Depok',
    progressPercentage: 54,
    description: 'Pekerjaan struktur kolom praktis, cor dak lantai 2, dan dinding bata ringan berjalan sesuai jadwal termin.',
    imageUrl: '/uploads/ongoing_project/emHd2slnV7EYLcSjcXplQEq56cNv0wDqnFtbt3qt.png',
  },
  {
    id: 'ongoing-3',
    title: 'Pengerjaan Finishing Interior Hunian',
    location: 'Bogor',
    progressPercentage: 86,
    description: 'Pengecekan detail akhir, instalasi sanitary, dan persiapan serah terima fisik bertahap.',
    imageUrl: '/uploads/ongoing_project/o45KoPV4rTnXoPHEQRyjDjdipUJhA8eMC6lacgOf.png',
  },
];

export const INITIAL_INTERIORS: DesainInteriorItem[] = [
  {
    id: 'interior-1',
    roomType: 'Living Room',
    style: 'Modern Japandi',
    description: 'Ruang keluarga hangat dengan elemen kisi kayu alami dan komposisi built-in cabinet yang presisi.',
    imageUrl: '/uploads/design_interior/Dbv5R7GLSW043VSbWSHwVItODLgid6THJfLn5Mi5.png',
  },
  {
    id: 'interior-2',
    roomType: 'Kitchen Set',
    style: 'Contemporary',
    description: 'Kitchen set custom dengan layout penyimpanan ergonomis, top table granit, dan material HPL pilihan.',
    imageUrl: '/uploads/design_interior/F0hXjhkzPXMMTXXgswIN5Jclojjb7PH3isKK6PRH.png',
  },
  {
    id: 'interior-3',
    roomType: 'Master Bedroom',
    style: 'Modern Minimalis',
    description: 'Kamar tidur nyaman dengan wardrobe built-in, warm lighting, dan warna natural yang menenangkan.',
    imageUrl: '/uploads/design_interior/Pni31dq7Oin6qKqwgZnQrMZHKIyDdVaWYPaW9PXO.png',
  },
];

export const INITIAL_BOOKINGS: RecentBooking[] = [
  {
    id: 'book-1',
    clientName: 'Bpk. Bambang Pamungkas',
    email: 'bambang.p@gmail.com',
    phone: '081234567890',
    serviceType: 'Bangun Rumah 2 Lantai',
    location: 'Sawangan, Depok',
    bookingDate: '2026-10-22T00:00:00.000Z',
    timeSlot: '10:00 WIB',
    status: 'CONFIRMED',
    notes: 'Tanah 120m2 siap bangun, ingin model minimalis modern.',
    createdAt: '2026-10-17T08:30:00.000Z',
  },
  {
    id: 'book-2',
    clientName: 'Ibu Siti Nurhaliza',
    email: 'siti.nur@yahoo.com',
    phone: '081398765432',
    serviceType: 'Renovasi Total',
    location: 'Cinere, Depok',
    bookingDate: '2026-10-24T00:00:00.000Z',
    timeSlot: '13:30 WIB',
    status: 'PENDING',
    notes: 'Perbaikan atap bocor dan penambahan 1 kamar tidur di lantai atas.',
    createdAt: '2026-10-17T11:45:00.000Z',
  },
  {
    id: 'book-3',
    clientName: 'Bpk. Dian Sastro',
    email: 'dian.s@gmail.com',
    phone: '081122334455',
    serviceType: 'Desain Interior & Kitchen Set',
    location: 'Cibubur, Depok',
    bookingDate: '2026-10-19T00:00:00.000Z',
    timeSlot: '15:00 WIB',
    status: 'COMPLETED',
    notes: 'Kitchen set letter L dengan rak bumbu dan kabinet kulkas.',
    createdAt: '2026-10-15T09:20:00.000Z',
  },
  {
    id: 'book-4',
    clientName: 'Bpk. Reza Rahadian',
    email: 'reza.r@outlook.com',
    phone: '085678901234',
    serviceType: 'Konsultasi Arsitektur & RAB',
    location: 'Margonda, Depok',
    bookingDate: '2026-10-25T00:00:00.000Z',
    timeSlot: '10:00 WIB',
    status: 'PENDING',
    notes: 'Ingin hitung estimasi RAB bertahap untuk rumah 1 lantai.',
    createdAt: '2026-10-17T14:10:00.000Z',
  },
];

export const INITIAL_CONTACTS: RecentContact[] = [
  {
    id: 'contact-1',
    name: 'Bpk. Ahmad Dahlan',
    email: 'ahmad.dahlan@gmail.com',
    phone: '081299887766',
    subject: 'Tanya Biaya Tambah Lantai 2',
    message: 'Halo KilauBuild, apakah ada estimasi biaya per meter untuk penambahan lantai 2 rumah tipe 45 di Depok?',
    isRead: false,
    createdAt: '2026-10-17T13:40:00.000Z',
  },
  {
    id: 'contact-2',
    name: 'Ibu Maya Septiani',
    email: 'maya.septiani@gmail.com',
    phone: '087811223344',
    subject: 'Konsultasi Kitchen Set',
    message: 'Selamat siang, saya mau tanya apakah survey lokasi dan desain 3D awal kitchen set dikenakan biaya?',
    isRead: true,
    createdAt: '2026-10-16T10:15:00.000Z',
  },
  {
    id: 'contact-3',
    name: 'Bpk. Faisal Akbar',
    email: 'faisal.akbar@yahoo.com',
    phone: '085733445566',
    subject: 'Jasa Renovasi Fasad',
    message: 'Bisa minta portofolio renovasi fasad rumah mediterania menjadi minimalis? Terima kasih.',
    isRead: false,
    createdAt: '2026-10-17T15:20:00.000Z',
  },
];

export const INITIAL_TESTIMONIES: TestimonyItem[] = [
  {
    id: 'test-1',
    clientName: 'Bpk. Hendra Gunawan & Keluarga',
    projectType: 'Bangun Rumah 2 Lantai Minimalis - Sawangan',
    review: 'Transparansi RAB dan pengerjaan yang tepat jadwal membuat kami tenang. Sistem termin pembayarannya benar-benar mengikuti progres fisik di lapangan.',
    rating: 5,
    photoUrl: null,
  },
  {
    id: 'test-2',
    clientName: 'Ibu Ratna Dewi',
    projectType: 'Renovasi Kitchen Set & Living Room - Depok',
    review: 'Hasil desain interiornya rapi dan finishing kayunya halus. Tim komunikatif dan cepat merespons saat diajak berdiskusi.',
    rating: 5,
    photoUrl: null,
  },
  {
    id: 'test-3',
    clientName: 'Bapak Arif Pratama',
    projectType: 'Bangun Rumah Baru - Bogor',
    review: 'RAB dijelaskan satu per satu dan progres selalu terdokumentasi, sehingga keputusan biaya terasa lebih aman sejak awal proyek.',
    rating: 5,
    photoUrl: null,
  },
];

export const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: "Apa arti slogan 'Bangun Dulu Baru Bayar'?",
    answer: 'Pembayaran dilakukan berdasarkan termin progres nyata di lapangan. Anda memeriksa pekerjaan yang selesai sebelum melanjutkan pembayaran termin berikutnya.',
    order: 1,
    isActive: true,
  },
  {
    id: 'faq-2',
    question: 'Apakah ada garansi pemeliharaan setelah proyek selesai?',
    answer: 'Ya. Pekerjaan konstruksi dan renovasi mendapatkan garansi retensi atau pemeliharaan selama 3 bulan setelah serah terima.',
    order: 2,
    isActive: true,
  },
  {
    id: 'faq-3',
    question: 'Apakah konsultasi, survey lokasi, dan RAB dikenakan biaya?',
    answer: 'Konsultasi awal, survey lokasi, dan estimasi RAB awal disediakan gratis untuk membantu Anda memahami kebutuhan proyek.',
    order: 3,
    isActive: true,
  },
  {
    id: 'faq-4',
    question: 'Area layanan KilauBuild mencakup mana saja?',
    answer: 'Fokus layanan KilauBuild berada di Depok dan Jabodetabek, dengan penyesuaian jadwal survey berdasarkan lokasi proyek.',
    order: 4,
    isActive: true,
  },
];

export const INITIAL_STATISTICS: StatisticItem[] = [
  { id: 'stat-1', title: 'Proyek Selesai', value: '150+', unit: 'Unit Bangunan', order: 1 },
  { id: 'stat-2', title: 'Tahun Pengalaman', value: '5+', unit: 'Tahun Berdedikasi', order: 2 },
  { id: 'stat-3', title: 'Klien Puas', value: '98%', unit: 'Tingkat Kepuasan', order: 3 },
  { id: 'stat-4', title: 'Tenaga Ahli', value: '45+', unit: 'Arsitek & Tukang Profesional', order: 4 },
];

export const INITIAL_IG_POSTS: InstagramPostItem[] = [
  {
    id: 'ig-1',
    caption: 'Progres pengecoran lantai 2 proyek hunian modern Sawangan Depok. Presisi mutu beton K-250.',
    postUrl: 'https://instagram.com/kilaubuild',
    imageUrl: '/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png',
  },
  {
    id: 'ig-2',
    caption: 'Instalasi kitchen set contemporary finishing HPL serat kayu alami di perumahan Cinere.',
    postUrl: 'https://instagram.com/kilaubuild',
    imageUrl: '/uploads/design_interior/F0hXjhkzPXMMTXXgswIN5Jclojjb7PH3isKK6PRH.png',
  },
  {
    id: 'ig-3',
    caption: 'Serah terima kunci rumah tinggal 2 lantai di Sawangan Depok. Pengerjaan selesai tepat waktu.',
    postUrl: 'https://instagram.com/kilaubuild',
    imageUrl: '/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png',
  },
  {
    id: 'ig-4',
    caption: 'Suasana master bedroom dengan pencahayaan warm ambient dan lemari built-in custom.',
    postUrl: 'https://instagram.com/kilaubuild',
    imageUrl: '/uploads/design_interior/Pni31dq7Oin6qKqwgZnQrMZHKIyDdVaWYPaW9PXO.png',
  },
];
