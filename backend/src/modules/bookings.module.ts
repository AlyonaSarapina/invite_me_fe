import { Module } from '@nestjs/common';
import { BookingsController } from '../controllers/bookings.controller';
import { BookingsService } from '../services/bookings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/db/entities/booking.entity';
import { TablesService } from 'src/services/tables.service';
import { RestaurantsService } from 'src/services/restaurants.service';
import { UsersService } from 'src/services/users.service';
import { RestaurantModule } from './restaurants.module';
import { TablesModule } from './tables.module';
import { UsersModule } from './users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), RestaurantModule, TablesModule, UsersModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
