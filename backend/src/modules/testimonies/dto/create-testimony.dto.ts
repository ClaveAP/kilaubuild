import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateTestimonyDto {
  @ApiProperty({ example: 'Bapak Hendra & Ibu Rina', description: 'Nama klien' })
  @IsString()
  @IsNotEmpty({ message: 'Nama klien tidak boleh kosong' })
  clientName: string;

  @ApiProperty({ example: 'Renovasi Total Rumah 2 Lantai', description: 'Jenis proyek yang dikerjakan' })
  @IsString()
  @IsNotEmpty({ message: 'Jenis proyek tidak boleh kosong' })
  projectType: string;

  @ApiProperty({
    example: 'Pengerjaan sangat rapi, tepat waktu, dan sistem bayar setelah progres benar-benar bikin tenang.',
    description: 'Teks ulasan klien',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ulasan tidak boleh kosong' })
  review: string;

  @ApiProperty({ example: 5, description: 'Rating kepuasan skala 1-5' })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({ example: '/uploads/testimonies/client1.jpg', description: 'URL foto klien' })
  @IsString()
  @IsOptional()
  photoUrl?: string;
}
