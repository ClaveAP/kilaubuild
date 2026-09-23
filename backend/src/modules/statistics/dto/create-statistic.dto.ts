import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStatisticDto {
  @ApiProperty({ example: 'Proyek Selesai', description: 'Judul indikator statistik' })
  @IsString()
  @IsNotEmpty({ message: 'Judul statistik tidak boleh kosong' })
  title: string;

  @ApiProperty({ example: '150+', description: 'Nilai angka/teks pencapaian' })
  @IsString()
  @IsNotEmpty({ message: 'Nilai statistik tidak boleh kosong' })
  value: string;

  @ApiPropertyOptional({ example: 'Unit / Rumah', description: 'Satuan ukuran' })
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional({ example: 1, description: 'Urutan tampilan' })
  @IsInt()
  @IsOptional()
  order?: number;
}
