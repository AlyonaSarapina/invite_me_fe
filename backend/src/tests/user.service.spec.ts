import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../db/entities/user.entity';
import { CloudinaryService } from '../services/cloudinary.service';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockUser: Partial<User> = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  phone: '123456789',
  password: 'hashedpassword',
};

describe('UsersService', () => {
  let service: UsersService;
  let userRepo: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let cloudinaryService: { uploadFile: jest.Mock; deleteFile: jest.Mock };

  beforeEach(async () => {
    userRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findOneBy: jest.fn(),
      softRemove: jest.fn(),
    };

    cloudinaryService = {
      uploadFile: jest.fn(),
      deleteFile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepo,
        },
        {
          provide: CloudinaryService,
          useValue: cloudinaryService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserByPhone', () => {
    it('should return user if found', async () => {
      userRepo.findOne!.mockResolvedValue(mockUser);
      const result = await service.getUserByPhone('123456789');
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      userRepo.findOne!.mockResolvedValue(null);
      await expect(service.getUserByPhone('notfound')).rejects.toThrow(NotFoundException);
    });
  });

  describe('createUser', () => {
    it('should save and return user without password', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      userRepo.create!.mockReturnValue(mockUser);
      userRepo.save!.mockResolvedValue(mockUser);
      const result = await service.createUser(mockUser);
      expect(result).toEqual(userWithoutPassword);
    });
  });

  describe('updateUser', () => {
    it('should update and return user without password', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      userRepo.update!.mockResolvedValue(undefined);
      userRepo.findOneBy!.mockResolvedValue(mockUser);
      const result = await service.updateUser(1, { name: 'Alice Updated' } as any);
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw if updated user not found', async () => {
      userRepo.update!.mockResolvedValue(undefined);
      userRepo.findOneBy!.mockResolvedValue(null);
      await expect(service.updateUser(1, { name: 'Alice Updated' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadFile', () => {
    it('should upload file and update profile_pic_url', async () => {
      const file = { originalname: 'test.jpg' } as Express.Multer.File;
      const userWithExistingPic = { ...mockUser, profile_pic_url: 'old-url' };
      userRepo.findOneBy!.mockResolvedValue(userWithExistingPic);
      userRepo.save!.mockResolvedValue(userWithExistingPic);
      cloudinaryService.uploadFile.mockResolvedValue({ secure_url: 'new-url' });

      const result = await service.uploadFile(userWithExistingPic as User, file);

      expect(cloudinaryService.deleteFile).toHaveBeenCalledWith('old-url');
      expect(result.profile_pic_url).toEqual('new-url');
    });

    it('should throw if no file provided', async () => {
      await expect(service.uploadFile(mockUser as User, undefined as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('removeUser', () => {
    it('should remove and return removed user without password', async () => {
      const { password, ...userWithoutPassword } = mockUser;
      userRepo.findOneBy!.mockResolvedValue(mockUser);
      userRepo.softRemove!.mockResolvedValue(mockUser);
      const result = await service.removeUser(1);
      expect(result).toEqual(userWithoutPassword);
    });

    it('should throw if user not found', async () => {
      userRepo.findOneBy!.mockResolvedValue(null);
      await expect(service.removeUser(999)).rejects.toThrow(NotFoundException);
    });
  });
});
