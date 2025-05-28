import { IsOptional, IsEnum, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { BookingStatus } from '../enums/bookingStatus.enum';

export class GetBookingsQueryDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  offset?: number;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsString()
  restaurantName?: string;

  @IsOptional()
  @IsEnum(['newest', 'oldest'])
  sortOrder?: 'newest' | 'oldest';
}
