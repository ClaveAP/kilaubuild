import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getOverview() {
    const [
      totalProjectsDone,
      totalOngoingProjects,
      totalBookings,
      pendingBookings,
      totalContacts,
      unreadContacts,
      totalTestimonials,
      totalFaqs,
      recentBookings,
      recentContacts,
    ] = await Promise.all([
      this.prisma.projectDone.count(),
      this.prisma.ongoingProject.count(),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { status: BookingStatus.PENDING } }),
      this.prisma.contact.count(),
      this.prisma.contact.count({ where: { isRead: false } }),
      this.prisma.testimony.count(),
      this.prisma.faq.count({ where: { isActive: true } }),
      this.prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contact.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      metrics: {
        totalProjectsDone,
        totalOngoingProjects,
        totalBookings,
        pendingBookings,
        totalContacts,
        unreadContacts,
        totalTestimonials,
        totalFaqs,
      },
      recentBookings,
      recentContacts,
    };
  }
}
