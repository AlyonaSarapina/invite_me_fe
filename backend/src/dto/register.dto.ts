import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from 'src/enums/userRole.enum';

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsOptional()
  date_of_birth?: Date;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}
