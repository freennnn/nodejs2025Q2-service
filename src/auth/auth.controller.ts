import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, RefreshDto, TokensResponseDto } from './dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<UserResponseDto> {
    const user = await this.authService.signup(signupDto);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokensResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: RefreshDto): Promise<TokensResponseDto> {
    return this.authService.refresh(refreshDto);
  }
}
