import { IsDateString, IsInt, IsOptional, IsPhoneNumber, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  @Max(10)
  num_people: number;

  @IsDateString()
  start_time: string;

  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Invalid phone number format' })
  clientPhoneNumber: string;
}
