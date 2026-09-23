import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class BookingCalendarQueryDto {
  @ApiProperty({
    example: '2026-09',
    description: 'Bulan kalender dalam format YYYY-MM',
  })
  @IsString()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/, {
    message: 'Format bulan harus YYYY-MM, contoh 2026-09',
  })
  month: string;
}
