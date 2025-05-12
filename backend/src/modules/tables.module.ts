import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from 'src/db/entities/table.entity';
import { TablesService } from 'src/services/tables.service';
import { TablesController } from 'src/controllers/tables.controller';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { RestaurantModule } from './restaurants.module';

@Module({
  imports: [TypeOrmModule.forFeature([Table, Restaurant]), RestaurantModule],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
