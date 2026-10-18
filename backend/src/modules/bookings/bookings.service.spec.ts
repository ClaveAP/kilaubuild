import { BadRequestException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../database/prisma.service.js';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';

describe('BookingsService', () => {
  const findMany = vi.fn();
  const prisma = {
    booking: { findMany },
    $transaction: vi.fn(),
  } as unknown as PrismaService;

  let service: BookingsService;

  beforeEach(() => {
    vi.clearAllMocks();
    (prisma.$transaction as unknown as ReturnType<typeof vi.fn>).mockImplementation(async (callback: (tx: unknown) => Promise<unknown>) => {
      return callback({
        booking: {
          findMany: vi.fn().mockResolvedValue([]),
          create: vi.fn().mockImplementation(({ data }) => ({
            id: 'booking-1',
            ...data,
            status: 'PENDING',
            createdAt: new Date(),
            updatedAt: new Date(),
          })),
        },
      });
    });
    service = new BookingsService(prisma);
  });

  it('groups booked times by date without exposing client data', async () => {
    findMany.mockResolvedValue([
      { bookingDate: new Date('2099-01-05T00:00:00.000Z'), timeSlot: '09:30' },
      { bookingDate: new Date('2099-01-05T00:00:00.000Z'), timeSlot: '13:00' },
      { bookingDate: new Date('2099-01-06T00:00:00.000Z'), timeSlot: '10:00' },
    ]);

    const calendar = await service.getCalendar('2099-01');

    expect(calendar.dates).toEqual([
      { date: '2099-01-05', bookingCount: 2, bookedTimes: ['09:30', '13:00'] },
      { date: '2099-01-06', bookingCount: 1, bookedTimes: ['10:00'] },
    ]);
    expect(calendar.businessHours).toEqual({
      opensAt: '09:00',
      closesAt: '20:00',
      intervalMinutes: 30,
    });
  });

  it('allows weekend bookings', async () => {
    await expect(service.create(createDto('2099-01-03', '10:00'))).resolves.toBeDefined();
  });

  it('rejects times outside business hours', async () => {
    await expect(service.create(createDto('2099-01-05', '08:30'))).rejects.toThrow(
      'Jam survey harus antara 09:00 dan 20:00 WIB',
    );
  });

  it('rejects times outside the 30 minute interval', async () => {
    await expect(service.create(createDto('2099-01-05', '09:15'))).rejects.toThrow(
      'Jam survey tersedia dalam interval 30 menit',
    );
  });
});

const createDto = (bookingDate: string, timeSlot: string): CreateBookingDto => ({
  clientName: 'Budi Santoso',
  email: 'budi@example.com',
  phone: '081234567890',
  serviceType: 'Bangun Rumah Baru',
  bookingDate,
  timeSlot,
  location: 'Depok',
});
