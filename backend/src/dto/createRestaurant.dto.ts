import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, IsUrl, IsNumber, IsBoolean, Min, Max, IsOptional } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  operating_hours: object;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  booking_duration: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  tables_capacity: number;

  @IsNotEmpty()
  @IsString()
  cuisine: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsUrl()
  inst_url: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsBoolean()
  is_pet_friendly: boolean;
}
