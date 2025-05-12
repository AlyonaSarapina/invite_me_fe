import { IsNotEmpty, IsString, IsEmail, IsPhoneNumber, IsUrl, IsNumber, IsBoolean, Min, Max } from 'class-validator';

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
  @IsNumber()
  booking_duration: number;

  @IsNotEmpty()
  @IsNumber()
  tables_capacity: number;

  @IsNotEmpty()
  @IsString()
  cuisine: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsUrl()
  inst_url: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsBoolean()
  is_pet_friedly: boolean;
}
