import { IsDateString, IsInt, IsOptional, IsPhoneNumber, IsString, Max, Min } from 'class-validator';

export class CreateBookingDto {
  @IsInt()
  @Min(1)
  @Max(10)
  num_people: number;

  @IsDateString()
  start_time: string;

  @IsOptional()
  @IsString()
  clientPhoneNumber: string;
}
