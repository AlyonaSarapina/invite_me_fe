import { IsOptional, IsString, IsNumber, Min, Max, IsBoolean, IsIn, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CUISINES } from 'src/enums/cuisinesEnum';

export class GetRestaurantsQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',').map((c: string) => c.trim()) : value))
  @IsArray()
  @IsIn(CUISINES, { each: true })
  cuisine?: string[];

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(5)
  min_rating?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  is_pet_friendly?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  offset?: number;
}
