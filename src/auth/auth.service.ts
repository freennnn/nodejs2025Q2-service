import {
  Injectable,
  ForbiddenException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto, LoginDto, RefreshDto, TokensResponseDto } from './dto';
import { User } from '../../generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<User> {
    const { login, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { login },
    });

    if (existingUser) {
      throw new ConflictException('User with this login already exists');
    }

    // Hash password
    const saltRounds = parseInt(process.env.CRYPT_SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user with hashed password
    const user = await this.prisma.user.create({
      data: {
        login,
        password: hashedPassword,
      },
    });

    return user;
  }

  async login(loginDto: LoginDto): Promise<TokensResponseDto> {
    const { login, password } = loginDto;

    // Find user by login
    const user = await this.prisma.user.findUnique({
      where: { login },
    });

    if (!user) {
      throw new ForbiddenException('Wrong login or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong login or password');
    }

    // Generate tokens
    return this.generateTokens(user.id, user.login);
  }

  async refresh(refreshDto: RefreshDto): Promise<TokensResponseDto> {
    const { refreshToken } = refreshDto;

    // Check if refreshToken is provided (even though DTO validation should catch this)
    if (!refreshToken || refreshToken.trim() === '') {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      // Generate new tokens
      return this.generateTokens(payload.userId, payload.login);
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  private async generateTokens(
    userId: string,
    login: string,
  ): Promise<TokensResponseDto> {
    const payload = { userId, login };

    const accessTokenExpiresIn = process.env.TOKEN_EXPIRE_TIME || '30m';
    const refreshTokenExpiresIn = process.env.TOKEN_REFRESH_EXPIRE_TIME || '7d';

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: accessTokenExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: refreshTokenExpiresIn,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
