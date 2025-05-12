import { Module } from '@nestjs/common';
import { RestaurantsController } from '../controllers/restaurants.controller';
import { RestaurantsService } from '../services/restaurants.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { CloudinaryService } from 'src/services/cloudinary.service';
import { CloudinaryModule } from './cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant]), CloudinaryModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantModule {}
