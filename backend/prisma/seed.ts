import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const statsData = [
  { title: 'Proyek Selesai', value: '150+', unit: 'Unit Bangunan', order: 1 },
  { title: 'Tahun Pengalaman', value: '5+', unit: 'Tahun Berdedikasi', order: 2 },
  { title: 'Klien Puas', value: '98%', unit: 'Tingkat Kepuasan', order: 3 },
  { title: 'Tenaga Ahli', value: '45+', unit: 'Arsitek & Tukang Profesional', order: 4 },
];

const faqData = [
  {
    question: "Apa arti slogan 'Bangun Dulu Baru Bayar'?",
    answer:
      'Pembayaran dilakukan berdasarkan termin progres nyata di lapangan. Anda memeriksa pekerjaan yang selesai sebelum melanjutkan pembayaran termin berikutnya.',
    order: 1,
    isActive: true,
  },
  {
    question: 'Apakah ada garansi pemeliharaan setelah proyek selesai?',
    answer:
      'Ya. Pekerjaan konstruksi dan renovasi mendapatkan garansi retensi atau pemeliharaan selama 3 bulan setelah serah terima.',
    order: 2,
    isActive: true,
  },
  {
    question: 'Apakah konsultasi, survey lokasi, dan RAB dikenakan biaya?',
    answer:
      'Konsultasi awal, survey lokasi, dan estimasi RAB awal disediakan gratis untuk membantu Anda memahami kebutuhan proyek.',
    order: 3,
    isActive: true,
  },
  {
    question: 'Area layanan KilauBuild mencakup mana saja?',
    answer:
      'Fokus layanan KilauBuild berada di Depok dan Jabodetabek, dengan penyesuaian jadwal survey berdasarkan lokasi proyek.',
    order: 4,
    isActive: true,
  },
];

const testimonyData = [
  {
    clientName: 'Bpk. Hendra Gunawan & Keluarga',
    projectType: 'Bangun Rumah 2 Lantai Minimalis - Sawangan',
    review:
      'Transparansi RAB dan pengerjaan yang tepat jadwal membuat kami tenang. Sistem termin pembayarannya benar-benar mengikuti progres fisik di lapangan.',
    rating: 5,
    photoUrl: null,
  },
  {
    clientName: 'Ibu Ratna Dewi',
    projectType: 'Renovasi Kitchen Set & Living Room - Depok',
    review:
      'Hasil desain interiornya rapi dan finishing kayunya halus. Tim komunikatif dan cepat merespons saat diajak berdiskusi.',
    rating: 5,
    photoUrl: null,
  },
  {
    clientName: 'Bapak Arif Pratama',
    projectType: 'Bangun Rumah Baru - Bogor',
    review:
      'RAB dijelaskan satu per satu dan progres selalu terdokumentasi, sehingga keputusan biaya terasa lebih aman sejak awal proyek.',
    rating: 5,
    photoUrl: null,
  },
];

const doneProjectsData = [
  {
    title: 'Hunian Modern Tropis 2 Lantai',
    category: 'Residensial',
    budgetRange: 'Rp 450 Jt - Rp 650 Jt',
    completionDate: new Date('2025-10-15'),
    description:
      'Rumah tinggal dua lantai dengan pencahayaan alami, ruang terbuka, dan fasad modern tropis.',
    coverImage: '/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png',
    gallery: [
      {
        imageUrl: '/uploads/project_done/ahKGulPHqwNDLemCcSLEKSXDJeDvougfMgY39Opt.png',
        caption: 'Tampak depan fasad',
      },
      {
        imageUrl: '/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png',
        caption: 'Detail hasil pengerjaan',
      },
    ],
  },
  {
    title: 'Renovasi Hunian Keluarga',
    category: 'Renovasi',
    budgetRange: 'Termin Progres',
    completionDate: new Date('2026-02-20'),
    description:
      'Transformasi hunian lama menjadi ruang keluarga yang lebih lapang, terang, dan fungsional.',
    coverImage: '/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png',
    gallery: [
      {
        imageUrl: '/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png',
        caption: 'Area utama setelah renovasi',
      },
    ],
  },
  {
    title: 'Finishing Interior Hunian',
    category: 'Interior',
    budgetRange: 'Material Terpilih',
    completionDate: new Date('2026-05-12'),
    description:
      'Penyelesaian interior hunian dengan perhatian pada detail, fungsi, dan kerapian finishing.',
    coverImage: '/uploads/project_done/ahKGulPHqwNDLemCcSLEKSXDJeDvougfMgY39Opt.png',
    gallery: [
      {
        imageUrl: '/uploads/project_done/bt3W97OnjLZOEkAJ0biK085nfFDp4xbWsPnxEoeZ.png',
        caption: 'Detail finishing interior',
      },
    ],
  },
];

