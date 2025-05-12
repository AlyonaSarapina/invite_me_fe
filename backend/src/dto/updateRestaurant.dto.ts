import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantDto } from './createRestaurant.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
