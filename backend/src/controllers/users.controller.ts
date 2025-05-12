import { Body, Controller, Delete, Get, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from 'src/db/entities/user.entity';
import { UpdateUserDto } from 'src/dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@CurrentUser() user: User): Promise<User> {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@CurrentUser() user: User, @Body() updates: UpdateUserDto): Promise<Omit<User, 'password'>> {
    return this.userService.updateUser(user.id, updates);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProfilePicture(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Omit<User, 'password'>> {
    return this.userService.uploadFile(user, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@CurrentUser() user: User): Promise<Omit<User, 'password'>> {
    return this.userService.removeUser(user.id);
  }
}
