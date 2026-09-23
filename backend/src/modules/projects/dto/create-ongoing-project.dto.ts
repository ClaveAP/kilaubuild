import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateOngoingProjectDto {
  @ApiProperty({ example: 'Renovasi Villa & Kolam Renang', description: 'Nama proyek yang sedang berjalan' })
  @IsString()
  @IsNotEmpty({ message: 'Judul proyek tidak boleh kosong' })
  title: string;

  @ApiProperty({ example: 'Sentul, Bogor', description: 'Lokasi pengerjaan proyek' })
  @IsString()
  @IsNotEmpty({ message: 'Lokasi proyek tidak boleh kosong' })
  location: string;

  @ApiProperty({ example: 65, description: 'Persentase progres pengerjaan (0 - 100)' })
  @IsInt()
  @Min(0)
  @Max(100)
  progressPercentage: number;

  @ApiPropertyOptional({
    example: 'Tahap instalasi mechanical electrical & finishing plester dinding.',
    description: 'Deskripsi tahapan progres saat ini',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '/uploads/projects/ongoing1.jpg', description: 'URL foto dokumentasi lapangan' })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}
