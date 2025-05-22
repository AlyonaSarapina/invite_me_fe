import { Injectable } from '@nestjs/common';
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
import { addMinutes, isBefore, format, subMinutes } from 'date-fns';
import { DaysMap } from 'src/enums/weekDays.enum';
import { AvailableSlotsDto } from 'src/dto/availibleStot.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,

    private readonly userService: UsersService,
    private readonly restaurantService: RestaurantsService,
    private readonly tableService: TablesService,
  ) {}

  private async updateExpiredBookings(bookings: Booking[]): Promise<Booking[]> {
    const now = new Date();
    const expired = bookings.filter((b) => b.status === BookingStatus.CONFIRMED && b.end_time < now);

    for (const booking of expired) {
      booking.status = BookingStatus.COMPLETED;
      await this.bookingRepo.save(booking);
    }

    return bookings;
  }

  async getClientsBookings(userId: number): Promise<Booking[]> {
    const bookings = await this.bookingRepo.find({
      where: { client: { id: userId } },
      relations: ['table', 'table.restaurant', 'client'],
      withDeleted: true,
    });

    return await this.updateExpiredBookings(bookings);
  }

  async getOwnersBookings(userId: number): Promise<Booking[]> {
    const ownerRestaurants = await this.restaurantService.getOwnedRestaurants(userId);

    const tableIds = ownerRestaurants
      .flatMap((restaurant: Restaurant) => restaurant.tables)
      .map((table: Table) => table.id);

    if (!tableIds.length) return [];

    const bookings = await this.bookingRepo.find({
      where: {
        table: In(tableIds),
        deleted_at: IsNull(),
      },
      relations: ['table', 'table.restaurant', 'client'],
    });

    return await this.updateExpiredBookings(bookings);
  }

  async createBooking(restaurantId: number, createBookingDto: CreateBookingDto, user: User): Promise<Booking> {
    const restaurant = await this.restaurantService.getRestaurantById(restaurantId);
    const { num_people, start_time, clientPhoneNumber } = createBookingDto;
    const start_date = new Date(start_time);
    const end_date = addMinutes(start_date, restaurant.booking_duration);
    const isOwner = user.role === UserRole.OWNER;

    if (isOwner && !clientPhoneNumber)
      throwConflict('You need to provide the client contact information (phone number) to create the booking');

    const client = isOwner ? await this.userService.getUserByPhone(clientPhoneNumber as string) : user;

    if (!client) throwNotFound('Client');

    if (isOwner && restaurant.owner.id !== user.id) throwForbidden('You cannot book for a restaurant you do not own');

    const table = await this.findAvailableTable(restaurantId, start_date, end_date, num_people);

    if (!table) throwNotFound('No free table at the selected time');

    const booking = this.bookingRepo.create({
      num_people,
      start_time: start_date,
      end_time: end_date,
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

  private isSlotWithinWorkingHoursAndFuture(slotStart: Date, dateStr: string, operatingHours: string): boolean {
    const now = new Date();

    if (slotStart.getTime() < now.getTime()) {
      return false;
    }

    const [openStr, closeStr] = operatingHours.split('-').map((s) => s.trim());
    const openTime = new Date(`${dateStr}T${openStr}:00`);
    const closeTime = new Date(`${dateStr}T${closeStr}:00`);

    return slotStart >= openTime && slotStart < closeTime;
  }

  async getAvailableBookingSlots(restaurantId: number, availableSlotsDto: AvailableSlotsDto): Promise<string[]> {
    const { date, num_people, start_time } = availableSlotsDto;
    const restaurant = await this.restaurantService.getRestaurantById(restaurantId);

    const { operating_hours, booking_duration } = restaurant;

    const slotDuration = booking_duration;
    const interval = 30;

    const weekDay = DaysMap[new Date(date).getDay()];

    if (!operating_hours[weekDay]) {
      throwNotFound(`Operating hours not defined for day: ${weekDay}`);
    }

    const workingHoursEndStr = `${date}T${operating_hours[weekDay].split('-').map((s) => s.trim())[1]}:00`;

    const workingHoursEnd = new Date(workingHoursEndStr);

    const allSlots: string[] = [];

    let current = subMinutes(new Date(`${date}T${start_time}:00`), 60);

    while (isBefore(addMinutes(current, slotDuration), workingHoursEnd) && allSlots.length <= 4) {
      const slotStart = current;
      const slotEnd = addMinutes(current, slotDuration);

      if (!this.isSlotWithinWorkingHoursAndFuture(slotStart, date, operating_hours[weekDay])) {
        current = addMinutes(current, interval);
        continue;
      }

      const availableTable = await this.findAvailableTable(restaurantId, slotStart, slotEnd, num_people);

      if (availableTable) {
        allSlots.push(format(slotStart, "yyyy-MM-dd'T'HH:mm:ss"));
      }

      current = addMinutes(current, interval);
    }

    return allSlots;
  }

  async updateBooking(id: number, updateBookingStatusDto: UpdateBookingStatusDto, user: User): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['table', 'client', 'table.restaurant', 'table.restaurant.owner'],
    });

    if (!booking) throwNotFound('Booking');

    this.ensureBookingAccess(booking, user);

    const { num_people, start_time, status } = updateBookingStatusDto;

    if (status) {
      booking.status = status;
    }

    const isTimeUpdated = !!start_time;
    const isPeopleUpdated = num_people && num_people !== booking.num_people;

    if (isTimeUpdated || isPeopleUpdated) {
      const new_start_time = isTimeUpdated ? new Date(start_time) : booking.start_time;
      const new_people = num_people ?? booking.num_people;

      const duration = booking.table.restaurant.booking_duration;
      const new_end_time = addMinutes(new_start_time, duration);

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
