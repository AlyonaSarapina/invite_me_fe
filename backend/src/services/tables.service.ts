import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Table } from 'src/db/entities/table.entity';
import { User } from 'src/db/entities/user.entity';
import { CreateTableDto } from 'src/dto/createTable.dto';
import { IsNull, Repository } from 'typeorm';
import { RestaurantsService } from './restaurants.service';
import { throwBadRequest, throwForbidden, throwNotFound } from 'src/utils/exceprions.utils';
import { UpdateTableDto } from 'src/dto/updateTable.dto';

@Injectable()
export class TablesService {
  constructor(
    @InjectRepository(Table)
    private tableRepo: Repository<Table>,
    private restaurantService: RestaurantsService,
  ) {}

  async getTableById(tableId: number): Promise<Table> {
    const table = await this.tableRepo.findOne({
      where: { id: tableId, deleted_at: IsNull() },
      relations: ['restaurant.owner'],
    });

    if (!table) throwNotFound('Table');

    return table;
  }

  async getTablesByRestaurant(restaurantId: number): Promise<Table[]> {
    return await this.tableRepo.find({
      where: {
        restaurant: {
          id: restaurantId,
          deleted_at: IsNull(),
        },
      },
    });
  }

  async create(dto: CreateTableDto, owner: User): Promise<Table> {
    const restaurant = await this.restaurantService.getOneOwnedRestaurant(dto.restaurant_id, owner.id);

    const currentTableCount = await this.getTablesByRestaurant(restaurant.id);

    if (currentTableCount.length >= restaurant.tables_capacity) {
      throwBadRequest(
        `This restaurant already has the maximum allowed number of tables (${restaurant.tables_capacity}). To add a table please remove one of the existing tables first`,
      );
    }

    const table = this.tableRepo.create({
      ...dto,
      restaurant,
    });

    return await this.tableRepo.save(table);
  }

  async update(tableId: number, dto: UpdateTableDto, owner: User): Promise<Table> {
    const table = await this.getTableById(tableId);

    this.ensureOwnerAccess(table, owner.id);

    Object.assign(table, dto);
    return await this.tableRepo.save(table);
  }

  async delete(tableId: number, owner: User): Promise<Table> {
    const table = await this.getTableById(tableId);

    this.ensureOwnerAccess(table, owner.id);

    await this.tableRepo.softRemove(table);
    return table;
  }

  private ensureOwnerAccess(table: Table, ownerId: number): void {
    if (table.restaurant.owner.id !== ownerId) {
      throwForbidden('You are not allowed to perform this action on this table');
    }
  }
}
