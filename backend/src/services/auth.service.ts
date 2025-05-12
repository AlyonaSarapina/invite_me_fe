import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/db/entities/user.entity';
import { RegisterDto } from 'src/dto/register.dto';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from 'src/dto/login.dto';
import { UsersService } from './users.service';
import { throwConflict, throwUnauthorized } from 'src/utils/exceprions.utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Omit<User, 'password'>> {
    const { email, password } = registerDto;

    const existingUser = await this.usersService.getUserByEmail(email);
    if (existingUser) throwConflict('Email is already registered');

    const hashedPassword = await bcrypt.hash(password, 10);
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
