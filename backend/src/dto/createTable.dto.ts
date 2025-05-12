import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateTableDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  table_number: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  table_capacity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  restaurant_id: number;
}
