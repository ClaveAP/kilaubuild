import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    example: 'admin@kilaubuild.com',
    description: 'Email terdaftar akun admin',
  })
  @IsEmail({}, { message: 'Format email tidak valid (wajib mengandung @ dan domain valid)' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong' })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password akun admin',
  })
  @IsString({ message: 'Password harus berupa string' })
  @IsNotEmpty({ message: 'Password tidak boleh kosong' })
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;
}
