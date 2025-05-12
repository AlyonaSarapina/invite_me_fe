import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export function throwNotFound(entity: string): never {
  throw new NotFoundException(`${entity} not found`);
}

export function throwBadRequest(message: string): never {
  throw new BadRequestException(message);
}

export function throwForbidden(message: string): never {
  throw new ForbiddenException(message);
}

export function throwConflict(message: string): never {
  throw new ConflictException(message);
}

export function throwUnauthorized(message: string): never {
  throw new UnauthorizedException(message);
}
