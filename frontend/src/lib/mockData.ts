import type {
  DashboardOverviewData,
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
import {
  INITIAL_BOOKINGS,
  INITIAL_CONTACTS,
  INITIAL_DONE_PROJECTS,
  INITIAL_FAQS,
  INITIAL_IG_POSTS,
  INITIAL_INTERIORS,
  INITIAL_ONGOING_PROJECTS,
  INITIAL_STATISTICS,
  INITIAL_TESTIMONIES,
} from './mockSeed';

export * from './mockSeed';

function getStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(`kb_mock_${key}`);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`kb_mock_${key}`, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// Global Mock Dispatcher for Offline / Vercel Fallback
export function handleMockApi(method: string, url: string, data?: unknown): unknown {
  const cleanUrl = url.replace(/^\/api\/v1/, '').replace(/^\//, '');
  const m = method.toUpperCase();

  // 1. Dashboard Overview
  if (cleanUrl === 'dashboard/overview' && m === 'GET') {
    const done = getStorage<ProjectDoneItem[]>('done', INITIAL_DONE_PROJECTS);
    const ongoing = getStorage<OngoingProjectItem[]>('ongoing', INITIAL_ONGOING_PROJECTS);
    const bookings = getStorage<RecentBooking[]>('bookings', INITIAL_BOOKINGS);
    const contacts = getStorage<RecentContact[]>('contacts', INITIAL_CONTACTS);

    const overview: DashboardOverviewData = {
      metrics: {
        totalProjectsDone: done.length,
        totalOngoingProjects: ongoing.length,
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b) => b.status === 'PENDING').length,
        totalContacts: contacts.length,
        unreadContacts: contacts.filter((c) => !c.isRead).length,
      },
      recentBookings: bookings.slice(0, 5),
      recentContacts: contacts.slice(0, 5),
    };
    return overview;
  }

  // 2. Projects Done
  if (cleanUrl.startsWith('projects/done')) {
    const list = getStorage<ProjectDoneItem[]>('done', INITIAL_DONE_PROJECTS);
    const id = cleanUrl.split('/')[2];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<ProjectDoneItem>;
      const newItem: ProjectDoneItem = {
        id: `done-${Date.now()}`,
        title: payload.title || 'Proyek Baru',
        category: payload.category || 'Residensial',
        budgetRange: payload.budgetRange,
        completionDate: payload.completionDate || new Date().toISOString(),
        description: payload.description,
        coverImage: payload.coverImage || '/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png',
        gallery: payload.gallery?.map((g, idx) => ({ id: `gal-${Date.now()}-${idx}`, imageUrl: g.imageUrl, caption: g.caption })),
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('done', updated);
      return newItem;
    }
    if (m === 'PUT' && id) {
      const payload = (data || {}) as Partial<ProjectDoneItem>;
      const updated = list.map((item) => (item.id === id ? { ...item, ...payload } : item));
      setStorage('done', updated);
      return updated.find((i) => i.id === id);
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('done', updated);
      return { success: true };
    }
  }

  // 3. Projects Ongoing
  if (cleanUrl.startsWith('projects/ongoing')) {
    const list = getStorage<OngoingProjectItem[]>('ongoing', INITIAL_ONGOING_PROJECTS);
    const id = cleanUrl.split('/')[2];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<OngoingProjectItem>;
      const newItem: OngoingProjectItem = {
        id: `ongoing-${Date.now()}`,
        title: payload.title || 'Proyek Lapangan Baru',
        location: payload.location || 'Depok',
        progressPercentage: Number(payload.progressPercentage) || 50,
        description: payload.description,
        imageUrl: payload.imageUrl || '/uploads/ongoing_project/EMnZBbZXShmZfC9I4GUIAL898DBmctQjOJcgOnlg.png',
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('ongoing', updated);
      return newItem;
    }
    if (m === 'PUT' && id) {
      const payload = (data || {}) as Partial<OngoingProjectItem>;
      const updated = list.map((item) => (item.id === id ? { ...item, ...payload } : item));
      setStorage('ongoing', updated);
      return updated.find((i) => i.id === id);
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('ongoing', updated);
      return { success: true };
    }
  }

  // 4. Desain Interior
  if (cleanUrl.startsWith('desain-interiors')) {
    const list = getStorage<DesainInteriorItem[]>('interiors', INITIAL_INTERIORS);
    const id = cleanUrl.split('/')[1];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<DesainInteriorItem>;
      const newItem: DesainInteriorItem = {
        id: `interior-${Date.now()}`,
        roomType: payload.roomType || 'Living Room',
        style: payload.style || 'Modern Minimalis',
        description: payload.description,
        imageUrl: payload.imageUrl || '/uploads/design_interior/Dbv5R7GLSW043VSbWSHwVItODLgid6THJfLn5Mi5.png',
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('interiors', updated);
      return newItem;
    }
    if (m === 'PUT' && id) {
      const payload = (data || {}) as Partial<DesainInteriorItem>;
      const updated = list.map((item) => (item.id === id ? { ...item, ...payload } : item));
      setStorage('interiors', updated);
      return updated.find((i) => i.id === id);
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('interiors', updated);
      return { success: true };
    }
  }

  // 5. Bookings
  if (cleanUrl.startsWith('bookings/calendar')) {
    const list = getStorage<RecentBooking[]>('bookings', INITIAL_BOOKINGS);
    const dateMap = new Map<string, string[]>();
    for (const b of list) {
      if (!b.bookingDate) continue;
      const d = b.bookingDate.slice(0, 10);
      const times = dateMap.get(d) || [];
      if (b.timeSlot) times.push(b.timeSlot);
      dateMap.set(d, times);
    }

    const dates = Array.from(dateMap.entries()).map(([date, bookedTimes]) => ({
      date,
      bookingCount: bookedTimes.length,
      bookedTimes,
    }));

    return {
      month: new Date().toISOString().slice(0, 7),
      timezone: 'Asia/Jakarta',
      businessDays: [1, 2, 3, 4, 5, 6],
      businessHours: {
        opensAt: '09:00',
        closesAt: '20:00',
        intervalMinutes: 30,
      },
      dates,
    };
  }

  if (cleanUrl.startsWith('bookings')) {
    const list = getStorage<RecentBooking[]>('bookings', INITIAL_BOOKINGS);
    const parts = cleanUrl.split('?')[0].split('/');
    const id = parts[1];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<RecentBooking>;
      const newItem: RecentBooking = {
        id: `book-${Date.now()}`,
        clientName: payload.clientName || 'Klien Baru',
        email: payload.email || 'klien@example.com',
        phone: payload.phone || '08123456789',
        serviceType: payload.serviceType || 'Bangun Rumah',
        location: payload.location || 'Depok',
        bookingDate: payload.bookingDate || new Date().toISOString(),
        timeSlot: payload.timeSlot || '10:00 WIB',
        status: 'PENDING',
        notes: payload.notes,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('bookings', updated);
      return {
        booking: newItem,
        whatsappUrl: `https://wa.me/6287776360795?text=${encodeURIComponent(
          `Halo KilauBuild, saya telah mengajukan survei lokasi untuk ${newItem.clientName} (${newItem.serviceType}) di ${newItem.location} pada tanggal ${newItem.bookingDate} jam ${newItem.timeSlot}.`
        )}`,
      };
    }
    if (m === 'PATCH' && id && parts[2] === 'status') {
      const payload = (data || {}) as { status: RecentBooking['status'] };
      const updated = list.map((item) => (item.id === id ? { ...item, status: payload.status } : item));
      setStorage('bookings', updated);
      return updated.find((i) => i.id === id);
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('bookings', updated);
      return { success: true };
    }
  }

  // 6. Contacts
  if (cleanUrl.startsWith('contacts')) {
    const list = getStorage<RecentContact[]>('contacts', INITIAL_CONTACTS);
    const parts = cleanUrl.split('/');
    const id = parts[1];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<RecentContact>;
      const newItem: RecentContact = {
        id: `contact-${Date.now()}`,
        name: payload.name || 'Pengunjung Baru',
        email: payload.email || 'pengunjung@example.com',
        phone: payload.phone,
        subject: payload.subject,
        message: payload.message || 'Pesan konsultasi',
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('contacts', updated);
      return newItem;
    }
    if (m === 'PATCH' && id && parts[2] === 'read') {
      const updated = list.map((item) => (item.id === id ? { ...item, isRead: true } : item));
      setStorage('contacts', updated);
      return updated.find((i) => i.id === id);
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('contacts', updated);
      return { success: true };
    }
  }

  // 7. Testimonies
  if (cleanUrl.startsWith('testimonies')) {
    const list = getStorage<TestimonyItem[]>('testimonies', INITIAL_TESTIMONIES);
    const id = cleanUrl.split('/')[1];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<TestimonyItem>;
      const newItem: TestimonyItem = {
        id: `test-${Date.now()}`,
        clientName: payload.clientName || 'Klien Puas',
        projectType: payload.projectType || 'Bangun Rumah',
        review: payload.review || 'Pengerjaan memuaskan.',
        rating: Number(payload.rating) || 5,
        photoUrl: payload.photoUrl,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('testimonies', updated);
      return newItem;
    }
    if (m === 'PUT' && id) {
      const payload = (data || {}) as Partial<TestimonyItem>;
      const updated = list.map((item) => (item.id === id ? { ...item, ...payload } : item));
      setStorage('testimonies', updated);
      return updated.find((i) => i.id === id);
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('testimonies', updated);
      return { success: true };
    }
  }

  // 8. FAQs
  if (cleanUrl.startsWith('faqs')) {
    const list = getStorage<FaqItem[]>('faqs', INITIAL_FAQS);
    const id = cleanUrl.split('/')[1];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<FaqItem>;
      const newItem: FaqItem = {
        id: `faq-${Date.now()}`,
        question: payload.question || 'Pertanyaan Baru',
        answer: payload.answer || 'Jawaban lengkap.',
        order: Number(payload.order) || list.length + 1,
        isActive: payload.isActive ?? true,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('faqs', updated);
      return newItem;
    }
    if (m === 'PUT' && id) {
      const payload = (data || {}) as Partial<FaqItem>;
      const updated = list.map((item) => (item.id === id ? { ...item, ...payload } : item));
      setStorage('faqs', updated);
      return updated.find((i) => i.id === id);
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('faqs', updated);
      return { success: true };
    }
  }

  // 9. Statistics
  if (cleanUrl.startsWith('statistics')) {
    const list = getStorage<StatisticItem[]>('statistics', INITIAL_STATISTICS);
    const id = cleanUrl.split('/')[1];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<StatisticItem>;
      const newItem: StatisticItem = {
        id: `stat-${Date.now()}`,
        title: payload.title || 'Counter Baru',
        value: payload.value || '100+',
        unit: payload.unit,
        order: Number(payload.order) || list.length + 1,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('statistics', updated);
      return newItem;
    }
    if (m === 'PUT' && id) {
      const payload = (data || {}) as Partial<StatisticItem>;
      const updated = list.map((item) => (item.id === id ? { ...item, ...payload } : item));
      setStorage('statistics', updated);
      return updated.find((i) => i.id === id);
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('statistics', updated);
      return { success: true };
    }
  }

  // 10. Instagram Posts
  if (cleanUrl.startsWith('instagram-posts')) {
    const list = getStorage<InstagramPostItem[]>('ig_posts', INITIAL_IG_POSTS);
    const id = cleanUrl.split('/')[1];

    if (m === 'GET') return list;
    if (m === 'POST') {
      const payload = (data || {}) as Partial<InstagramPostItem>;
      const newItem: InstagramPostItem = {
        id: `ig-${Date.now()}`,
        caption: payload.caption || 'Dokumentasi proyek KilauBuild',
        postUrl: payload.postUrl || 'https://instagram.com/kilaubuild',
        imageUrl: payload.imageUrl || '/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png',
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...list];
      setStorage('ig_posts', updated);
      return newItem;
    }
    if (m === 'DELETE' && id) {
      const updated = list.filter((item) => item.id !== id);
      setStorage('ig_posts', updated);
      return { success: true };
    }
  }

  // 11. Media Upload
  if (cleanUrl.startsWith('media/upload') && m === 'POST') {
    return {
      url: '/uploads/project_done/8cX7nIp1q47nOZhJKkMLIqGfGbZUyP3u28l88kTN.png',
      originalName: 'uploaded-photo.png',
      size: 1024,
    };
  }

  // 12. Change Password
  if (cleanUrl.startsWith('auth/change-password') && m === 'POST') {
    return {
      message: 'Kata sandi berhasil diperbarui.',
    };
  }

  return null;
}
