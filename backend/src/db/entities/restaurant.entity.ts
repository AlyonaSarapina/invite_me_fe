import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Table } from './table.entity';

@Entity({ schema: 'restaurants' })
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'json' })
  operating_hours: JSON;

  @Column()
  booking_duration: number;

  @Column()
  tables_capacity: number;

  @Column()
  cuisine: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ nullable: true })
  menu_url: string;

  @Column()
  phone: string;

  @Column()
  inst_url: string;

  @Column({ type: 'decimal', precision: 3, scale: 2 })
  rating: number;

  @Column()
  is_pet_friedly: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => User, (user) => user.restaurants)
  @JoinColumn({ name: 'owner_id' })
  @Index()
  owner: User;

  @OneToMany(() => Table, (table) => table.restaurant)
  tables: Table[];
}
