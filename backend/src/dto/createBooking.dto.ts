import { Optional } from '@nestjs/common';
import { IsDateString, IsInt, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  @Max(10)
  num_people: number;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @Optional()
  @IsInt()
  clientPhoneNumber: string;
}
