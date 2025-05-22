import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../db/entities/user.entity';
import { RegisterDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from './users.service';
import { throwConflict, throwUnauthorized } from '../utils/exceprions.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const existingUser = await this.usersService.getUserByEmail(registerDto.email);
    if (existingUser) throwConflict('Email is already registered');

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = await this.usersService.createUser({
      ...registerDto,
      password: hashedPassword,
    });

    return newUser;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    const user = await this.usersService.getUserByEmail(email);

    if (!user) throwUnauthorized('Invalid email');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) throwUnauthorized('Invalid password');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
