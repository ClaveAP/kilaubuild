import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingStatusDto {
  @ApiProperty({
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
    description: 'Status baru booking survey',
  })
  @IsEnum(BookingStatus, {
    message: 'Status harus salah satu dari: PENDING, CONFIRMED, CANCELLED, COMPLETED',
  })
  @IsNotEmpty({ message: 'Status tidak boleh kosong' })
  status: BookingStatus;
}
