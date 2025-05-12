import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/db/entities/restaurant.entity';
import { User } from 'src/db/entities/user.entity';
import { CreateRestaurantDto } from 'src/dto/createRestaurant.dto';
import { FindOptionsWhere, ILike, IsNull, MoreThanOrEqual, Repository } from 'typeorm';
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

  async getAll(getRestaurantQueryDto: GetRestaurantsQueryDto): Promise<[Restaurant[], number]> {
    const { limit = 10, offset = 0, name, min_rating, cuisine, is_pet_friedly } = getRestaurantQueryDto;

    const where: FindOptionsWhere<Restaurant> = {
      deleted_at: IsNull(),
      ...(min_rating && { rating: MoreThanOrEqual(min_rating) }),
      ...(cuisine && { cuisine: ILike(cuisine) }),
      is_pet_friedly,
      ...(name && { name: ILike(`%${name}%`) }),
    };

    return await this.restaurantRepo.findAndCount({
      where,
      skip: offset,
      take: limit,
    });
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
      relations: ['tables', 'tables.bookings'],
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
      await this.cloudinaryService.deleteFile(restaurant.logo_url);
      restaurant.logo_url = result.secure_url;
    } else if (type === 'menu') {
      restaurant.menu_url = result.secure_url;
      await this.cloudinaryService.deleteFile(restaurant.menu_url);
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
