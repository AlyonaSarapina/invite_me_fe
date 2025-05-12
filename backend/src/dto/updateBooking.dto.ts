import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateBookingDto } from './createBooking.dto';
import { BookingStatus } from 'src/enums/bookingStatus.enum';

export class UpdateBookingStatusDto extends PartialType(CreateBookingDto) {
  @IsOptional()
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
