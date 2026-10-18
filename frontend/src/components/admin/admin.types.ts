export type AdminNavSection =
  | 'overview'
  | 'projects'
  | 'interior'
  | 'bookings'
  | 'contacts'
  | 'content';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DashboardMetrics {
  totalProjectsDone: number;
  totalOngoingProjects: number;
  totalBookings: number;
  pendingBookings: number;
  totalContacts: number;
  unreadContacts: number;
  totalTestimonials?: number;
  totalFaqs?: number;
}

export interface RecentBooking {
  id: string;
  clientName: string;
  email: string;
  phone: string;
  serviceType: string;
  location: string;
  bookingDate: string;
  timeSlot: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
}

export interface RecentContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardOverviewData {
  metrics: DashboardMetrics;
  recentBookings: RecentBooking[];
  recentContacts: RecentContact[];
}

export interface ProjectDoneItem {
  id: string;
  title: string;
  category: string;
  budgetRange?: string | null;
  completionDate?: string | null;
  description?: string | null;
  coverImage?: string | null;
  gallery?: Array<{ id: string; imageUrl: string; caption?: string | null }>;
  createdAt?: string;
}

export interface OngoingProjectItem {
  id: string;
  title: string;
  location: string;
  progressPercentage: number;
  description?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
}

export interface DesainInteriorItem {
  id: string;
  roomType: string;
  style: string;
  description?: string | null;
  imageUrl: string;
  createdAt?: string;
}

export interface TestimonyItem {
  id: string;
  clientName: string;
  projectType: string;
  review: string;
  rating: number;
  photoUrl?: string | null;
  createdAt?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
}

export interface StatisticItem {
  id: string;
  title: string;
  value: string;
  unit?: string | null;
  order: number;
  createdAt?: string;
}

export interface InstagramPostItem {
  id: string;
  caption?: string | null;
  postUrl: string;
  imageUrl: string;
  createdAt?: string;
}
