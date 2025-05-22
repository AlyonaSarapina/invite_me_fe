import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../enums/userRole.enum';
import * as ExceptionUtils from '../utils/exceprions.utils';

jest.mock('bcrypt');
jest.mock('../utils/exceprions.utils', () => ({
  throwConflict: jest.fn(),
  throwUnauthorized: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: jest.Mocked<Partial<UsersService>>;
  let jwtService: jest.Mocked<Partial<JwtService>>;

  beforeEach(() => {
    usersService = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    authService = new AuthService(usersService as UsersService, jwtService as JwtService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      phone: '1234567890',
      date_of_birth: new Date(1995, 11, 17),
      role: UserRole.CLIENT,
    };

    it('should register a new user successfully', async () => {
      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const { password, ...userWithoutPassword } = registerDto;
      (usersService.createUser as jest.Mock).mockResolvedValue(userWithoutPassword);

      const result = await authService.register(registerDto);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(usersService.createUser).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password');
    });

    it('should throw conflict if user already exists', async () => {
      (usersService.getUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });

      await authService.register(registerDto);

      expect(ExceptionUtils.throwConflict).toHaveBeenCalledWith('Email is already registered');
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'john@example.com',
      password: 'hashedPassword',
      role: UserRole.CLIENT,
    };

    it('should login and return access token', async () => {
      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('fake.jwt.token');

      const result = await authService.login(loginDto);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
      expect(result.accessToken).toBe('fake.jwt.token');
    });

    it('should throw if user not found', async () => {
      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow();

      expect(ExceptionUtils.throwUnauthorized).toHaveBeenCalledWith('Invalid email');
    });

    it('should throw if password is invalid', async () => {
      (usersService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await authService.login(loginDto);

      expect(ExceptionUtils.throwUnauthorized).toHaveBeenCalledWith('Invalid password');
    });
  });
});
