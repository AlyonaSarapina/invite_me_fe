import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Booking } from 'src/db/entities/booking.entity';
import { User } from 'src/db/entities/user.entity';
import { CurrentUser } from 'src/decorators/user.decorator';
import { AvailableSlotsDto } from 'src/dto/availibleStot.dto';
import { CreateBookingDto } from 'src/dto/createBooking.dto';
import { GetBookingsQueryDto } from 'src/dto/getBookingsQuery.dto';
import { UpdateBookingStatusDto } from 'src/dto/updateBooking.dto';
import { UserRole } from 'src/enums/userRole.enum';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BookingsService } from 'src/services/bookings.service';
import { throwForbidden } from 'src/utils/exceprions.utils';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(
    @CurrentUser() user: User,
    @Query() getBookingsQueryDto: GetBookingsQueryDto,
  ): Promise<{ data: Booking[]; total: number; confirmed: number; restaurantNamesList: string[] }> {
    const { role, id } = user;
    if (role) {
      return await this.bookingsService.getBookingsByRole(id, role, getBookingsQueryDto);
    } else {
      throwForbidden('Invalid role');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/available-slots')
  async getAvailableSlots(@Param('id', ParseIntPipe) id: number, @Body() availableSlotsDto: AvailableSlotsDto) {
    return await this.bookingsService.getAvailableBookingSlots(id, availableSlotsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/book')
  async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ): Promise<Booking> {
    return await this.bookingsService.createBooking(id, createBookingDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
    @CurrentUser() user: User,
  ): Promise<Booking> {
    return await this.bookingsService.updateBooking(id, updateBookingStatusDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<Booking> {
    return await this.bookingsService.cancelBooking(id, user);
  }
}
