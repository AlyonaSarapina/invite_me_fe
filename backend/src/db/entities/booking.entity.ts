import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Table } from './table.entity';
import { User } from './user.entity';
import { BookingStatus } from 'src/enums/bookingStatus.enum';

@Entity({ schema: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  num_people: number;

  @Column({ type: 'timestamptz' })
  start_time: Date;

  @Column({ type: 'timestamptz' })
  end_time: Date;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
  status: BookingStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Table, (table) => table.bookings)
  @JoinColumn({ name: 'table_id' })
  table: Table;

  @ManyToOne(() => User, (user) => user.bookings)
  @JoinColumn({ name: 'client_id' })
  client: User;
}
