import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import { CloudinaryService } from './cloudinary.service';
import { throwBadRequest, throwNotFound } from 'src/utils/exceprions.utils';
import { UpdateUserDto } from 'src/dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getUserByPhone(phone: string) {
    const user = await this.userRepo.findOne({
      where: { phone },
      withDeleted: false,
    });

    if (!user) throwNotFound('User');

    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email, deleted_at: IsNull() } });
  }

  async createUser(data: Partial<User>): Promise<Omit<User, 'password'>> {
    const user = this.userRepo.create(data);
    const savedUser = await this.userRepo.save(user);
    return this.excludePassword(savedUser);
  }

  async updateUser(id: number, updates: UpdateUserDto): Promise<Omit<User, 'password'>> {
    await this.userRepo.update(id, updates);

    const updatedUser = await this.userRepo.findOneBy({ id });

    if (!updatedUser) throwNotFound('User');

    return this.excludePassword(updatedUser);
  }

  async uploadFile(user: User, file: Express.Multer.File): Promise<Omit<User, 'password'>> {
    if (!file) throwBadRequest('File is required');

    await this.cloudinaryService.deleteFile(user.profile_pic_url);

    const result = await this.cloudinaryService.uploadFile(file, 'users');

    user.profile_pic_url = result.secure_url;

    await this.userRepo.save(user);

    const updatedUser = await this.userRepo.findOneBy({ id: user.id });

    if (!updatedUser) throwNotFound('User');

    return this.excludePassword(updatedUser);
  }

  async removeUser(id: number): Promise<Omit<User, 'password'>> {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) throwNotFound('User');

    await this.userRepo.softRemove(user);

    return this.excludePassword(user);
  }

  excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userInfo } = user;

    return userInfo;
  }
}
