import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, RefreshDto, TokensResponseDto } from './dto';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto): Promise<UserResponseDto> {
    const user = await this.authService.signup(signupDto);
    return plainToClass(UserResponseDto, user, {
      excludeExtraneousValues: false,
    });
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<TokensResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: RefreshDto): Promise<TokensResponseDto> {
    return this.authService.refresh(refreshDto);
  }
}
