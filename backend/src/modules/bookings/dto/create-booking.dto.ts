import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateBookingDto {
  @ApiProperty({ example: 'Irfan Hakim', description: 'Nama lengkap pemesan' })
  @IsString()
  @IsNotEmpty({ message: 'Nama lengkap tidak boleh kosong' })
  clientName: string;

  @ApiProperty({ example: 'irfan.hakim@gmail.com', description: 'Alamat email aktif' })
  @IsEmail({}, { message: 'Format email tidak valid (wajib mengandung @ dan domain valid)' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({ example: '081289765432', description: 'Nomor WhatsApp aktif' })
  @IsString()
  @IsNotEmpty({ message: 'Nomor WhatsApp tidak boleh kosong' })
  phone: string;

  @ApiProperty({
    example: 'Bangun Rumah Baru',
    description: 'Jenis layanan yang dipilih (Bangun Rumah Baru, Renovasi Total, Desain Interior)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Jenis layanan tidak boleh kosong' })
  serviceType: string;

  @ApiProperty({
    example: '2026-10-15',
    description: 'Tanggal survey atau konsultasi (YYYY-MM-DD)',
  })
  @IsDateString({}, { message: 'Format tanggal harus YYYY-MM-DD yang valid' })
  @IsNotEmpty({ message: 'Tanggal booking tidak boleh kosong' })
  bookingDate: string;

  @ApiProperty({
    example: '13:30',
    description: 'Jam mulai survey dalam format HH:mm, antara 09:00 dan 20:00 WIB',
  })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'Format jam survey harus HH:mm, contoh 13:30',
  })
  @IsNotEmpty({ message: 'Slot waktu tidak boleh kosong' })
  timeSlot: string;

  @ApiProperty({
    example: 'Jl. Margonda Raya No. 45, Beji, Depok',
    description: 'Alamat lengkap lokasi lahan atau bangunan yang akan disurvey',
  })
  @IsString()
  @IsNotEmpty({ message: 'Alamat lokasi survey tidak boleh kosong' })
  location: string;

  @ApiPropertyOptional({
    example: 'Lahan hook ukuran 120m2, rencana bangun 2 lantai gaya scandinavian.',
    description: 'Catatan tambahan atau preferensi klien',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
