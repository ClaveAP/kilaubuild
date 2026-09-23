import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { BookingsService } from './bookings.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto.js';
import { BookingCalendarQueryDto } from './dto/booking-calendar-query.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { BookingStatus } from '@prisma/client';

@ApiTags('Consultation & Survey Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 900000 } }) // Anti spam: max 10 submit per 15 menit
  @Post()
  @ApiOperation({
    summary: 'Booking jadwal survey/konsultasi (Publik - Sistem Kalender Ketat)',
  })
  @ApiResponse({ status: 201, description: 'Booking berhasil diajukan' })
  @ApiResponse({ status: 409, description: 'Slot waktu pada jam tersebut sudah terisi' })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Public()
  @Get('availability')
  @ApiOperation({
    summary: 'Cek ketersediaan slot jam pada tanggal yang dipilih (Publik)',
  })
  @ApiQuery({ name: 'date', required: true, example: '2026-10-15', description: 'Tanggal yang ingin dicek (YYYY-MM-DD)' })
  getAvailability(@Query('date') date: string) {
    return this.bookingsService.getAvailability(date);
  }

  @Public()
  @Get('calendar')
  @ApiOperation({
    summary: 'Lihat tanggal dan jam survey yang telah dibooking dalam satu bulan (Publik)',
  })
  @ApiQuery({ name: 'month', required: true, example: '2026-09', description: 'Bulan kalender (YYYY-MM)' })
  @ApiResponse({ status: 200, description: 'Kalender booking publik tanpa data pribadi klien' })
  getCalendar(@Query() query: BookingCalendarQueryDto) {
    return this.bookingsService.getCalendar(query.month);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Dapatkan seluruh daftar booking survey (Admin)' })
  @ApiQuery({ name: 'status', required: false, enum: BookingStatus, description: 'Filter status booking' })
  @ApiQuery({ name: 'date', required: false, description: 'Filter tanggal booking (YYYY-MM-DD)' })
  findAll(
    @Query('status') status?: BookingStatus,
    @Query('date') date?: string,
  ) {
    return this.bookingsService.findAll(status, date);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Dapatkan detail satu booking survey (Admin)' })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id/status')
  @ApiOperation({ summary: 'Ubah status booking survey (Admin: CONFIRMED, CANCELLED, COMPLETED)' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingsService.updateStatus(id, dto.status);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Hapus data booking survey (Admin)' })
  remove(@Param('id') id: string) {
    return this.bookingsService.remove(id);
  }
}
