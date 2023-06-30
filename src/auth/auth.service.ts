import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from '../services/password.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SecurityConfig } from 'src/common/configs/config.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
  ) {}

  async registration(createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await this.passwordService.hash(
        createUserDto.password,
      );

      const result = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
      });

      return {
        status: 'ok',
        message: `User ${result.email} successfully register`,
      };
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2002'
      ) {
        throw new ConflictException(
          `Email ${createUserDto.email} already used.`,
        );
      } else {
        throw new Error(e);
      }
    }
  }

  async login(user) {
    const payload = { email: user.email, id: user.id };

    const tokens = await this.getTokens(payload);


    return {
      access_token: tokens.accessToken,
    };
  }

  async logout(userId: string) {
    return this.usersService.update(Number(userId), { refreshToken: null });
  }

  

  async getTokens(payload) {

    const securityConfig = this.configService.get<SecurityConfig>("security");

    const accessToken = await
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: securityConfig.expiresIn,
      })
    return {
      accessToken,
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordMatch = await this.passwordService.validate(
        pass,
        user.password,
      );

      if (isPasswordMatch) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    }
    return null;
  }
}
