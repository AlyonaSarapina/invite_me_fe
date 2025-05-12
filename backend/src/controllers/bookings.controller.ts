import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Booking } from 'src/db/entities/booking.entity';
import { User } from 'src/db/entities/user.entity';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CreateBookingDto } from 'src/dto/createBooking.dto';
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
  async getAll(@CurrentUser() user: User): Promise<Booking[]> {
    const { role, id } = user;
    if (role === UserRole.CLIENT) {
      return this.bookingsService.getClientsBookings(id);
    } else if (role === UserRole.OWNER) {
      return this.bookingsService.getOwnersBookings(id);
    } else {
      throwForbidden('Invalid role');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post(':restaurantId/book')
  async create(
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ): Promise<Booking> {
    return this.bookingsService.createBooking(restaurantId, createBookingDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
    @CurrentUser() user: User,
  ): Promise<Booking> {
    return this.bookingsService.updateBooking(id, updateBookingStatusDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<Booking> {
    return this.bookingsService.cancelBooking(id, user);
  }
}
