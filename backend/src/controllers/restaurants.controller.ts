import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from 'src/services/restaurants.service';
import { CreateRestaurantDto } from 'src/dto/createRestaurant.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from 'src/db/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { GetRestaurantsQueryDto } from 'src/dto/getRestaurantQuery.dto';
import { UpdateRestaurantDto } from 'src/dto/updateRestaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(@Query() getRestaurantQueryDto: GetRestaurantsQueryDto): Promise<[Restaurant[], number]> {
    return this.restaurantsService.getAll(getRestaurantQueryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Get('my')
  async getRestaurants(@CurrentUser() user: User): Promise<Restaurant[]> {
    return this.restaurantsService.getOwnedRestaurants(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @Get(':id')
  async getRestaurantById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Restaurant | null> {
    return this.restaurantsService.getRestaurantById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Get('my/:id')
  async getOwnedRestaurant(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<Restaurant | null> {
    return this.restaurantsService.getOneOwnedRestaurant(id, user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Post()
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(createRestaurantDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Patch(':id')
  async updateRestaurant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.update(id, updateRestaurantDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Patch(':id/file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadRestaurantFile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: 'logo' | 'menu',
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.uploadFile(id, file, type, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Delete(':id')
  async deleteRestaurant(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<Restaurant> {
    return await this.restaurantsService.delete(id, user);
  }
}
