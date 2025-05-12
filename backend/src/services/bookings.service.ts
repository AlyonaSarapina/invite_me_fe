import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/db/entities/booking.entity';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { Table } from 'src/db/entities/table.entity';
import { User } from 'src/db/entities/user.entity';
import { CreateBookingDto } from 'src/dto/createBooking.dto';
import { In, IsNull, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { TablesService } from './tables.service';
import { RestaurantsService } from './restaurants.service';
import { throwConflict, throwForbidden, throwNotFound } from 'src/utils/exceprions.utils';
import { UsersService } from './users.service';
import { UserRole } from 'src/enums/userRole.enum';
import { BookingStatus } from 'src/enums/bookingStatus.enum';
import { UpdateBookingStatusDto } from 'src/dto/updateBooking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    private readonly userService: UsersService,
    private readonly restaurantService: RestaurantsService,
    private readonly tableService: TablesService,
  ) {}

  async getClientsBookings(userId: number): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { client: { id: userId }, deleted_at: IsNull() },
      relations: ['table', 'client'],
    });
  }

  async getOwnersBookings(userId: number): Promise<Booking[]> {
    const ownerRestaurants = await this.restaurantService.getOwnedRestaurants(userId);

    const tableIds = ownerRestaurants
      .flatMap((restaurant: Restaurant) => restaurant.tables)
      .map((table: Table) => table.id);

    if (!tableIds.length) return [];

    return this.bookingRepo.find({
      where: {
        table: In(tableIds),
        deleted_at: IsNull(),
      },
      relations: ['table', 'client'],
    });
  }

  async createBooking(restaurantId: number, createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const { num_people, start_time, end_time, clientPhoneNumber } = createBookingDto;
    const start_date = new Date(start_time);
    const end_date = new Date(end_time);
    const isOwner = user.role === UserRole.OWNER;

    if (isOwner && !clientPhoneNumber)
      throwConflict('You need to provide the client contact information (phone number) to create the booking');

    const client = isOwner ? await this.userService.getUserByPhone(clientPhoneNumber) : user;

    if (!client) throwNotFound('Client');

    const restaurant = await this.restaurantService.getRestaurantById(restaurantId);

    if (isOwner && restaurant.owner.id !== user.id) throwForbidden('You cannot book for a restaurant you do not own');

    const table = await this.findAvailableTable(restaurantId, start_date, end_date, num_people);

    if (!table) throwNotFound('No free table at the selected time');

    const booking = this.bookingRepo.create({
      num_people,
      start_time,
      end_time,
      status: BookingStatus.CONFIRMED,
      client: client,
      table,
    });

    return await this.bookingRepo.save(booking);
  }

  async findAvailableTable(
    restaurantId: number,
    startTime: Date,
    endTime: Date,
    numPeople: number,
    excludeBookingId?: number,
  ): Promise<Table | null> {
    const tables = await this.tableService.getTablesByRestaurant(restaurantId);

    const suitableTables = tables.filter((table) => table.table_capacity >= numPeople);

    if (!suitableTables.length) return null;

    const bookingConflicts = await Promise.all(
      suitableTables.map((table) => {
        return this.bookingRepo.find({
          where: {
            table: { id: table.id },
            status: BookingStatus.CONFIRMED,
            start_time: LessThan(endTime),
            end_time: MoreThan(startTime),
            ...(excludeBookingId && { id: Not(excludeBookingId) }),
          },
        });
      }),
    );

    const availableTable = tables.find((_, index) => bookingConflicts[index].length === 0);

    return availableTable ?? null;
  }

  async updateBooking(id: number, updateBookingStatusDto: UpdateBookingStatusDto, user: User): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['table', 'client', 'table.restaurant', 'table.restaurant.owner'],
    });

    if (!booking) throwNotFound('Booking');

    this.ensureBookingAccess(booking, user);

    const { num_people, start_time, end_time, status } = updateBookingStatusDto;

    if (status) {
      booking.status = status;
    }

    const isTimeUpdated = start_time && end_time;
    const isPeopleUpdated = num_people && num_people !== booking.num_people;

    if (isTimeUpdated || isPeopleUpdated) {
      const new_start_time = start_time ? new Date(start_time) : booking.start_time;
      const new_end_time = end_time ? new Date(end_time) : booking.end_time;
      const new_people = num_people ?? booking.num_people;

      const availableTable = await this.findAvailableTable(
        booking.table.restaurant.id,
        new_start_time,
        new_end_time,
        new_people,
        booking.id,
      );

      if (!availableTable) throwConflict('No available tables for the updated time and group size');

      booking.table = availableTable;
      booking.start_time = new_start_time;
      booking.end_time = new_end_time;
      booking.num_people = new_people;
    }

    return await this.bookingRepo.save(booking);
  }

  async cancelBooking(id: number, user: User): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      withDeleted: false,
      relations: ['client'],
    });

    if (!booking) throwNotFound('Booking');

    if (booking.client.id !== user.id) throwForbidden('You are not allowed to cancel this booking');

    booking.status = BookingStatus.CANCELED;

    const canceledBooking = await this.bookingRepo.save(booking);

    await this.bookingRepo.softRemove(booking);

    return canceledBooking;
  }

  private ensureBookingAccess(booking: Booking, user: User): void {
    if (user.role === UserRole.CLIENT && booking.client.id !== user.id) {
      throwForbidden('You can only update your own bookings');
    }

    if (user.role === UserRole.OWNER && booking.table.restaurant.owner.id !== user.id) {
      throwForbidden('You can only update bookings in your own restaurants');
    }
  }
}