const ongoingProjectsData = [
  {
    title: 'Renovasi Rumah Tinggal & Kolam Renang',
    location: 'Cinere, Depok',
    progressPercentage: 70,
    description: 'Tahap pemasangan keramik, plafon, dan finishing area kolam renang.',
    imageUrl: '/uploads/ongoing_project/EMnZBbZXShmZfC9I4GUIAL898DBmctQjOJcgOnlg.png',
  },
  {
    title: 'Pembangunan Rumah Baru',
    location: 'Depok',
    progressPercentage: 54,
    description: 'Pekerjaan struktur dan dinding berjalan sesuai jadwal termin.',
    imageUrl: '/uploads/ongoing_project/emHd2slnV7EYLcSjcXplQEq56cNv0wDqnFtbt3qt.png',
  },
  {
    title: 'Pengerjaan Finishing Hunian',
    location: 'Bogor',
    progressPercentage: 86,
    description: 'Pengecekan detail akhir dan persiapan serah terima bertahap.',
    imageUrl: '/uploads/ongoing_project/o45KoPV4rTnXoPHEQRyjDjdipUJhA8eMC6lacgOf.png',
  },
];

const interiorsData = [
  {
    roomType: 'Living Room',
    style: 'Modern Japandi',
    description: 'Ruang keluarga hangat dengan elemen kayu dan komposisi penyimpanan yang rapi.',
    imageUrl: '/uploads/design_interior/Dbv5R7GLSW043VSbWSHwVItODLgid6THJfLn5Mi5.png',
  },
  {
    roomType: 'Kitchen Set',
    style: 'Contemporary',
    description: 'Kitchen set custom dengan layout penyimpanan presisi dan material HPL pilihan.',
    imageUrl: '/uploads/design_interior/F0hXjhkzPXMMTXXgswIN5Jclojjb7PH3isKK6PRH.png',
  },
  {
    roomType: 'Bedroom',
    style: 'Modern Minimalis',
    description: 'Kamar nyaman dengan penyimpanan built-in dan warna natural yang tenang.',
    imageUrl: '/uploads/design_interior/Pni31dq7Oin6qKqwgZnQrMZHKIyDdVaWYPaW9PXO.png',
  },
];

async function main() {
  console.log('Memulai seed KilauBuild...');

  const hashedPassword = await bcrypt.hash('Password123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@kilaubuild.com' },
    update: { name: 'Admin' },
    create: {
      name: 'Admin',
      email: 'admin@kilaubuild.com',
      password: hashedPassword,
      role: Role.SUPERADMIN,
    },
  });

  for (const stat of statsData) {
    const existing = await prisma.statistic.findFirst({ where: { title: stat.title } });
    if (existing) await prisma.statistic.update({ where: { id: existing.id }, data: stat });
    else await prisma.statistic.create({ data: stat });
  }

  for (const faq of faqData) {
    const existing = await prisma.faq.findFirst({
      where: {
        OR: [{ question: faq.question }, { order: faq.order }],
      },
      orderBy: { createdAt: 'asc' },
    });
    if (existing) await prisma.faq.update({ where: { id: existing.id }, data: faq });
    else await prisma.faq.create({ data: faq });

    const duplicates = await prisma.faq.findMany({
      where: { question: faq.question },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });
    if (duplicates.length > 1) {
      await prisma.faq.deleteMany({
        where: { id: { in: duplicates.slice(1).map(({ id }) => id) } },
      });
    }
  }

  for (const testimony of testimonyData) {
    const existing = await prisma.testimony.findFirst({ where: { clientName: testimony.clientName } });
    if (existing) await prisma.testimony.update({ where: { id: existing.id }, data: testimony });
    else await prisma.testimony.create({ data: testimony });
  }

  for (const project of doneProjectsData) {
    const { gallery, ...projectData } = project;
    const existing = await prisma.projectDone.findFirst({ where: { title: project.title } });

    if (existing) {
      await prisma.projectDone.update({ where: { id: existing.id }, data: projectData });
      const imageCount = await prisma.projectImage.count({ where: { projectDoneId: existing.id } });
      if (imageCount === 0) {
        await prisma.projectImage.createMany({
          data: gallery.map((image) => ({ ...image, projectDoneId: existing.id })),
        });
      }
    } else {
      await prisma.projectDone.create({
        data: { ...projectData, gallery: { create: gallery } },
      });
    }
  }

  for (const project of ongoingProjectsData) {
    const existing = await prisma.ongoingProject.findFirst({ where: { title: project.title } });
    if (existing) await prisma.ongoingProject.update({ where: { id: existing.id }, data: project });
    else await prisma.ongoingProject.create({ data: project });
  }

  for (const interior of interiorsData) {
    const existing = await prisma.desainInterior.findFirst({ where: { roomType: interior.roomType } });
    if (existing) await prisma.desainInterior.update({ where: { id: existing.id }, data: interior });
    else await prisma.desainInterior.create({ data: interior });
  }

  console.log('Seed KilauBuild selesai. Data dapat dijalankan ulang tanpa duplikasi.');
}

main()
  .catch((error: unknown) => {
    console.error('Seed gagal:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
