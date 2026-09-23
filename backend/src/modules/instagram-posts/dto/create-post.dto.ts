import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateInstagramPostDto {
  @ApiPropertyOptional({ example: 'Progres renovasi rumah tinggal 2 lantai di Depok', description: 'Caption postingan' })
  @IsString()
  @IsOptional()
  caption?: string;

  @ApiProperty({ example: 'https://instagram.com/p/Cxyz123', description: 'Tautan postingan Instagram asli' })
  @IsUrl({}, { message: 'URL postingan Instagram harus valid' })
  @IsNotEmpty({ message: 'Tautan postingan Instagram tidak boleh kosong' })
  postUrl: string;

  @ApiProperty({ example: '/uploads/instagram_posts/post1.jpg', description: 'URL gambar thumbnail postingan' })
  @IsString()
  @IsNotEmpty({ message: 'URL gambar tidak boleh kosong' })
  imageUrl: string;
}
