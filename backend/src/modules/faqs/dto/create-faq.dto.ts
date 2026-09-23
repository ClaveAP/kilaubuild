import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateFaqDto {
  @ApiProperty({ example: 'Apakah ada garansi setelah renovasi selesai?', description: 'Pertanyaan FAQ' })
  @IsString()
  @IsNotEmpty({ message: 'Pertanyaan tidak boleh kosong' })
  question: string;

  @ApiProperty({ example: 'Ya, KilauBuild memberikan garansi pemeliharaan hingga 3 bulan setelah serah terima proyek.', description: 'Jawaban FAQ' })
  @IsString()
  @IsNotEmpty({ message: 'Jawaban tidak boleh kosong' })
  answer: string;

  @ApiPropertyOptional({ example: 1, description: 'Urutan tampilan' })
  @IsInt()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true, description: 'Status aktif tampil di web' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
