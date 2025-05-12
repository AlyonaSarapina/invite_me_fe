import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Table } from 'src/db/entities/table.entity';
import { User } from 'src/db/entities/user.entity';
import { Roles } from 'src/decorators/roles.decorator';
import { CurrentUser } from 'src/decorators/user.decorator';
import { CreateTableDto } from 'src/dto/createTable.dto';
import { UpdateTableDto } from 'src/dto/updateTable.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { TablesService } from 'src/services/tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Get(':id')
  async getTablesByRestaurant(@Param('id', ParseIntPipe) id: number): Promise<Table> {
    return this.tablesService.getTableById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Post()
  async createTable(@Body() createTableDto: CreateTableDto, @CurrentUser() user: User): Promise<Table> {
    return this.tablesService.create(createTableDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Patch(':id')
  async updateTable(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTableDto: UpdateTableDto,
    @CurrentUser() user: User,
  ): Promise<Table> {
    return this.tablesService.update(id, updateTableDto, user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  @Delete(':id')
  async deleteTable(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: User): Promise<Table> {
    return this.tablesService.delete(id, user);
  }
}
