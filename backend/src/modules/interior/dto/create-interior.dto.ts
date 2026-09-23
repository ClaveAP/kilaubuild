import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInteriorDto {
  @ApiProperty({ example: 'Living Room', description: 'Tipe ruangan (Living Room, Kitchen Set, Bedroom, dll.)' })
  @IsString()
  @IsNotEmpty({ message: 'Tipe ruangan tidak boleh kosong' })
  roomType: string;

  @ApiProperty({ example: 'Modern Japandi', description: 'Gaya desain (Modern Luxury, Japandi, Minimalis, Industrial)' })
  @IsString()
  @IsNotEmpty({ message: 'Gaya desain tidak boleh kosong' })
  style: string;

  @ApiPropertyOptional({
    example: 'Pemanfaatan material kayu warm oak dengan pencahayaan warm white ambient.',
    description: 'Deskripsi konsep interior',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '/uploads/interior/living1.jpg', description: 'URL gambar render / foto asli interior' })
  @IsString()
  @IsNotEmpty({ message: 'URL gambar tidak boleh kosong' })
  imageUrl: string;
}
