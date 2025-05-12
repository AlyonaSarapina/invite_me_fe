import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/db/entities/user.entity';
import { Restaurant } from './src/db/entities/restaurant.entity';
import { Table } from './src/db/entities/table.entity';
import { Booking } from './src/db/entities/booking.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [User, Restaurant, Table, Booking],
  migrations: ['src/db/migrations/*.ts'],
});
