import { IsDateString, IsInt, IsString, Matches, Min } from 'class-validator';

export class AvailableSlotsDto {
  @IsDateString()
  date: string;

  @IsInt()
  @Min(1)
  num_people: number;

  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'start_time must be in HH:mm format (00:00 to 23:59)',
  })
  start_time: string;
}
