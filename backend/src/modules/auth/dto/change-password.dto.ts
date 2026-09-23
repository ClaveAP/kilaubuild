import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'Password123!',
    description: 'Password lama saat ini',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password lama tidak boleh kosong' })
  oldPassword: string;

  @ApiProperty({
    example: 'PasswordBaru2026@',
    description:
      'Password baru (minimal 8 karakter, ada huruf besar, huruf kecil, angka, dan simbol)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password baru tidak boleh kosong' })
  @MinLength(8, { message: 'Password baru minimal 8 karakter' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    {
      message:
        'Password baru wajib mengandung minimal 1 huruf besar, 1 huruf kecil, 1 angka, dan 1 simbol (@$!%*?&)',
    },
  )
  newPassword: string;
}
