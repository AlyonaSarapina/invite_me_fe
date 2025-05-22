import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { User } from 'src/db/entities/user.entity';
import { CreateRestaurantDto } from 'src/dto/createRestaurant.dto';
import { FindOptionsWhere, ILike, In, IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';
import { GetRestaurantsQueryDto } from 'src/dto/getRestaurantQuery.dto';
import { throwBadRequest, throwNotFound } from 'src/utils/exceprions.utils';
import { UpdateRestaurantDto } from 'src/dto/updateRestaurant.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getAll(
    user: User,
    query: GetRestaurantsQueryDto,
  ): Promise<{ data: Restaurant[]; total: number; limit: number; offset: number }> {
    const { limit = 10, offset = 0, name, min_rating, cuisine, is_pet_friendly } = query;

    const where: FindOptionsWhere<Restaurant> = {
      deleted_at: IsNull(),
      ...(min_rating && { rating: MoreThanOrEqual(min_rating) }),
      ...(cuisine && { cuisine: In(cuisine) }),
      is_pet_friendly,
      ...(name && { name: ILike(`${name}%`) }),
    };

    if (user.role === 'owner') {
      where.owner = { id: user.id };
    }

    const [data, total] = await this.restaurantRepo.findAndCount({
      where,
      relations: ['owner', 'tables'],
      take: limit,
      skip: offset,
    });

    return { data, total, limit, offset };
  }

  async getOwnedRestaurants(ownerId: number): Promise<Restaurant[]> {
    const restaurants = await this.restaurantRepo.find({
      where: { owner: { id: ownerId }, deleted_at: IsNull() },
      relations: ['owner', 'tables'],
    });

    if (restaurants.length === 0) throwNotFound('Restaurants');

    return restaurants;
  }

  async getOneOwnedRestaurant(restaurantId: number, ownerId: number): Promise<Restaurant> {
    const restaurant = (await this.getOwnedRestaurants(ownerId)).find((restaurant) => restaurant.id === restaurantId);

    if (!restaurant) throwNotFound('Restaurant');

    return restaurant;
  }

  async getRestaurantById(id: number) {
    return await this.restaurantRepo.findOneOrFail({
      where: { id, deleted_at: IsNull() },
      relations: ['tables', 'tables.bookings', 'owner'],
    });
  }

  async create(dto: CreateRestaurantDto, owner: User): Promise<Restaurant> {
    const restaurant = this.restaurantRepo.create({
      ...dto,
      owner,
    });

    return await this.restaurantRepo.save(restaurant);
  }

  async update(id: number, dto: UpdateRestaurantDto, user: User): Promise<Restaurant> {
    const restaurant = await this.getOneOwnedRestaurant(id, user.id);

    Object.assign(restaurant, dto);
    return await this.restaurantRepo.save(restaurant);
  }

  async uploadFile(id: number, file: Express.Multer.File, type: 'logo' | 'menu', user: User): Promise<Restaurant> {
    if (!file) throwBadRequest('File is required');

    const restaurant = await this.getOneOwnedRestaurant(id, user.id);

    const result = await this.cloudinaryService.uploadFile(file, `${type}s`);

    if (type === 'logo') {
      if (restaurant.logo_url !== null) {
        await this.cloudinaryService.deleteFile(restaurant.logo_url);
      }
      restaurant.logo_url = result.secure_url;
    } else if (type === 'menu') {
      if (restaurant.menu_url !== null) {
        await this.cloudinaryService.deleteFile(restaurant.menu_url);
      }
      restaurant.menu_url = result.secure_url;
    } else {
      throwBadRequest('Invalid file type');
    }

    return await this.restaurantRepo.save(restaurant);
  }

  async delete(id: number, user: User): Promise<Restaurant> {
    const restaurant = await this.getOneOwnedRestaurant(id, user.id);

    await this.restaurantRepo.softRemove(restaurant);

    return restaurant;
  }
}
