import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateContactDto {
  @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap pengirim pesan' })
  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong' })
  name: string;

  @ApiProperty({ example: 'budi.santoso@gmail.com', description: 'Alamat email pengirim' })
  @IsEmail({}, { message: 'Format email tidak valid (wajib format email yang benar)' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email: string;

  @ApiPropertyOptional({ example: '081234567890', description: 'Nomor telepon / WhatsApp' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Konsultasi Bangun Rumah 2 Lantai', description: 'Subjek pesan' })
  @IsString()
  @IsOptional()
  subject?: string;

  @ApiProperty({
    example: 'Halo tim KilauBuild, saya memiliki lahan 10x15m di Depok dan berencana membangun rumah tinggal minimalis...',
    description: 'Isi detail pesan atau pertanyaan',
  })
  @IsString()
  @IsNotEmpty({ message: 'Pesan tidak boleh kosong' })
  message: string;
}
