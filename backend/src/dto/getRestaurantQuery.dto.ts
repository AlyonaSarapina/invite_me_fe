import { IsOptional, IsString, IsNumber, Min, Max, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class GetRestaurantsQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  min_rating?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_pet_friedly?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}
