import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { BookingStatus, Prisma } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // Helper untuk normalisasi tanggal ke jam 00:00:00 UTC
  private normalizeDate(dateStr: string): Date {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      throw new BadRequestException('Format tanggal tidak valid');
    }
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  }

  private assertBusinessDay(date: Date): void {
    const day = date.getUTCDay();
    if (day === 0 || day === 6) {
      throw new BadRequestException('Survey hanya tersedia pada hari kerja, Senin sampai Jumat');
    }
  }

  private assertBusinessHour(time: string): void {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const openingMinutes = 9 * 60;
    const closingMinutes = 20 * 60;

    if (totalMinutes < openingMinutes || totalMinutes > closingMinutes) {
      throw new BadRequestException('Jam survey harus antara 09:00 dan 20:00 WIB');
    }

    if (minutes % 30 !== 0) {
      throw new BadRequestException('Jam survey tersedia dalam interval 30 menit');
    }
  }

  private assertFutureBooking(date: string, time: string): void {
    const jakartaNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const today = [
      jakartaNow.getUTCFullYear(),
      String(jakartaNow.getUTCMonth() + 1).padStart(2, '0'),
      String(jakartaNow.getUTCDate()).padStart(2, '0'),
    ].join('-');

    if (date < today) {
      throw new BadRequestException('Tanggal booking tidak boleh di masa lalu');
    }

    if (date === today) {
      const currentMinutes = jakartaNow.getUTCHours() * 60 + jakartaNow.getUTCMinutes();
      const [hours, minutes] = time.split(':').map(Number);
      if (hours * 60 + minutes <= currentMinutes) {
        throw new BadRequestException('Jam booking harus lebih besar dari waktu saat ini');
      }
    }
  }

  private isTimeOccupied(requestedTime: string, storedTime: string): boolean {
    if (!storedTime.includes(' - ')) return storedTime === requestedTime;

    const [startTime, endTime] = storedTime.split(' - ');
    const [requestedHours, requestedMinutes] = requestedTime.split(':').map(Number);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const requested = requestedHours * 60 + requestedMinutes;
    const start = startHours * 60 + startMinutes;
    const end = endHours * 60 + endMinutes;

    return requested >= start && requested < end;
  }

  async getAvailability(dateStr: string) {
    const targetDate = this.normalizeDate(dateStr);
    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    // Ambil seluruh booking aktif di tanggal tersebut
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        bookingDate: {
          gte: targetDate,
          lt: nextDate,
        },
        status: {
          in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
        },
      },
      select: {
        timeSlot: true,
        status: true,
      },
    });

    const bookedTimes = existingBookings.map((booking) => booking.timeSlot).sort();

    return {
      date: dateStr,
      isBusinessDay: ![0, 6].includes(targetDate.getUTCDay()),
      businessHours: { opensAt: '09:00', closesAt: '20:00', intervalMinutes: 30 },
      bookedTimes,
    };
  }

  async getCalendar(month: string) {
    const [year, monthNumber] = month.split('-').map(Number);
    const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNumber, 1));

    const bookings = await this.prisma.booking.findMany({
      where: {
        bookingDate: { gte: startDate, lt: endDate },
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
      select: { bookingDate: true, timeSlot: true },
      orderBy: [{ bookingDate: 'asc' }, { timeSlot: 'asc' }],
    });

    const groupedDates = new Map<string, string[]>();
    for (const booking of bookings) {
      const date = booking.bookingDate.toISOString().slice(0, 10);
      const bookedTimes = groupedDates.get(date) ?? [];
      bookedTimes.push(booking.timeSlot);
      groupedDates.set(date, bookedTimes);
    }

    return {
      month,
      timezone: 'Asia/Jakarta',
      businessDays: [1, 2, 3, 4, 5],
      businessHours: { opensAt: '09:00', closesAt: '20:00', intervalMinutes: 30 },
      dates: Array.from(groupedDates, ([date, bookedTimes]) => ({
        date,
        bookingCount: bookedTimes.length,
        bookedTimes,
      })),
    };
  }

  async create(dto: CreateBookingDto) {
    const targetDate = this.normalizeDate(dto.bookingDate);
    this.assertBusinessDay(targetDate);
    this.assertBusinessHour(dto.timeSlot);
    this.assertFutureBooking(dto.bookingDate, dto.timeSlot);

    const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    let booking;
    try {
      booking = await this.prisma.$transaction(
        async (transaction) => {
          const bookingsOnDate = await transaction.booking.findMany({
            where: {
              bookingDate: { gte: targetDate, lt: nextDate },
              status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
            },
            select: { timeSlot: true },
          });

          if (bookingsOnDate.some(({ timeSlot }) => this.isTimeOccupied(dto.timeSlot, timeSlot))) {
            throw new ConflictException(
              `Jam ${dto.timeSlot} pada ${dto.bookingDate} sudah dibooking. Silakan pilih jam lain.`,
            );
          }

          return transaction.booking.create({
            data: {
              clientName: dto.clientName,
              email: dto.email,
              phone: dto.phone,
              serviceType: dto.serviceType,
              bookingDate: targetDate,
              timeSlot: dto.timeSlot,
              location: dto.location,
              notes: dto.notes,
              status: BookingStatus.PENDING,
            },
          });
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error: unknown) {
      if (error instanceof ConflictException) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        throw new ConflictException('Jadwal baru saja diambil pengguna lain. Silakan pilih jam lain.');
      }
      throw error;
    }

    // Buat format WhatsApp direct link
    const waText = encodeURIComponent(
      `Halo Admin KilauBuild, saya telah mengajukan booking survey:\n\n` +
        `👤 Nama: ${booking.clientName}\n` +
        `📅 Tanggal: ${dto.bookingDate}\n` +
        `⏰ Waktu: ${booking.timeSlot}\n` +
        `🛠 Layanan: ${booking.serviceType}\n` +
        `📍 Lokasi: ${booking.location}\n\n` +
        `Mohon konfirmasi jadwalnya ya, terima kasih!`,
    );
    const whatsappUrl = `https://wa.me/6287776360795?text=${waText}`;

    return {
      message: 'Booking survey berhasil diajukan! Jadwal Anda telah diamankan di sistem.',
      data: {
        booking,
        whatsappUrl,
      },
    };
  }

  async findAll(status?: BookingStatus, dateStr?: string) {
    let dateFilter = undefined;
    if (dateStr) {
      const targetDate = this.normalizeDate(dateStr);
      const nextDate = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);
      dateFilter = { gte: targetDate, lt: nextDate };
    }

    return this.prisma.booking.findMany({
      where: {
        status: status ? status : undefined,
        bookingDate: dateFilter,
      },
      orderBy: { bookingDate: 'desc' },
    });
  }

  async findOne(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan`);
    }

    return booking;
  }

  async updateStatus(id: string, status: BookingStatus) {
    await this.findOne(id);
    return this.prisma.booking.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.booking.delete({
      where: { id },
    });
  }
}
