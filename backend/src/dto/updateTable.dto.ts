import { PartialType } from '@nestjs/swagger';
import { CreateTableDto } from './createTable.dto';

export class UpdateTableDto extends PartialType(CreateTableDto) {}
