import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ProjectImageDto {
  @ApiProperty({ example: '/uploads/projects/gallery1.jpg', description: 'URL foto galeri' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiPropertyOptional({ example: 'Tampak Depan Rumah', description: 'Keterangan/caption foto' })
  @IsString()
  @IsOptional()
  caption?: string;
}

export class CreateProjectDoneDto {
  @ApiProperty({ example: 'Hunian Modern Tropis 2 Lantai', description: 'Judul proyek' })
  @IsString()
  @IsNotEmpty({ message: 'Judul proyek tidak boleh kosong' })
  title: string;

  @ApiProperty({ example: 'Residensial', description: 'Kategori proyek (Residensial, Komersial, Kantor, dll.)' })
  @IsString()
  @IsNotEmpty({ message: 'Kategori proyek tidak boleh kosong' })
  category: string;

  @ApiPropertyOptional({ example: 'Rp 400 Jt - Rp 600 Jt', description: 'Estimasi/rentang budget proyek' })
  @IsString()
  @IsOptional()
  budgetRange?: string;

  @ApiPropertyOptional({ example: '2025-10-15', description: 'Tanggal penyelesaian proyek (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  completionDate?: string;

  @ApiPropertyOptional({
    example: 'Pembangunan rumah dari nol dengan konsep open space dan pencahayaan alami maksimal.',
    description: 'Deskripsi lengkap proyek',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: '/uploads/projects/cover1.jpg', description: 'URL gambar cover utama' })
  @IsString()
  @IsOptional()
  coverImage?: string;

  @ApiPropertyOptional({ type: [ProjectImageDto], description: 'Galeri foto dokumentasi proyek' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectImageDto)
  @IsOptional()
  gallery?: ProjectImageDto[];
}
